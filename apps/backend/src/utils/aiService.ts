import { v4 as uuidv4 } from 'uuid';
// import { Anthropic } from 'anthropic';
import { logger } from './logger';

// Temporarily disabled - will be enabled after initial testing
// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

export interface QuestionGenerationRequest {
  topic: string;
  numberOfQuestions: number;
  questionTypes: string[];
  totalMarks: number;
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  additionalInstructions: string;
  fileContent?: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  section: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  type: string;
}

export interface GeneratedQuestionPaper {
  id: string;
  sections: QuestionSection[];
  totalMarks: number;
  generatedAt: string;
}

export interface QuestionSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export async function generateQuestionsUsingAI(
  request: QuestionGenerationRequest
): Promise<GeneratedQuestionPaper> {
  try {
    const prompt = buildPrompt(request);
    
    logger.info(`Generating ${request.numberOfQuestions} questions for topic: ${request.topic}`);
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsedQuestions = parseQuestionsFromResponse(responseText, request);
    
    return {
      id: uuidv4(),
      sections: parsedQuestions,
      totalMarks: request.totalMarks,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error generating questions:', error);
    throw new Error('Failed to generate questions using AI');
  }
}

function buildPrompt(request: QuestionGenerationRequest): string {
  const difficultyDistribution = calculateDifficultyDistribution(
    request.numberOfQuestions,
    request.difficulty
  );

  return `You are an expert educator creating a comprehensive question paper. Generate exactly ${request.numberOfQuestions} questions for the following topic and specifications.

Topic: ${request.topic}
Question Types: ${request.questionTypes.join(', ')}
Total Marks: ${request.totalMarks}
Difficulty Level: ${request.difficulty}
${request.fileContent ? `Reference Material:\n${request.fileContent}\n` : ''}

Difficulty Distribution:
- Easy: ${difficultyDistribution.easy}
- Moderate: ${difficultyDistribution.moderate}
- Hard: ${difficultyDistribution.hard}

Additional Instructions: ${request.additionalInstructions}

Generate the questions in the following JSON format. Return ONLY valid JSON, no other text:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Question text here?",
          "difficulty": "Easy",
          "marks": 1,
          "type": "${request.questionTypes[0]}"
        }
      ]
    }
  ]
}

Important:
1. Distribute questions into logical sections (A, B, C, etc.)
2. Each section should have an instruction
3. Vary the marks distribution
4. Ensure difficulty matches the specified distribution
5. Make questions clear and well-formed
6. Return ONLY valid JSON`;
}

function calculateDifficultyDistribution(
  total: number,
  difficulty: string
): { easy: number; moderate: number; hard: number } {
  if (difficulty === 'easy') {
    return { easy: total, moderate: 0, hard: 0 };
  } else if (difficulty === 'hard') {
    return { easy: 0, moderate: 0, hard: total };
  } else if (difficulty === 'medium') {
    return { easy: 0, moderate: total, hard: 0 };
  } else {
    // mixed
    const easy = Math.floor(total * 0.33);
    const hard = Math.floor(total * 0.33);
    const moderate = total - easy - hard;
    return { easy, moderate, hard };
  }
}

function parseQuestionsFromResponse(
  response: string,
  request: QuestionGenerationRequest
): QuestionSection[] {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Ensure we have the right number of questions
    const sections: QuestionSection[] = [];
    let questionCount = 0;
    let marksUsed = 0;

    for (const section of parsed.sections || []) {
      const questions: GeneratedQuestion[] = [];
      
      for (const q of section.questions || []) {
        if (questionCount >= request.numberOfQuestions) break;
        
        const marks = Math.min(q.marks || 5, request.totalMarks - marksUsed);
        if (marks <= 0) break;

        questions.push({
          id: uuidv4(),
          text: q.text,
          section: section.title,
          difficulty: normalizeDifficulty(q.difficulty),
          marks,
          type: q.type,
        });

        questionCount++;
        marksUsed += marks;
      }

      if (questions.length > 0) {
        sections.push({
          title: section.title,
          instruction: section.instruction || 'Attempt all questions',
          questions,
        });
      }

      if (questionCount >= request.numberOfQuestions) break;
    }

    // If we don't have enough questions, add filler
    if (questionCount < request.numberOfQuestions) {
      const remainingQuestions = request.numberOfQuestions - questionCount;
      const fillerQuestions: GeneratedQuestion[] = [];
      
      for (let i = 0; i < remainingQuestions; i++) {
        fillerQuestions.push({
          id: uuidv4(),
          text: `Question ${questionCount + i + 1}: [${request.topic}]`,
          section: 'Section Additional',
          difficulty: 'Moderate',
          marks: 5,
          type: request.questionTypes[0],
        });
      }

      sections.push({
        title: 'Section Additional',
        instruction: 'Attempt all questions',
        questions: fillerQuestions,
      });
    }

    return sections;
  } catch (error) {
    logger.error('Error parsing questions:', error);
    throw new Error('Failed to parse generated questions');
  }
}

function normalizeDifficulty(difficulty: string): 'Easy' | 'Moderate' | 'Hard' {
  const lower = difficulty.toLowerCase();
  if (lower.includes('easy')) return 'Easy';
  if (lower.includes('hard')) return 'Hard';
  return 'Moderate';
}
