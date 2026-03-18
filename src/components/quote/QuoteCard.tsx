'use client'

import React from 'react'
import { motion } from 'motion/react'

interface QuoteCardProps {
  text: string
  author: string
  bookTitle: string
  theme?: string
}

export function QuoteCard({ text, author, bookTitle, theme = 'minimalist' }: QuoteCardProps) {
  const themeStyles = {
    minimalist: "bg-white text-black p-8 shadow-xl border",
    dark_academia: "bg-[#2a2420] text-[#e0d4c0] p-10 font-serif border-8 border-[#3d332d]",
    botanical: "bg-[#f4fbf4] text-[#2d4a2d] p-8 border-2 border-[#8eb48e] rounded-2xl",
    pastel: "bg-gradient-to-br from-[#f0f4ff] to-[#fff0f4] text-[#4a4a4a] p-8 rounded-3xl",
    vintage_library: "bg-[#d2b48c] text-[#3d2b1f] p-8 border-double border-4 border-[#8b4513]"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative max-w-lg mx-auto ${themeStyles[theme as keyof typeof themeStyles]}`}
    >
      <div className="relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="opacity-20 mb-4"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L20.017 3C21.1216 3 22.017 3.89543 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.01692 21L3.01692 18C3.01692 16.8954 3.91235 16 5.01692 16H8.01692C8.56921 16 9.01692 15.5523 9.01692 15V9C9.01692 8.44772 8.56921 8 8.01692 8H5.01692C3.91235 8 3.01692 7.10457 3.01692 6V3L9.01692 3C10.1215 3 11.0169 3.89543 11.0169 5V15C11.0169 18.3137 8.33063 21 5.01692 21H3.01692Z"/></svg>
        <p className="text-xl md:text-2xl italic leading-relaxed mb-6 font-medium">"{text}"</p>
        <div className="flex flex-col items-end border-t pt-4 opacity-70">
          <p className="font-bold">{author}</p>
          <p className="text-sm">{bookTitle}</p>
        </div>
      </div>
      
      {/* Reedr Branding (PRD 9.4) */}
      <div className="mt-8 text-[10px] tracking-widest uppercase opacity-40 text-center">
        Created on Reedr
      </div>
    </motion.div>
  )
}
