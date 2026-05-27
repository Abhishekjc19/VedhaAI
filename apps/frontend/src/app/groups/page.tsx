'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Users, Plus } from 'lucide-react';

export default function GroupsPage() {
  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-600 mt-2">Manage your student groups and classes</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No groups yet</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Create groups to organize your students and assign question papers to specific classes.
          </p>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <Plus className="h-5 w-5" />
            Create Your First Group
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
