'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { UserAvatar } from '@/components/UserAvatar';

interface Problem {
  id: string;
  title: string;
  content: string;
  difficulty_level: number;
  problem_type: string;
  status: string;
  created_at: string;
  total_attempts: number;
  correct_attempts: number;
}

export default function ProblemsListPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status: string;
    difficulty: string;
    type: string;
  }>({
    status: 'all',
    difficulty: 'all',
    type: 'all'
  });

  useEffect(() => {
    loadProblems();
  }, [filter]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('math_problems')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter.difficulty !== 'all') {
        query = query.eq('difficulty_level', parseInt(filter.difficulty));
      }
      if (filter.type !== 'all') {
        query = query.eq('problem_type', filter.type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading problems:', error);
        // Show placeholder data if database doesn't exist yet
        setProblems([]);
      } else {
        setProblems(data || []);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessRate = (problem: Problem) => {
    if (problem.total_attempts === 0) return 0;
    return Math.round((problem.correct_attempts / problem.total_attempts) * 100);
  };

  const getDifficultyColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyName = (level: number) => {
    const names = { 1: '基礎', 2: '簡單', 3: '中等', 4: '困難', 5: '專家' };
    return names[level as keyof typeof names] || '未知';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusName = (status: string) => {
    const names = {
      draft: '草稿',
      review: '審核中',
      published: '已發布',
      archived: '已歸檔'
    };
    return names[status as keyof typeof names] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 Problem Management</h1>
              <p className="text-gray-600">Manage all math problems in the database</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/problems/create"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                ➕ Create New Problem
              </Link>
              <Link 
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <UserAvatar size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">草稿</option>
                <option value="review">審核中</option>
                <option value="published">已發布</option>
                <option value="archived">已歸檔</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="1">1 - 基礎</option>
                <option value="2">2 - 簡單</option>
                <option value="3">3 - 中等</option>
                <option value="4">4 - 困難</option>
                <option value="5">5 - 專家</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="multiple_choice">選擇題</option>
                <option value="free_response">自由作答</option>
                <option value="true_false">是非題</option>
                <option value="fill_blank">填空題</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Problems ({problems.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading problems...</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Problems Found</h3>
              <p className="text-gray-600 mb-4">
                {filter.status === 'all' && filter.difficulty === 'all' && filter.type === 'all'
                  ? 'You haven\'t created any problems yet. Start by creating your first problem!'
                  : 'No problems match your current filters. Try adjusting the filters above.'
                }
              </p>
              <Link
                href="/admin/problems/create"
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                ➕ Create Your First Problem
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {problems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {problem.title || 'Untitled Problem'}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {problem.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty_level)}`}>
                          {getDifficultyName(problem.difficulty_level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {problem.problem_type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                          {getStatusName(problem.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div>{problem.total_attempts} attempts</div>
                          <div className="text-xs text-gray-500">
                            {getSuccessRate(problem)}% success rate
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(problem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        {problems.length === 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Getting Started</h3>
            <div className="text-blue-700">
              <p className="mb-2">To start managing problems, you need to:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Run the database migration to create the problems tables</li>
                <li>Create your first math problem using the problem editor</li>
                <li>Publish problems to make them available to students</li>
                <li>Monitor student performance and engagement</li>
              </ol>
              <p className="mt-3 text-sm">
                <strong>Next step:</strong> Make sure you've run the SQL migration in your Supabase dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
