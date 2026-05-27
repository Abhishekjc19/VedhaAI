'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect authenticated users to assignments
        router.push('/assignments');
      } else {
        // Redirect unauthenticated users to login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}
