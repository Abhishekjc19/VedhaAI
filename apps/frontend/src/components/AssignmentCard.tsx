'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/utils/formatting';
import { Assignment } from '@/types';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusBg = statusColors[assignment.status as keyof typeof statusColors] || statusColors.pending;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
          <p className="text-sm text-gray-500">Topic: {assignment.topic}</p>
        </div>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium border ${statusBg}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>

      <div className="mb-3 text-sm text-gray-600">
        <p className="line-clamp-2">{assignment.description}</p>
      </div>

      <div className="mb-4 flex gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-700">{assignment.questionCount}</span>
          <span className="text-gray-500"> Questions</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{assignment.totalMarks}</span>
          <span className="text-gray-500"> Marks</span>
        </div>
        <div className="ml-auto">
          <span className="text-gray-500">Due: </span>
          <span className="font-medium text-gray-700">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 flex gap-2">
        <Link
          href={`/assignment/${assignment._id}/generate`}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
        <button
          onClick={() => onDelete?.(assignment._id)}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
