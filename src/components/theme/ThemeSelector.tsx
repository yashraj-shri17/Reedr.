'use client'

import React from 'react'

const themes = [
  { id: 'minimalist', name: 'Minimalist', color: 'bg-white' },
  { id: 'dark_academia', name: 'Dark Academia', color: 'bg-[#2a2420]' },
  { id: 'botanical', name: 'Botanical', color: 'bg-[#e8f3e8]' },
  { id: 'pastel', name: 'Pastel', color: 'bg-[#f8f0ff]' },
  { id: 'vintage_library', name: 'Vintage Library', color: 'bg-[#d2b48c]' },
]

export function ThemeSelector({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
            currentTheme === theme.id ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : 'hover:scale-105'
          }`}
        >
          <div className={`w-16 h-16 rounded-lg shadow-md ${theme.color} border border-black/5`} />
          <span className="text-xs font-medium">{theme.name}</span>
        </button>
      ))}
    </div>
  )
}
