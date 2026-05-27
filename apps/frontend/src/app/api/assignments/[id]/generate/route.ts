import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: assignmentId } = params;
    const body = await request.json();
    const { difficulty = 'mixed', fileContent } = body;

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Update assignment status to processing
    await supabase
      .from('assignments')
      .update({ status: 'processing' })
      .eq('id', assignmentId);

    // Dynamically import Google Generative AI
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    // Generate questions using AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a structured question paper based on the following requirements:

Topic: ${assignment.topic}
Number of Questions: ${assignment.number_of_questions}
Total Marks: ${assignment.total_marks}
Question Types: ${JSON.stringify(assignment.question_types)}
Difficulty: ${difficulty}
Additional Instructions: ${assignment.additional_instructions || 'None'}
${fileContent ? `\nReference Content:\n${fileContent}` : ''}

Please generate questions in the following JSON format:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "questionText": "Question text here",
          "marks": 5,
          "difficulty": "easy|medium|hard",
          "type": "mcq|short|long|true-false"
        }
      ]
    }
  ]
}

Ensure the total marks add up to ${assignment.total_marks} and distribute questions according to the specified types.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the AI response
    let questionPaper;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch && jsonMatch[1] ? jsonMatch[1] : text;
      questionPaper = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI-generated questions');
    }

    // Generate a unique ID for the question paper
    const paperId = `qp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save question paper to database
    const { error: paperError } = await supabase
      .from('question_papers')
      .insert({
        id: paperId,
        assignment_id: assignmentId,
        sections: questionPaper.sections,
        created_at: new Date().toISOString(),
      });

    if (paperError) throw paperError;

    // Update assignment with question paper ID
    await supabase
      .from('assignments')
      .update({
        question_paper_id: paperId,
        questions_generated: true,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignmentId);

    return NextResponse.json({
      jobId: paperId,
      status: 'completed',
      message: 'Questions generated successfully',
      questionPaperId: paperId,
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);

    // Update assignment status to failed
    const { id: assignmentId } = params;
    await supabase
      .from('assignments')
      .update({ status: 'failed' })
      .eq('id', assignmentId);

    return NextResponse.json(
      { error: 'Failed to generate questions', details: error.message },
      { status: 500 }
    );
  }
}
