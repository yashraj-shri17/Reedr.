'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  description?: string
}

interface BookDetailsModalProps {
  book: Book | null
  onClose: () => void
}

export function BookDetailsModal({ book, onClose }: BookDetailsModalProps) {
  if (!book) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-surface rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Left Side: Cover Image */}
          <div className="w-full md:w-2/5 aspect-[2/3] md:h-full relative overflow-hidden bg-accent/5">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-12 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-px bg-accent/30 mx-auto" />
                  <div className="text-2xl font-black text-foreground/80 font-serif italic">{book.title}</div>
                  <div className="w-12 h-px bg-accent/30 mx-auto" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-px w-8 bg-accent/30" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Gallery Piece</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                {book.title}
              </h2>
              <p className="text-xl md:text-2xl text-muted font-medium italic opacity-80">
                by {book.author}
              </p>
            </div>

            {book.description && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">A Brief History</h4>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                  {book.description}
                </p>
              </div>
            )}

            <div className="pt-8 flex gap-4">
              <button 
                onClick={onClose}
                className="btn-primary flex-1 py-5"
              >
                Back to Shelf
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
