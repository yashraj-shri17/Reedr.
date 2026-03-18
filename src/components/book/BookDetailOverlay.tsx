'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface BookDetailOverlayProps {
  book: any | null
  isOpen: boolean
  onClose: () => void
}

export function BookDetailOverlay({ book, isOpen, onClose }: BookDetailOverlayProps) {
  if (!book) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-surface rounded-t-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Grabber */}
            <div className="flex justify-center p-4">
               <div className="w-12 h-1 bg-border rounded-full" />
            </div>

            <div className="overflow-y-auto p-8 pt-0">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Cover Image */}
                <div className="w-full md:w-48 aspect-[2/3] relative flex-shrink-0 shadow-2xl rounded-lg overflow-hidden border-4 border-white transform md:-rotate-3">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-parchment-secondary flex items-center justify-center p-4 text-center text-sm">
                      {book.title}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 leading-tight">{book.title}</h2>
                  <p className="text-xl text-muted mb-6">{book.author}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                     {book.genres?.map((genre: string) => (
                       <span key={genre} className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full border border-accent/20">
                         {genre}
                       </span>
                     ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted mb-2 tracking-wider">Reading Status</label>
                      <select className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent">
                        <option>Want to Read</option>
                        <option>Currently Reading</option>
                        <option>Read</option>
                        <option>Did Not Finish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-muted mb-2 tracking-wider">Rating</label>
                      <div className="flex gap-2">
                        {/* Mock Stars */}
                        {[1, 2, 3, 4, 5].map((s) => (
                           <button key={s} className="text-2xl text-accent/20 hover:text-accent transition-colors">★</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8 space-y-6">
                <div>
                  <h4 className="font-bold mb-3">About this book</h4>
                  <p className="text-muted text-sm leading-relaxed">
                    {book.description || 'No description available for this work.'}
                  </p>
                </div>

                <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-border">
                  <span className="text-sm text-muted">Edition: Hardcover (2021)</span>
                  <button className="text-accent text-sm font-bold hover:underline">Change Edition</button>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full bg-accent text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-95 transition-all mt-8"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
