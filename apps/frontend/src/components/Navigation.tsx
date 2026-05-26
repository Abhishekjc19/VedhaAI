'use client';

import React from 'react';
import { Home, Plus, BarChart } from 'lucide-react';
import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <span className="text-sm font-bold text-white">VA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VedaAI</span>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white shadow transition-all hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Create</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
