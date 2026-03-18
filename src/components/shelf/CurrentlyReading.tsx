'use client'

import React from 'react'
import { motion } from 'motion/react'

interface CurrentlyReadingProps {
  book: any
  onUpdateClick?: () => void
}

export function CurrentlyReading({ book, onUpdateClick }: CurrentlyReadingProps) {
  if (!book) return null

  const progress = book.total_pages > 0 
    ? Math.round((book.pages_read / book.total_pages) * 100) 
    : 0

  return (
    <div className="flex flex-col md:flex-row items-center gap-16 glass-panel p-12 rounded-[3.5rem] mb-24 relative overflow-hidden group border-none shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-accent/10 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />

      {/* Book on 3D Easel Stand */}
      <div className="relative group/easel perspective-[1500px] flex-shrink-0">
        <motion.div 
          className="w-56 h-80 relative [transform-style:preserve-3d] z-10"
          initial={{ rotateY: -15, rotateX: 5, y: 0 }}
          animate={{ rotateY: -10, rotateX: 3 }}
          whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="absolute inset-0 bg-surface shadow-[25px_25px_50px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden border border-border/50">
             {book.coverUrl && (
               <img 
                 src={book.coverUrl} 
                 alt={book.title} 
                 className="w-full h-full object-cover" 
               />
             )}
             <div className={`cover-fallback p-6 text-center h-full flex flex-col justify-center bg-accent/10 text-foreground ${book.coverUrl ? 'hidden' : ''}`}>
               <div className="font-bold text-xl mb-2 tracking-tight line-clamp-3">{book.title}</div>
               <div className="text-accent text-[10px] font-black uppercase tracking-widest">{book.author}</div>
             </div>
          </div>
        </motion.div>

        {/* Shadow floor */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-12 bg-black/5 blur-3xl rounded-full -z-10" />
      </div>

      <div className="flex-1 text-center md:text-left z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Currently Reading
            </span>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-foreground tracking-tight line-clamp-2">{book.title}</h2>
            <p className="text-2xl text-muted font-serif italic opacity-70">by {book.author}</p>
          </div>

          <button 
            onClick={onUpdateClick}
            className="self-center md:self-end btn-primary"
          >
            Update Progress
          </button>
        </div>

        <div className="w-full bg-background/50 p-8 rounded-[2rem] border border-border relative group/progress">
          <div className="flex justify-between items-end mb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Reading Journey</p>
              <h4 className="text-2xl font-black text-accent">{progress}%</h4>
            </div>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest bg-border/20 px-3 py-1 rounded-md">{book.pages_read} / {book.total_pages} Pages</p>
          </div>
          <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden shadow-inner">
             <motion.div 
                className="h-full bg-accent rounded-full relative shadow-[0_0_15px_rgba(193,157,104,0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
             >
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
