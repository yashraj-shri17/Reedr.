'use client'

import React, { useState } from 'react'

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
  readOnly?: boolean
}

export function RatingInput({ value, onChange, readOnly = false }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const stars = [1, 2, 3, 4, 5]
  
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFull = (hoverValue || value) >= star
        const isHalf = (hoverValue || value) >= star - 0.5 && (hoverValue || value) < star
        const isQuarter = (hoverValue || value) >= star - 0.75 && (hoverValue || value) < star - 0.5
        const isThreeQuarters = (hoverValue || value) >= star - 0.25 && (hoverValue || value) < star

        return (
          <div 
            key={star}
            className={`cursor-pointer ${readOnly ? 'pointer-events-none' : ''}`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(star)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={isFull ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2" 
              className={isFull ? 'text-yellow-500' : 'text-muted-foreground'}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        )
      })}
      <span className="ml-2 font-bold text-lg">{value.toFixed(2)}</span>
    </div>
  )
}
