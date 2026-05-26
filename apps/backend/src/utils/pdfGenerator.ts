import { jsPDF } from 'jspdf';
import { GeneratedQuestionPaper } from './aiService';

export async function generatePDFFromPaper(
  paper: GeneratedQuestionPaper,
  studentName?: string,
  studentRoll?: string,
  studentSection?: string
): Promise<Buffer> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 270) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Title
  pdf.setFontSize(20);
  pdf.text('Question Paper', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Student Info
  pdf.setFontSize(10);
  pdf.text(`Name: ${studentName || '_________________'}`, 20, yPosition);
  pdf.text(`Roll No: ${studentRoll || '_________________'}`, 20, yPosition + 7);
  pdf.text(`Section: ${studentSection || '_________________'}`, 20, yPosition + 14);
  yPosition += 25;

  // Instructions
  pdf.setFontSize(12);
  pdf.text('Instructions:', 20, yPosition);
  yPosition += 8;
  pdf.setFontSize(10);
  pdf.text('Answer all questions in the provided space', 25, yPosition);
  yPosition += 10;

  // Sections
  for (const section of paper.sections) {
    checkNewPage(20);
    
    // Section Header
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 139);
    pdf.text(section.title, 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(section.instruction, 20, yPosition);
    yPosition += 10;

    // Questions
    for (const question of section.questions) {
      checkNewPage(30);

      // Question text
      const questionLines = pdf.splitTextToSize(
        `Q${section.title.charCodeAt(section.title.length - 1)}: ${question.text}`,
        170
      );
      pdf.text(questionLines, 20, yPosition);
      yPosition += questionLines.length * 5 + 2;

      // Difficulty and marks
      pdf.setFontSize(9);
      pdf.text(`Difficulty: ${question.difficulty} | Marks: ${question.marks}`, 20, yPosition);
      yPosition += 8;

      // Answer space
      pdf.rect(20, yPosition, 170, 20);
      yPosition += 25;
    }

    yPosition += 5;
  }

  return Buffer.from(pdf.output('arraybuffer'));
}
