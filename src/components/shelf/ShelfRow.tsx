'use client'

import React from 'react'
import { BookSpine } from './BookSpine'

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
}

interface ShelfRowProps {
  books: Book[]
  onBookClick?: (book: Book) => void
}

export function ShelfRow({ books, onBookClick }: ShelfRowProps) {
  return (
    <div className="relative group/row max-w-7xl mx-auto mb-32 last:mb-0">
      {/* Shelf Structure */}
      <div className="relative [transform-style:preserve-3d] h-72 md:h-80 w-full perspective-[1600px]">
        {/* Back Panel (The Wall) */}
        <div 
          className="absolute inset-x-0 -inset-y-8 bg-surface rounded-xl -z-30 border border-border shadow-inner transition-colors duration-700"
          style={{ 
            transform: 'translateZ(-140px)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          }}
        />
        
        {/* Shelf Rail (Deep 3D Plank) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-12 z-10 [transform-style:preserve-3d]"
          style={{ 
            transform: 'rotateX(-2deg) translateZ(-60px)',
          }}
        >
          {/* Top of the shelf (where books rest) */}
          <div 
            className="absolute top-0 left-0 w-full h-[140px] shadow-2xl transition-colors duration-700"
            style={{ 
              transform: 'rotateX(90deg)',
              transformOrigin: 'top',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), transparent 20%), url("https://www.transparenttextures.com/patterns/dark-wood.png")',
              backgroundColor: 'var(--shelf-wood)',
            }}
          />
          
          {/* Front edge of the shelf */}
          <div 
            className="absolute top-0 left-0 w-full h-full border-t border-white/10 transition-colors duration-700"
            style={{ 
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
              backgroundColor: 'var(--shelf-edge)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)'
            }}
          />
          
          {/* Bottom of the shelf */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[140px] transition-colors duration-700"
            style={{ 
              transform: 'rotateX(-90deg)',
              transformOrigin: 'bottom',
              backgroundColor: 'var(--shelf-bottom)',
            }}
          />
        </div>

        {/* Books Container */}
        <div className="absolute bottom-6 left-0 w-full flex items-end justify-center gap-1 md:gap-2 overflow-x-auto pb-10 px-8 shelf-row scroll-smooth no-scrollbar z-20 mask-fade-edges">
          {books.map((book) => (
            <BookSpine
              key={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              onClick={() => onBookClick?.(book)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
