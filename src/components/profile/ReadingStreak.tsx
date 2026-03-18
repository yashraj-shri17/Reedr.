'use client'

import React from 'react'

interface ReadingStreakProps {
  days: number
}

export function ReadingStreak({ days }: ReadingStreakProps) {
  return (
    <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between h-44 w-full shadow-xl shadow-orange-500/5 group cursor-pointer hover:bg-orange-500/[0.02] transition-all">
      <div className="flex justify-between items-start">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2c0 10 7 12 7 17a7 7 0 1 1-14 0c0-5 7-7 7-17z"/></svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60">Daily Streak</p>
        <p className="text-4xl font-black text-foreground">{days} Days</p>
      </div>
    </div>
  )
}
