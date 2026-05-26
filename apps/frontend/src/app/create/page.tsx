'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreateAssignmentForm } from '@/components/CreateAssignmentForm';
import { MainLayout } from '@/components/MainLayout';

export default function CreatePage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <CreateAssignmentForm />
      </div>
    </MainLayout>
  );
}
