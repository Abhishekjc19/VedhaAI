'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateAssignmentForm } from '@/components/CreateAssignmentForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assignments
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
            <p className="mt-1 text-sm text-gray-600">Fill in the details to generate your question paper</p>
          </div>

          <CreateAssignmentForm />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

