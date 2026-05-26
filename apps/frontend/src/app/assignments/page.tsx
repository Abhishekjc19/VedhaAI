'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assignment } from '@/types/index';
import { assignmentAPI } from '@/services/api';
import { MainLayout } from '@/components/MainLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AssignmentCard } from '@/components/AssignmentCard';
import { formatDate } from '@/utils/formatting';
import { Search, Filter, Plus } from 'lucide-react';

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
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-1 text-gray-600">Manage and view all your question papers</p>
            </div>
            <button
              onClick={() => router.push('/create')}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Plus className="h-5 w-5" />
              Create Assignment
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900">No assignments found</p>
            <p className="mt-1 text-gray-600">Create your first assignment to get started!</p>
            <button
              onClick={() => router.push('/create')}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
