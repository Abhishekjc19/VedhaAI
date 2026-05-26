'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, BookOpen, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  schoolName?: string;
  schoolCity?: string;
}

export function Sidebar({ schoolName = 'Delhi Public School', schoolCity = 'Bokaro Sector City' }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/assignments' },
    { icon: Users, label: 'My Groups', href: '/groups' },
    { icon: FileText, label: 'Assignments', href: '/assignments', badge: '25' },
    { icon: BookOpen, label: 'AI Teacher\'s Toolkit', href: '/toolkit' },
    { icon: Clock, label: 'My Library', href: '/library' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-white font-bold">
          V
        </div>
        <span className="text-lg font-bold text-gray-900">VedaAI</span>
      </div>

      {/* Create Assignment Button */}
      <div className="px-4 py-4">
        <Link
          href="/create"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <span className="text-lg">+</span>
          Create Assignment
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-gray-200 px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>

      {/* School Info */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <span className="text-sm font-semibold text-green-700">🏫</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{schoolName}</p>
            <p className="truncate text-xs text-gray-500">{schoolCity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
