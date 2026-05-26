'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreateAssignmentForm } from '@/components/CreateAssignmentForm';
import { BookOpen } from 'lucide-react';

export default function CreateAssignmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">VedaAI</span>
            </div>
            <p className="text-sm text-gray-600">Assessment Creator</p>
          </div>
        </div>
      </nav>

      <CreateAssignmentForm />
    </div>
  );
}
