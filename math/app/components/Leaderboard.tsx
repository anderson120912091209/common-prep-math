'use client'

import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  badge?: string;
}

interface LeaderboardCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  entries: LeaderboardEntry[];
}

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState('math-a');
  const [activeTimeframe, setActiveTimeframe] = useState('monthly');

  const leaderboardData: LeaderboardCategory[] = [
    {
      id: 'math-a',
      title: '學測數學 A',
      description: '大學學測數學 A 科目排行榜',
      icon: '📊',
      entries: [
        { rank: 1, name: '張小明', score: 98, badge: '🏆' },
        { rank: 2, name: '李小華', score: 96, badge: '🥈' },
        { rank: 3, name: '王小美', score: 94, badge: '🥉' },
        { rank: 4, name: '陳小強', score: 92 },
        { rank: 5, name: '林小芳', score: 90 },
        { rank: 6, name: '黃小偉', score: 88 },
        { rank: 7, name: '劉小玲', score: 86 },
        { rank: 8, name: '吳小傑', score: 84 },
        { rank: 9, name: '周小雅', score: 82 },
        { rank: 10, name: '蔡小龍', score: 80 },
      ]
    },
    {
      id: 'imo',
      title: 'IMO 數學競賽',
      description: '國際數學奧林匹克競賽練習排行榜',
      icon: '🏆',
      entries: [
        { rank: 1, name: '數學天才', score: 156, badge: '🏆' },
        { rank: 2, name: '解題高手', score: 148, badge: '🥈' },
        { rank: 3, name: '邏輯大師', score: 142, badge: '🥉' },
        { rank: 4, name: '證明專家', score: 138 },
        { rank: 5, name: '幾何王子', score: 134 },
        { rank: 6, name: '代數女王', score: 130 },
        { rank: 7, name: '數論學者', score: 126 },
        { rank: 8, name: '組合大師', score: 122 },
        { rank: 9, name: '分析專家', score: 118 },
        { rank: 10, name: '計算高手', score: 114 },
      ]
    },
    {
      id: 'calculus',
      title: '微積分競賽',
      description: '微積分專項練習排行榜',
      icon: '∫',
      entries: [
        { rank: 1, name: '積分大師', score: 245, badge: '🏆' },
        { rank: 2, name: '微分專家', score: 238, badge: '🥈' },
        { rank: 3, name: '極限高手', score: 232, badge: '🥉' },
        { rank: 4, name: '導數王子', score: 228 },
        { rank: 5, name: '級數女王', score: 224 },
        { rank: 6, name: '積分路徑', score: 220 },
        { rank: 7, name: '偏微分', score: 216 },
        { rank: 8, name: '重積分', score: 212 },
        { rank: 9, name: '曲線積分', score: 208 },
        { rank: 10, name: '面積積分', score: 204 },
      ]
    },
    {
      id: 'statistics',
      title: '統計學競賽',
      description: '統計學與機率論排行榜',
      icon: '📈',
      entries: [
        { rank: 1, name: '統計專家', score: 189, badge: '🏆' },
        { rank: 2, name: '機率大師', score: 184, badge: '🥈' },
        { rank: 3, name: '數據分析', score: 179, badge: '🥉' },
        { rank: 4, name: '抽樣專家', score: 175 },
        { rank: 5, name: '假設檢定', score: 171 },
        { rank: 6, name: '迴歸分析', score: 167 },
        { rank: 7, name: '變異數分析', score: 163 },
        { rank: 8, name: '貝氏定理', score: 159 },
        { rank: 9, name: '常態分布', score: 155 },
        { rank: 10, name: '信賴區間', score: 151 },
      ]
    }
  ];

  const currentCategory = leaderboardData.find(cat => cat.id === activeCategory) || leaderboardData[0];

  return (
    <div className="min-h-screen bg-white p-3">
      <div className="max-w-5xl mx-auto relative">
        {/* Main Leaderboard Card */}
        <div className="bg-white rounded-3xl border-solid border-black overflow-hidden flex flex-col" style={{borderWidth: '12px', height: '90vh', width: 'auto'}}>
          {/* Top Title */}
          <div className="px-8 py-4 flex-shrink-0">
          </div>
          
          {/* Filter Controls */}
          <div className="px-6 pb-3 flex-shrink-0">
            <div className="flex items-center justify-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                <button className="flex items-center gap-1.5 bg-blue-300 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                  </svg>
                  List
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2"/>
                    <path d="M12 6a6 6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6z"/>
                  </svg>
                  Single
                </button>
              </div>
              
              {/* Category Selection */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                {leaderboardData.map((category) => (
                  <button
                    key={category.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-blue-300 text-blue-900'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="text-sm">{category.icon}</span>
                    {category.title}
                  </button>
                ))}
              </div>
              
              {/* Timeframe Selection */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                <button 
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTimeframe === 'weekly' ? 'bg-blue-300 text-blue-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTimeframe('weekly')}
                >
                  本週
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTimeframe === 'monthly' ? 'bg-blue-300 text-blue-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTimeframe('monthly')}
                >
                  本月
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTimeframe === 'alltime' ? 'bg-blue-300 text-blue-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTimeframe('alltime')}
                >
                  總排行
                </button>
              </div>
            </div>
          </div>
          
          {/* Content Container */}
          <div className="flex-1 mx-6 mb-6 bg-white rounded-2xl border-2 border-gray-300 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-gray-900">數學競賽排行榜</h1>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">{currentCategory.title}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">{activeTimeframe === 'weekly' ? '本週' : activeTimeframe === 'monthly' ? '本月' : '總排行'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Calculator Icon */}
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  
                  {/* Check Icon */}
                  <button className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  {/* Bookmark Icon */}
                  <button className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  
                  {/* My Rank Button */}
                  <button className="bg-blue-300 hover:bg-blue-400 text-blue-900 px-4 py-1 rounded-full font-medium text-sm">
                    我的排名
                  </button>
                  
                  {/* Share Button */}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-full font-medium text-sm flex items-center gap-1">
                    <span>分享</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  
                  {/* Menu Icon */}
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          
            {/* Leaderboard Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentCategory.entries.map((entry) => (
                <div 
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    entry.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.rank}
                  </div>
                  
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {entry.name.charAt(0)}
                  </div>
                  
                  {/* Name and Badge */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.name}</span>
                    {entry.badge && (
                      <span className="text-lg">{entry.badge}</span>
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
              
              {/* Load More Button */}
              <div className="mt-6 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  載入更多
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
