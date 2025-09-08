'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { UserAvatar } from '@/components/UserAvatar';

interface AdminStats {
  totalProblems: number;
  totalStudents: number;
  totalPrograms: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalProblems: 0,
    totalStudents: 0,
    totalPrograms: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Count problems (from your existing hardcoded data for now)
        // Later this will query your math_problems table
        const problemsCount = 15; // Placeholder
        
        // Count students from waitlist
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlist')
          .select('id')
          .eq('onboarding_completed', true);

        if (waitlistError) {
          console.error('Error fetching waitlist:', waitlistError);
        }

        // Count programs (from your hardcoded programs for now)
        const programsCount = 6; // Your current math programs

        // Count recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity')
          .select('id')
          .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (activityError) {
          console.error('Error fetching activity:', activityError);
        }

        setStats({
          totalProblems: problemsCount,
          totalStudents: waitlistData?.length || 0,
          totalPrograms: programsCount,
          recentActivity: activityData?.length || 0
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🛠️ Admin Dashboard</h1>
              <p className="text-gray-600">Manage your math platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/product/testing"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                👤 Switch to Student View
              </Link>
              <UserAvatar size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProblems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/problems/create" className="block w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">➕ Create New Problem</div>
                <div className="text-sm text-blue-700">Add a new math problem to the database</div>
              </Link>
              <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">📚 Create New Program</div>
                <div className="text-sm text-green-700">Set up a new learning program</div>
              </button>
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-medium text-purple-900">📊 View Analytics</div>
                <div className="text-sm text-purple-700">Check student performance and engagement</div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Coming Soon</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">🧮 Problem Editor</div>
                <div className="text-sm text-gray-600">Rich text editor with LaTeX support</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">📤 Bulk Import</div>
                <div className="text-sm text-gray-600">Upload problems from CSV/Excel files</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">📈 Advanced Analytics</div>
                <div className="text-sm text-gray-600">Detailed performance insights and reports</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🚀 Getting Started</h3>
          <div className="text-yellow-700">
            <p className="mb-2">You're now in the admin panel! Here's what you can do:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>First, run the database migration to create the problems tables</li>
              <li>Then start creating math problems using the problem editor</li>
              <li>Organize problems into programs for different student groups</li>
              <li>Monitor student progress and engagement through analytics</li>
            </ul>
            <p className="mt-3 text-sm">
              <strong>Next step:</strong> Run the SQL migration in your Supabase dashboard, then start building the problem creation interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
