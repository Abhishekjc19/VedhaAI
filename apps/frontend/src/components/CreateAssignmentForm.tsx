'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Assignment } from '@/types/index';
import { assignmentAPI } from '@/services/api';
import { useAssignmentStore } from '@/store/assignmentStore';
import { ChevronUp, ChevronDown, Loader } from 'lucide-react';

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

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Assignment</h1>
          <p className="text-gray-600">Design your question paper with AI assistance</p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Assignment Details Section */}
            <div className="border-b border-gray-200 p-8">
              <h2 className="mb-2 text-lg font-bold text-gray-900">Assignment Details</h2>
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('topic')}
                      type="text"
                      placeholder="e.g., Class 5th"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('dueDate')}
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    placeholder="Additional context about this assignment..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Material (Optional)
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Choose a file or drag & drop it here</p>
                    <p className="text-xs text-gray-500">(PDF, Word, Images up to 10MB)</p>
                    <button type="button" className="mt-3 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Types Section */}
            <div className="border-b border-gray-200 p-8">
              <h2 className="mb-2 text-lg font-bold text-gray-900">Question Types</h2>
              <p className="mb-6 text-sm text-gray-600">Select question types and set count and marks</p>
              
              <div className="space-y-3">
                {questionTypeOptions.map((option) => (
                  <div key={option.value} className={`rounded-lg border border-gray-300 p-4 ${questionTypeCounts[option.value]?.count > 0 ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{option.label}</p>
                      </div>
                      
                      {/* No. of Questions */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 min-w-fit">No. of Questions</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuestionTypeCount(option.value, -1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <input
                            type="text"
                            value={questionTypeCounts[option.value]?.count || 0}
                            className="w-12 text-center border-0 py-1 focus:outline-none"
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
                        <span className="text-xs text-gray-600 min-w-fit">Marks</span>
                        <input
                          type="number"
                          value={questionTypeCounts[option.value]?.marks || 0}
                          onChange={(e) => updateQuestionTypeMarks(option.value, parseInt(e.target.value) || 0)}
                          className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-b border-gray-200 p-8 bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.count || 0), 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.marks || 0), 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg. Per Question</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.count || 0), 0) > 0
                      ? (Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.marks || 0), 0) / Object.values(questionTypeCounts).reduce((sum, q) => sum + (q?.count || 0), 0)).toFixed(1)
                      : '0'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="border-b border-gray-200 p-8">
              <h2 className="mb-2 text-lg font-bold text-gray-900">Additional Information</h2>
              <p className="mb-6 text-sm text-gray-600">For better output</p>
              <textarea
                {...register('additionalInstructions')}
                placeholder="Any special instructions for the AI when generating questions? e.g., 'Focus on application-based questions' or 'Include real-world examples'"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 p-8 bg-gray-50">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Next →'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
