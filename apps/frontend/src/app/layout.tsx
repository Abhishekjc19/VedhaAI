'use client';

import React from 'react';
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VedaAI - Assessment Creator</title>
        <meta name="description" content="AI-powered Assessment Creator for Teachers" />
      </head>
      <body className="bg-white antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
