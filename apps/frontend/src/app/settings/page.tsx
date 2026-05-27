'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, School, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [schoolName, setSchoolName] = useState(user?.user_metadata?.school_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Delhi Public School"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
