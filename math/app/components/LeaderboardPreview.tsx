'use client'

import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge?: string;
}

interface LeaderboardCategory {
  id: string;
  title: string;
  icon: string;
  entries: LeaderboardEntry[];
}

export default function LeaderboardPreview() {
  const [activeCategory, setActiveCategory] = useState('math-a');

  const leaderboardData: LeaderboardCategory[] = [
    {
      id: 'math-a',
      title: '學測數學 A',
      icon: '📊',
      entries: [
        { rank: 1, name: '張小明', score: 98, badge: '🏆' },
        { rank: 2, name: '李小華', score: 96, badge: '🥈' },
        { rank: 3, name: '王小美', score: 94, badge: '🥉' },
        { rank: 4, name: '陳小強', score: 92 },
        { rank: 5, name: '林小芳', score: 90 },
      ]
    },
    {
      id: 'imo',
      title: 'IMO 競賽',
      icon: '🏆',
      entries: [
        { rank: 1, name: '數學天才', score: 156, badge: '🏆' },
        { rank: 2, name: '解題高手', score: 148, badge: '🥈' },
        { rank: 3, name: '邏輯大師', score: 142, badge: '🥉' },
        { rank: 4, name: '證明專家', score: 138 },
        { rank: 5, name: '幾何王子', score: 134 },
      ]
    },
    {
      id: 'calculus',
      title: '微積分',
      icon: '∫',
      entries: [
        { rank: 1, name: '積分大師', score: 245, badge: '🏆' },
        { rank: 2, name: '微分專家', score: 238, badge: '🥈' },
        { rank: 3, name: '極限高手', score: 232, badge: '🥉' },
        { rank: 4, name: '導數王子', score: 228 },
        { rank: 5, name: '級數女王', score: 224 },
      ]
    }
  ];

  const currentCategory = leaderboardData.find(cat => cat.id === activeCategory) || leaderboardData[0];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-4">
            競賽排行榜
          </h2>
          <p className="text-lg text-[#2B2B2B] max-w-2xl mx-auto">
            與全國數學高手一較高下，查看你在各個數學競賽中的排名表現
          </p>
        </div>

        {/* Leaderboard Container */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-center gap-2">
              {leaderboardData.map((category) => (
                <button
                  key={category.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="text-base">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Content */}
          <div className="p-6">
            <div className="space-y-3">
              {currentCategory.entries.map((entry) => (
                <div 
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                    entry.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.rank}
                  </div>
                  
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {entry.name.charAt(0)}
                  </div>
                  
                  {/* Name and Badge */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.name}</span>
                    {entry.badge && (
                      <span className="text-base">{entry.badge}</span>
                    )}
                  </div>
                  
                  {/* Score */}
                  <div className="flex-shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{entry.score}</div>
                      <div className="text-xs text-gray-500">分數</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="mt-8 text-center">
              <button className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                查看完整排行榜
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
