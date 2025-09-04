'use client'

import React from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels like GitHub
}

interface ContributionTableProps {
  contributions: ContributionDay[];
  totalContributions?: number;
  currentStreak?: number;
  longestStreak?: number;
}

const ContributionTable: React.FC<ContributionTableProps> = ({
  contributions,
  totalContributions = 0,
  currentStreak = 0,
  longestStreak = 0
}) => {
  // Generate last 365 days using user's local timezone
  const generateContributionGrid = () => {
    const grid: ContributionDay[] = [];
    const today = new Date(); // This is in user's local timezone
    
    // Start from 364 days ago to include today (365 total days)
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Format date in user's local timezone (YYYY-MM-DD)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // Find contribution for this date
      const contribution = contributions.find(c => c.date === dateString);
      
      grid.push({
        date: dateString,
        count: contribution?.count || 0,
        level: contribution?.level || 0
      });
    }
    
    return grid;
  };

  const contributionGrid = generateContributionGrid();
  
  // Group by weeks (7 days each)
  const weeks = [];
  for (let i = 0; i < contributionGrid.length; i += 7) {
    weeks.push(contributionGrid.slice(i, i + 7));
  }

  // Get intensity color based on level (0-4) - GitHub style
  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100'; // No activity
      case 1: return 'bg-green-200'; // Low activity (1-2 problems)
      case 2: return 'bg-green-400'; // Medium activity (3-4 problems)
      case 3: return 'bg-green-600'; // High activity (5-7 problems)
      case 4: return 'bg-green-800'; // Very high activity (8+ problems)
      default: return 'bg-gray-100';
    }
  };

  // Get month labels - GitHub style using user's local timezone
  const getMonthLabels = () => {
    const months = [];
    const today = new Date(); // User's local date
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    return months;
  };

  const monthLabels = getMonthLabels();

  // Format date for tooltip
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header - Clean and minimal like the image */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {totalContributions} math problems solved this year
        </h3>
        <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
          Practice settings
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Contribution Grid - Exact GitHub style */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-10 text-xs text-gray-500"></div> {/* Space for day labels */}
            {monthLabels.map((month, index) => (
              <div key={index} className="text-xs text-gray-500 text-left" style={{ width: '13px', marginRight: '3px' }}>
                {index % 2 === 0 ? month : ''}
              </div>
            ))}
          </div>

          {/* Day labels and grid */}
          <div className="flex">
            {/* Day of week labels */}
            <div className="flex flex-col text-xs text-gray-500 mr-3 w-10">
              <div className="h-3 flex items-center justify-end pr-1">Sun</div>
              <div className="h-3"></div>
              <div className="h-3 flex items-center justify-end pr-1">Tue</div>
              <div className="h-3"></div>
              <div className="h-3 flex items-center justify-end pr-1">Thu</div>
              <div className="h-3"></div>
              <div className="h-3 flex items-center justify-end pr-1">Sat</div>
            </div>

            {/* Contribution squares */}
            <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
              {contributionGrid.map((day, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 ${getIntensityColor(day.level)} hover:ring-1 hover:ring-gray-400 transition-all duration-150 cursor-pointer`}
                  title={`${formatDate(day.date)}: ${day.count} problems solved`}
                  style={{ borderRadius: '2px' }}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-start mt-4">
            <span className="text-xs text-gray-500 mr-3">Less</span>
            <div className="flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-gray-100" style={{ borderRadius: '2px' }}></div>
              <div className="w-3 h-3 bg-green-200" style={{ borderRadius: '2px' }}></div>
              <div className="w-3 h-3 bg-green-400" style={{ borderRadius: '2px' }}></div>
              <div className="w-3 h-3 bg-green-600" style={{ borderRadius: '2px' }}></div>
              <div className="w-3 h-3 bg-green-800" style={{ borderRadius: '2px' }}></div>
            </div>
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContributionTable;
