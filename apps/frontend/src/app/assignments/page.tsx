'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assignment } from '@/types/index';
import { assignmentAPI } from '@/services/api';
import { MainLayout } from '@/components/MainLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AssignmentCard } from '@/components/AssignmentCard';
import { Search, Filter, Plus, FileX } from 'lucide-react';

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const result = await assignmentAPI.listAssignments();
        setAssignments(result.data || []);
      } catch (error) {
        console.error('Error loading assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentAPI.deleteAssignment(id);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner message="Loading assignments..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto h-full max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your question papers and assignments</p>
            </div>
          </div>

          {/* Search and Filter - Only show if there are assignments */}
          {assignments.length > 0 && (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
        </div>

        {/* Empty State or Assignments Grid */}
        {filteredAssignments.length === 0 && assignments.length === 0 ? (
          <div className="flex h-[calc(100vh-250px)] items-center justify-center">
            <div className="text-center max-w-md">
              {/* Empty State Illustration */}
              <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -left-4 top-8 text-4xl">📝</div>
                  <div className="absolute -right-2 top-4 text-2xl">✏️</div>
                  <div className="absolute bottom-4 left-8 text-2xl">📊</div>
                  
                  {/* Main icon */}
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                    <FileX className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              </div>

              <h2 className="mb-2 text-xl font-bold text-gray-900">No assignments yet</h2>
              <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                Create your first assignment to start collecting and grading student submissions. 
                You can set up rubrics, define marking criteria, and let AI assist with grading.
              </p>
              
              <button
                onClick={() => router.push('/create')}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Create Your First Assignment
              </button>
            </div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="flex h-[calc(100vh-300px)] items-center justify-center">
            <div className="text-center">
              <FileX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">No assignments found</p>
              <p className="mt-1 text-sm text-gray-600">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

