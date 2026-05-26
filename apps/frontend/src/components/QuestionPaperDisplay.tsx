'use client';

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QuestionPaper, QuestionSection } from '@/types/index';
import { Download, BookOpen } from 'lucide-react';

interface QuestionPaperDisplayProps {
  paper: QuestionPaper;
  studentName?: string;
  studentRoll?: string;
  studentSection?: string;
}

export function QuestionPaperDisplay({
  paper,
  studentName,
  studentRoll,
  studentSection,
}: QuestionPaperDisplayProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-easy';
      case 'Moderate':
        return 'badge-moderate';
      case 'Hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  const handleDownloadPDF = async () => {
    if (!paperRef.current) return;

    try {
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('question-paper.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-green-700 hover:to-emerald-700"
        >
          <Download className="h-5 w-5" />
          Download as PDF
        </button>
      </div>

      {/* Question Paper Display */}
      <div
        ref={paperRef}
        className="space-y-8 rounded-lg border border-gray-200 bg-white p-12 shadow-lg"
      >
        {/* Header Section */}
        <div className="border-b-2 border-gray-300 pb-6 text-center">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">Question Paper</h2>
          <p className="mb-4 text-gray-600">
            Generated on {new Date(paper.generatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Name</p>
            <p className="border-b border-gray-400 py-1 text-gray-900">
              {studentName || '________________________'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Roll No.</p>
            <p className="border-b border-gray-400 py-1 text-gray-900">
              {studentRoll || '________________________'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Section</p>
            <p className="border-b border-gray-400 py-1 text-gray-900">
              {studentSection || '________________________'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Instructions:</p>
          <ul className="mt-2 list-inside space-y-1 text-sm text-blue-800">
            <li>• Answer all questions in the provided space</li>
            <li>• Marks are indicated for each question</li>
            <li>• Total Marks: {paper.totalMarks}</li>
          </ul>
        </div>

        {/* Sections with Questions */}
        {paper.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            {/* Section Header */}
            <div className="border-l-4 border-blue-600 bg-blue-50 px-4 py-3">
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-600">{section.instruction}</p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {section.questions.map((question, qIndex) => (
                <div key={question.id} className="border-l-2 border-gray-300 pl-4">
                  {/* Question Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="mb-1 font-semibold text-gray-900">
                        Q{sectionIndex + 1}.{qIndex + 1}. {question.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                          {question.marks} marks
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Answer Space */}
                  <div className="mt-3 space-y-2">
                    {Array(Math.ceil(question.marks / 5))
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="border-b border-gray-400" style={{ height: '24px' }} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center">
          <p className="text-xs text-gray-600">
            Generated by VedaAI - Assessment Creator
          </p>
        </div>
      </div>
    </div>
  );
}
