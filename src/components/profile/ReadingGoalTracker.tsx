'use client'

import React, { useState } from 'react'
import { updateReadingGoal } from '@/lib/books/actions'
import { toast } from 'sonner'

interface ReadingGoalProps {
  current: number
  target: number
}

export function ReadingGoal({ current, target }: ReadingGoalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTarget, setNewTarget] = useState(target)
  const percentage = Math.min(100, (current / target) * 100)

  const handleUpdate = async () => {
    try {
      await updateReadingGoal(newTarget)
      setIsEditing(false)
      toast.success("Reading goal updated")
    } catch (e) {
      toast.error("Failed to update goal")
    }
  }

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] space-y-4 shadow-xl shadow-accent/5 max-w-sm w-full group overflow-hidden">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Reading Journey</p>
          {isEditing ? (
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="number" 
                value={newTarget} 
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-20 bg-background border border-accent/20 rounded-lg p-1 text-lg font-black"
                autoFocus
              />
              <button 
                onClick={handleUpdate}
                className="bg-accent text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase"
              >
                Save
              </button>
            </div>
          ) : (
            <h3 
              className="text-3xl font-black text-foreground flex items-center gap-3 cursor-pointer group/goal"
              onClick={() => setIsEditing(true)}
            >
              {current} <span className="text-muted text-lg font-medium opacity-40">/ {target} books</span>
              <svg className="w-4 h-4 opacity-0 group-hover/goal:opacity-100 transition-opacity text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </h3>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
        </div>
      </div>

      <div className="relative h-3 w-full bg-accent/5 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer" />
        </div>
      </div>

      <p className="text-[10px] font-bold text-muted uppercase tracking-widest text-center opacity-60">
        {percentage === 100 ? "Goal Accomplished!" : `${target - current} books to reach your 2026 goal`}
      </p>
    </div>
  )
}
