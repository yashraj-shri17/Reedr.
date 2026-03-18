'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'

interface QuarterStarRatingProps {
  value: number
  onChange: (value: number) => void
  label?: string
  isPlusOnly?: boolean
}

export function QuarterStarRating({ value, onChange, label, isPlusOnly }: QuarterStarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const stars = [1, 2, 3, 4, 5]
  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className={`space-y-2 ${isPlusOnly ? 'opacity-80 grayscale hover:grayscale-0 transition-all' : ''}`}>
      {label && (
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          {label}
          {isPlusOnly && (
            <span className="bg-accent text-white px-1.5 py-0.5 rounded-full text-[8px] font-black">PLUS</span>
          )}
        </label>
      )}
      <div className="flex gap-1.5">
        {stars.map((star) => (
          <div key={star} className="relative w-8 h-8 group cursor-pointer">
            {/* Split each star into 4 hitboxes for quarter-star precision */}
            <div className="absolute inset-0 flex">
              {[0.25, 0.5, 0.75, 1].map((q) => (
                <div 
                  key={q} 
                  className="w-1/4 h-full z-10" 
                  onMouseEnter={() => setHoverValue(star - 1 + q)}
                  onMouseLeave={() => setHoverValue(null)}
                  onClick={() => onChange(star - 1 + q)}
                />
              ))}
            </div>
            {/* Background Star (unfilled) */}
            <span className="absolute inset-0 text-3xl text-accent/10 select-none">★</span>
            {/* Filled Star (using clip-path for fractional fill) */}
            <div 
              className="absolute inset-0 text-3xl text-accent select-none overflow-hidden transition-all duration-300"
              style={{ 
                width: `${Math.max(0, Math.min(100, (displayValue - (star - 1)) * 100))}%`
              }}
            >
              <span className="absolute left-0">★</span>
            </div>
          </div>
        ))}
        {displayValue > 0 && (
          <span className="ml-2 text-sm font-black text-accent self-center">{displayValue.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}
