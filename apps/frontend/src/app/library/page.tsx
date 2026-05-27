'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { BookOpen, Plus, Search } from 'lucide-react';

export default function LibraryPage() {
  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <p className="text-gray-600 mt-2">Your saved question papers and templates</p>
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <Plus className="h-5 w-5" />
            Add to Library
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your library..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your library is empty</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Save your favorite question papers and templates here for quick access later.
          </p>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <Plus className="h-5 w-5" />
            Browse Templates
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
