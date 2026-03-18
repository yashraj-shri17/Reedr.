'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function ShelfSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const currentShelf = "Primary Gallery"
  const shelves = ["Primary Gallery", "Current Favorites", "Dark Academia Collection"]

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 bg-background border border-border px-8 py-4 rounded-3xl hover:border-accent/40 transition-all group shadow-sm bg-white"
      >
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-60">Active Exhibition</p>
          <p className="text-base font-black text-foreground">{currentShelf}</p>
        </div>
        <div className={`w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`}>
           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 w-80 bg-surface rounded-[2rem] border border-border shadow-2xl p-4 space-y-2 z-[60]"
          >
            {shelves.map((s) => (
              <button 
                key={s}
                className={`w-full text-left p-6 rounded-2xl transition-all flex items-center justify-between group ${s === currentShelf ? 'bg-accent/5 ring-1 ring-accent/20' : 'hover:bg-accent/5'}`}
              >
                <div className="space-y-1">
                  <p className={`text-base font-black ${s === currentShelf ? 'text-accent' : 'text-foreground'}`}>{s}</p>
                  <p className="text-[10px] font-bold uppercase text-muted tracking-widest">32 Pieces Curated</p>
                </div>
                {s === currentShelf && (
                   <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(193,157,104,0.5)]" />
                )}
              </button>
            ))}
            
            <div className="h-px bg-border my-4 mx-4" />
            
            <button className="w-full p-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center justify-center gap-3 hover:bg-accent/5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Curate New Shelf
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
