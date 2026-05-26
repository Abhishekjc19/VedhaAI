'use client';

import React from 'react';
import Link from 'next/link';
import { MoreVertical, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/formatting';
import { Assignment } from '@/types';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  const statusBg = statusColors[assignment.status as keyof typeof statusColors] || statusColors.draft;

  return (
    <Link href={`/assignment/${assignment.id}/generate`}>
      <div className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
            className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-5 top-12 z-10 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(assignment.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Assignment Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Assigned on:</span>
            <span>{formatDate(assignment.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Due:</span>
            <span>{formatDate(assignment.dueDate)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBg}`}>
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            {assignment.numberOfQuestions} questions
          </span>
        </div>
      </div>
    </Link>
  );
}
