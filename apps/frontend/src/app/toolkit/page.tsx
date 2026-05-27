'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { BookOpen, Sparkles, FileText, Brain, Target, Lightbulb } from 'lucide-react';

export default function ToolkitPage() {
  const tools = [
    {
      icon: Brain,
      title: 'Question Generator',
      description: 'Generate custom questions using AI',
      color: 'bg-blue-100 text-blue-600',
      available: true,
    },
    {
      icon: FileText,
      title: 'Rubric Creator',
      description: 'Create grading rubrics automatically',
      color: 'bg-purple-100 text-purple-600',
      available: false,
    },
    {
      icon: Target,
      title: 'Learning Objectives',
      description: 'Define clear learning outcomes',
      color: 'bg-green-100 text-green-600',
      available: false,
    },
    {
      icon: Lightbulb,
      title: 'Lesson Planner',
      description: 'Plan your lessons with AI assistance',
      color: 'bg-yellow-100 text-yellow-600',
      available: false,
    },
    {
      icon: Sparkles,
      title: 'Content Enhancer',
      description: 'Improve your teaching materials',
      color: 'bg-pink-100 text-pink-600',
      available: false,
    },
    {
      icon: BookOpen,
      title: 'Study Guide Generator',
      description: 'Create comprehensive study guides',
      color: 'bg-indigo-100 text-indigo-600',
      available: false,
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Teacher's Toolkit</h1>
          <p className="text-gray-600 mt-2">Powerful AI tools to enhance your teaching experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow ${
                  !tool.available ? 'opacity-60' : 'cursor-pointer'
                }`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${tool.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                {tool.available ? (
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Try it now →
                  </button>
                ) : (
                  <span className="text-sm font-medium text-gray-400">Coming soon</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
