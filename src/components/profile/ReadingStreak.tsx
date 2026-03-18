'use client'

import React from 'react'

interface ReadingStreakProps {
  days: number
}

export function ReadingStreak({ days }: ReadingStreakProps) {
  return (
    <div className="flex items-center gap-4 bg-orange-50/50 border border-orange-200/50 px-6 py-4 rounded-3xl group cursor-pointer hover:bg-orange-50 transition-all">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2c0 10 7 12 7 17a7 7 0 1 1-14 0c0-5 7-7 7-17z"/></svg>
        </div>
        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-900/40">Daily Streak</p>
        <p className="text-xl font-black text-orange-900">{days} Days</p>
      </div>
    </div>
  )
}
