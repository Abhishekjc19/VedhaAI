'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  FileText,
  Brain,
  Library,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  userProfile?: {
    name: string;
    school: string;
    avatar?: string;
  };
}

export function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/my-groups', label: 'My Groups', icon: Users },
    { href: '/assignments', label: 'Assignments', icon: FileText },
    { href: '/ai-toolkit', label: 'AI Teacher\'s Toolkit', icon: Brain },
    { href: '/library', label: 'My Library', icon: Library },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex md:hidden h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col border-r border-gray-200 bg-white">
          {/* Logo Section */}
          <div className="flex items-center gap-3 border-b border-gray-200 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VedaAI</h1>
              <p className="text-xs text-gray-500">Assessment Creator</p>
            </div>
          </div>

          {/* Create Assignment Button */}
          <div className="p-4">
            <Link
              href="/create"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              <span>+ Create Assignment</span>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>

          {/* User Profile Section */}
          {userProfile && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {userProfile.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {userProfile.school}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
