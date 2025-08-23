'use client'

import React, { useState, useMemo, useEffect } from 'react';

interface DayData {
  date: string
  count: number
}

interface MathProgressTrackerProps {
  className?: string;
}

const MathProgressTracker: React.FC<MathProgressTrackerProps> = ({ className = "" }) => {
  const [data, setData] = useState<DayData[]>([])
  const [isClient, setIsClient] = useState(false)

  // Generate sample data for the past year - only on client side
  useEffect(() => {
    setIsClient(true)
    
    const days: DayData[] = []
    const today = new Date()

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Generate more realistic and scattered data
      const dayOfWeek = date.getDay()
      const month = date.getMonth()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Base probability - more consistent but still realistic
      let baseProb = 0.35 // 35% chance of practice on average
      
      // Adjust for weekdays vs weekends
      if (isWeekend) {
        baseProb = 0.20 // Lower on weekends
      } else {
        baseProb = 0.45 // Higher on weekdays
      }
      
      // Seasonal adjustments
      if (month >= 5 && month <= 8) {
        baseProb *= 1.3 // Summer months - more practice
      } else if (month >= 11 || month <= 1) {
        baseProb *= 0.6 // Holiday months - less practice
      }
      
      // Random variation
      const random = Math.random()
      let count = 0
      
      if (random < baseProb * 0.4) {
        count = Math.floor(Math.random() * 2) + 1 // 1-2 problems
      } else if (random < baseProb * 0.7) {
        count = Math.floor(Math.random() * 3) + 3 // 3-5 problems
      } else if (random < baseProb * 0.9) {
        count = Math.floor(Math.random() * 3) + 6 // 6-8 problems
      } else if (random < baseProb) {
        count = Math.floor(Math.random() * 5) + 9 // 9-13 problems
      }

      days.push({
        date: date.toISOString().split("T")[0],
        count,
      })
    }

    setData(days)
  }, [])

  // Get intensity level for color coding
  const getIntensity = (count: number): number => {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 8) return 3
    return 4
  }

  // Get cream blue color based on intensity
  const getColor = (intensity: number): string => {
    const colors = [
      "bg-gray-100 border-gray-200", // 0 problems
      "bg-[#7A9CEB]/20 border-[#7A9CEB]/30", // 1-2 problems
      "bg-[#7A9CEB]/40 border-[#7A9CEB]/50", // 3-5 problems
      "bg-[#7A9CEB]/60 border-[#7A9CEB]/70", // 6-8 problems
      "bg-[#7A9CEB] border-[#6B8CD9]", // 9+ problems
    ]
    return colors[intensity] || colors[0]
  }

  // Group days by weeks
  const weeks = useMemo(() => {
    const result: DayData[][] = []
    let currentWeek: DayData[] = []

    // Add empty days at the beginning to align with Sunday
    const firstDay = new Date(data[0]?.date)
    const firstDayOfWeek = firstDay.getDay()

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", count: 0 })
    }

    data.forEach((day, index) => {
      currentWeek.push(day)

      if (currentWeek.length === 7) {
        result.push([...currentWeek])
        currentWeek = []
      }
    })

    // Fill the last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({ date: "", count: 0 })
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek)
    }

    return result
  }, [data])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calculate total contributions
  const totalContributions = data.reduce((sum, day) => sum + day.count, 0);

  // Show loading state until data is ready
  if (!isClient || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border-4 border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border-4 border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {totalContributions} math problems solved this year
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Practice settings</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            {months.map((month, index) => (
              <div key={month} className="text-xs text-gray-500 px-2 min-w-[60px]">
                {month}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2">
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`text-xs text-gray-500 h-3 mb-1 leading-3 ${index % 2 === 0 ? "" : "opacity-0"}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const intensity = day.date ? getIntensity(day.count) : 0
                    const colorClass = day.date ? getColor(intensity) : "bg-transparent"

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-[1px] border ${colorClass}`}
                        title={day.date ? `${day.date}: ${day.count} problems solved` : ""}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-600">Less</div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div key={intensity} className={`w-3 h-3 rounded-[1px] border ${getColor(intensity)}`} />
              ))}
            </div>
            <div className="text-xs text-gray-600">More</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathProgressTracker;
