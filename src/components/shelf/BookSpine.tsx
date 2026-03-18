'use client'

import React from 'react'
import { motion } from 'motion/react'

interface BookSpineProps {
  title: string
  author: string
  coverUrl?: string
  onClick?: () => void
}

export function BookSpine({ title, author, coverUrl, onClick }: BookSpineProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.1, 
        rotateY: 0,
        translateZ: 50,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onClick={onClick}
      className="relative w-24 h-64 md:w-28 md:h-72 flex-shrink-0 cursor-pointer [transform-style:preserve-3d] group perspective-[1200px]"
      initial={{ rotateY: -25 }}
      animate={{ rotateY: -15 }}
    >
      {/* Book Front (Cover) */}
      <div 
        className="absolute inset-0 w-full h-full bg-surface shadow-2xl rounded-sm backface-hidden border-l border-black/5 overflow-hidden z-20"
        style={{ 
          transform: 'rotateY(0deg) translateZ(12px)',
          boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.2), 5px 5px 20px rgba(0,0,0,0.3)'
        }}
      >
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className={`book-fallback p-3 bg-[#2d2418] text-[#e8dcc8] text-[10px] leading-tight flex flex-col justify-end h-full ${coverUrl ? 'hidden' : ''}`}>
          <div className="font-bold text-xs line-clamp-3 mb-1">{title}</div>
          <div className="opacity-70 truncate font-medium">{author}</div>
        </div>
        {/* Subtle cover shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none" />
      </div>

      {/* Book Spine (The Thickness side) */}
      <div 
        className="absolute left-0 top-0 h-full w-[24px] bg-neutral-800"
        style={{ 
          transform: 'rotateY(-90deg) translateZ(12px)',
          transformOrigin: 'left',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), transparent), url('https://www.transparenttextures.com/patterns/dark-leather.png')`,
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <div className="h-full w-full flex items-center justify-center p-1">
          <span className="text-[10px] font-bold text-white/40 rotate-90 whitespace-nowrap uppercase tracking-tighter">
            {title.substring(0, 20)}
          </span>
        </div>
      </div>

      {/* Book Pages (Right Side) - Visible when angled */}
      <div 
        className="absolute right-0 top-0 h-full w-[24px] bg-[#fdfaf0]"
        style={{ 
          transform: 'rotateY(90deg) translateZ(-112px)',
          transformOrigin: 'right',
          backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, rgba(0,0,0,0.05) 3px)',
        }}
      />

      {/* Book Top Face */}
      <div 
        className="absolute top-0 left-0 w-full h-[24px] bg-[#eeeae0]"
        style={{ 
          transform: 'rotateX(90deg) translateZ(12px)',
          transformOrigin: 'top',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), transparent)',
        }}
      />

      {/* Realistic Shadow on the shelf */}
      <div 
        className="absolute -bottom-2 left-4 right-0 h-4 bg-black/40 blur-xl rounded-full -z-10 group-hover:bg-black/60 transition-colors"
        style={{ transform: 'rotateX(90deg) translateY(10px)' }}
      />
    </motion.div>
  )
}
