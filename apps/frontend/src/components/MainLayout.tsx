'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  // Generate initials from full name
  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1">
              {/* Page title or breadcrumb */}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              {/* User Profile */}
              <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
                  {getInitials()}
                </div>
                <span className="text-sm font-medium text-gray-700">{getDisplayName()}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
