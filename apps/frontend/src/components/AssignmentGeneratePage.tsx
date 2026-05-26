'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Assignment, QuestionPaper, GenerationProgress } from '@/types/index';
import { assignmentAPI } from '@/services/api';
import { useAssignmentStore } from '@/store/assignmentStore';
import {
  joinAssignment,
  leaveAssignment,
  onGenerationComplete,
  onGenerationError,
  useSocket,
} from '@/services/websocket';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { QuestionPaperDisplay } from '@/components/QuestionPaperDisplay';
import { CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

export function AssignmentGeneratePage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string;

  const {
    currentAssignment,
    setCurrentAssignment,
    currentPaper,
    setCurrentPaper,
    generationProgress,
    setGenerationProgress,
    isGenerating,
    setIsGenerating,
  } = useAssignmentStore();

  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!assignmentId) return;

    const loadAssignment = async () => {
      try {
        const assignment = await assignmentAPI.getAssignment(assignmentId);
        setCurrentAssignment(assignment);

        if (assignment.questionPaperId) {
          const paper = await assignmentAPI.getQuestionPaper(assignment.questionPaperId);
          setCurrentPaper(paper);
        }
      } catch (err) {
        console.error('Error loading assignment:', err);
        setError('Failed to load assignment');
      }
    };

    loadAssignment();
    joinAssignment(assignmentId);

    return () => {
      leaveAssignment(assignmentId);
    };
  }, [assignmentId, setCurrentAssignment, setCurrentPaper]);

  useEffect(() => {
    if (!socket) return;

    const handleGenerationComplete = (data: any) => {
      setIsGenerating(false);
      setGenerationProgress(null);

      const loadPaper = async () => {
        try {
          const paper = await assignmentAPI.getQuestionPaper(data.paperId);
          setCurrentPaper(paper);
        } catch (err) {
          console.error('Error loading generated paper:', err);
          setError('Failed to load generated paper');
        }
      };

      loadPaper();
    };

    const handleGenerationError = (data: any) => {
      setIsGenerating(false);
      setError(data.error || 'Generation failed');
    };

    onGenerationComplete(handleGenerationComplete);
    onGenerationError(handleGenerationError);
  }, [socket, setIsGenerating, setGenerationProgress, setCurrentPaper]);

  const handleGenerate = async () => {
    if (!currentAssignment) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress({
      stage: 'Initializing...',
      percentage: 0,
      message: 'Starting question generation',
    });

    try {
      await assignmentAPI.generateQuestions(assignmentId);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to start generation');
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setCurrentPaper(null);
    handleGenerate();
  };

  if (!currentAssignment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading assignment..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentAssignment.title}</h1>
              <p className="mt-1 text-gray-600">{currentAssignment.topic}</p>
            </div>
            <button
              onClick={() => router.push('/assignments')}
              className="btn-secondary"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
            </div>
          </div>
        )}

        {!currentPaper && isGenerating && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-8">
            <LoadingSpinner size="lg" message="Generating your question paper..." />
            {generationProgress && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{generationProgress.stage}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {generationProgress.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                    style={{ width: `${generationProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!currentPaper && !isGenerating && !error && (
          <div className="text-center">
            <button onClick={handleGenerate} className="btn-primary">
              Generate Question Paper
            </button>
          </div>
        )}

        {currentPaper && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Question paper generated successfully!</p>
                  <p className="text-sm text-green-800">
                    {currentPaper.sections.length} sections with {currentPaper.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions
                  </p>
                </div>
              </div>
              <button
                onClick={handleRegenerate}
                className="btn-secondary flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </button>
            </div>

            <QuestionPaperDisplay paper={currentPaper} />
          </div>
        )}
      </div>
    </div>
  );
}
