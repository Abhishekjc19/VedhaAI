'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Assignment } from '@/types/index';
import { assignmentAPI } from '@/services/api';
import { useAssignmentStore } from '@/store/assignmentStore';
import { ChevronUp, ChevronDown, Loader, Plus } from 'lucide-react';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  topic: z.string().min(1, 'Topic is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z.array(z.string()).min(1, 'Select at least one question type'),
  numberOfQuestions: z.number().min(1, 'Minimum 1 question').max(100, 'Maximum 100 questions'),
  totalMarks: z.number().min(1, 'Minimum 1 mark').max(500, 'Maximum 500 marks'),
  additionalInstructions: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

const questionTypeOptions = [
  { value: 'multiple-choice', label: 'Multiple Choice Questions', color: 'bg-blue-50' },
  { value: 'short-answer', label: 'Short Questions', color: 'bg-green-50' },
  { value: 'essay', label: 'Essay Questions', color: 'bg-purple-50' },
  { value: 'true-false', label: 'True/False', color: 'bg-orange-50' },
  { value: 'matching', label: 'Matching Questions', color: 'bg-pink-50' },
];

export function CreateAssignmentForm() {
  const router = useRouter();
  const { setCurrentAssignment, setIsGenerating } = useAssignmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionTypeCounts, setQuestionTypeCounts] = useState<Record<string, { count: number; marks: number }>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      topic: '',
      description: '',
      dueDate: '',
      questionTypes: [],
      numberOfQuestions: 25,
      totalMarks: 60,
      additionalInstructions: '',
    },
  });

  const numberOfQuestions = watch('numberOfQuestions');
  const totalMarks = watch('totalMarks');
  const selectedTypes = Object.keys(questionTypeCounts).filter(key => {
    const typeData = questionTypeCounts[key];
    return typeData && typeData.count > 0;
  });

  const onSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const assignment = await assignmentAPI.createAssignment({
        ...data,
        questionTypes: selectedTypes,
      });

      setCurrentAssignment(assignment as Assignment);
      setIsGenerating(false);
      router.push(`/assignment/${assignment.id}/generate`);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuestionTypeCount = (type: string, delta: number) => {
    const current = questionTypeCounts[type] || { count: 0, marks: 0 };
    const newCount = Math.max(0, current.count + delta);
    setQuestionTypeCounts(prev => ({
      ...prev,
      [type]: { count: newCount, marks: current.marks }
    }));
    setValue('questionTypes', Object.keys(questionTypeCounts).filter(k => {
      const typeData = questionTypeCounts[k];
      return typeData && typeData.count > 0;
    }));
  };

  const updateQuestionTypeMarks = (type: string, marks: number) => {
    const current = questionTypeCounts[type] || { count: 0, marks: 0 };
    setQuestionTypeCounts(prev => ({
      ...prev,
      [type]: { count: current.count, marks: Math.max(0, marks) }
    }));
  };

  const totalQuestionsCount = Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.count || 0), 0);
  const totalMarksCount = Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.marks || 0), 0);

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Assignment Details Section */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Assignment Details</h2>
          <p className="mb-6 text-sm text-gray-600">Basic information about your assignment</p>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g., Quiz on Electricity"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Material (Optional)
              </label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-600">Choose a file or drag & drop it here</p>
                <p className="text-xs text-gray-500">JPEG, PNG, PDF, up to 10MB</p>
                <button type="button" className="mt-3 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Browse Files
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>
          </div>
        </div>

        {/* Question Types Section */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Question Type</h2>
          <p className="mb-6 text-sm text-gray-600">Select question types and configure</p>
          
          <div className="space-y-3">
            {questionTypeOptions.map((option) => {
              const typeData = questionTypeCounts[option.value];
              const isSelected = typeData && typeData.count > 0;
              
              return (
                <div key={option.value} className={`rounded-lg border p-4 transition-colors ${isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    </div>
                    
                    {/* No. of Questions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 whitespace-nowrap">No. of Questions</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeCount(option.value, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={typeData?.count || 0}
                          className="w-12 text-center border-0 py-1 text-sm focus:outline-none"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => updateQuestionTypeCount(option.value, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Marks */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 whitespace-nowrap">Marks</span>
                      <input
                        type="number"
                        value={typeData?.marks || 0}
                        onChange={(e) => updateQuestionTypeMarks(option.value, parseInt(e.target.value) || 0)}
                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                      />
                    </div>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => setQuestionTypeCounts(prev => {
                          const newCounts = { ...prev };
                          delete newCounts[option.value];
                          return newCounts;
                        })}
                        className="text-gray-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              <Plus className="h-4 w-4" />
              Add Question Type
            </button>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestionsCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Marks</p>
              <p className="text-2xl font-bold text-gray-900">{totalMarksCount}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Additional Information (For better output)</h2>
          <p className="mb-4 text-sm text-gray-600">Provide any special instructions</p>
          <textarea
            {...register('additionalInstructions')}
            placeholder="e.g., Focus on application-based questions, include real-world examples..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting || totalQuestionsCount === 0}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
