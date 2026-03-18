'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QuarterStarRating } from './QuarterStarRating'
import { updateBookDetails } from '@/lib/books/actions'
import { toast } from 'sonner'

interface BookDetailOverlayProps {
  book: any | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export function BookDetailOverlay({ book, isOpen, onClose, onUpdate }: BookDetailOverlayProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSubRatings, setShowSubRatings] = useState(false)
  const [showWarnings, setShowWarnings] = useState(false)
  const [notes, setNotes] = useState(book?.notes || '')
  
  // Update state when book changes
  React.useEffect(() => {
    if (book) {
      setNotes(book.notes || '')
      setRatings({
        main: book.rating || 0,
        plot: book.rating_plot || 0,
        chars: book.rating_characters || 0,
        writing: book.rating_writing || 0,
        enjoyment: book.rating_enjoyment || 0
      })
    }
  }, [book])

  const [ratings, setRatings] = useState({
    main: 0,
    plot: 0,
    chars: 0,
    writing: 0,
    enjoyment: 0
  })

  const handleSave = async () => {
    if (!book?.id) return
    setIsSaving(true)
    try {
      await updateBookDetails(book.id, {
        rating: ratings.main,
        rating_plot: ratings.plot,
        rating_characters: ratings.chars,
        rating_writing: ratings.writing,
        rating_enjoyment: ratings.enjoyment,
        notes: notes
      })
      toast.success("Gallery record updated successfully")
      onUpdate?.()
      onClose()
    } catch (e) {
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 w-full max-w-2xl bg-surface rounded-t-[3rem] shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header / Grabber */}
            <div className="flex justify-center p-6 pb-2 cursor-pointer group" onClick={onClose}>
               <div className="w-12 h-1.5 bg-border group-hover:bg-accent/40 rounded-full transition-colors" />
            </div>

            <div className="overflow-y-auto p-10 pt-4 space-y-12">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Cover Image */}
                <div className="w-full md:w-56 aspect-[2/3] relative flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accent/5 flex items-center justify-center p-8 text-center bg-gradient-to-br from-accent/10 to-transparent">
                      <div className="space-y-4">
                        <div className="w-12 h-px bg-accent/30 mx-auto" />
                        <div className="text-2xl font-black text-foreground/80 font-serif italic leading-tight">{book.title}</div>
                        <div className="w-12 h-px bg-accent/30 mx-auto" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none" />
                </div>

                {/* Main Details */}
                <div className="flex-1 space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold tracking-tight leading-none text-foreground">{book.title}</h2>
                    <p className="text-2xl text-muted font-medium italic opacity-70">by {book.author}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                     {book.genres?.map((genre: string) => (
                       <span key={genre} className="bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-accent/10">
                         {genre}
                       </span>
                     ))}
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-1">Library Status</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Read', 'Currently Reading', 'Want to Read', 'DNF'].map((s) => (
                           <button 
                             key={s} 
                             className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${book.reading_status === s.toLowerCase().replace(/ /g, '_') ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-background hover:border-accent/40 border-border'}`}
                           >
                             {s}
                           </button>
                        ))}
                      </div>
                    </div>

                    <QuarterStarRating 
                      label="Main Rating"
                      value={ratings.main} 
                      onChange={(v) => setRatings({...ratings, main: v})} 
                    />

                    {/* Sub-ratings Toggle (Plus Only) */}
                    <div className="space-y-4 pt-4 border-t border-border">
                       <button 
                        onClick={() => setShowSubRatings(!showSubRatings)}
                        className="flex items-center gap-2 group"
                       >
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Detailed Review (Plus)</span>
                          <svg className={`w-4 h-4 text-accent transition-transform ${showSubRatings ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                       </button>

                       {showSubRatings && (
                         <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                             <QuarterStarRating label="Plot & Pacing" isPlusOnly value={ratings.plot} onChange={(v) => setRatings({...ratings, plot: v})} />
                             <QuarterStarRating label="Character Depth" isPlusOnly value={ratings.chars} onChange={(v) => setRatings({...ratings, chars: v})} />
                             <QuarterStarRating label="Writing Style" isPlusOnly value={ratings.writing} onChange={(v) => setRatings({...ratings, writing: v})} />
                             <QuarterStarRating label="Overall Enjoyment" isPlusOnly value={ratings.enjoyment} onChange={(v) => setRatings({...ratings, enjoyment: v})} />
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Notes (Plus Only) */}
              <div className="space-y-4 pt-10 border-t border-border">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                    Private Gallery Notes 
                    <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[8px] font-black">PLUS</span>
                  </label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your personal thoughts, favorite tropes, or memories of this book here..."
                    className="w-full h-40 bg-background border border-border rounded-3xl p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all leading-relaxed"
                  />
              </div>

              {/* Content Warnings (Publicly crowd-sourced) */}
              <div className="space-y-6 pt-10 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Atmosphere & Warnings</label>
                    <button 
                      onClick={() => setShowWarnings(!showWarnings)}
                      className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline underline-offset-4"
                    >
                      {showWarnings ? 'Hide Warnings' : 'Show Content Warnings'}
                    </button>
                  </div>

                  {showWarnings ? (
                    <div className="bg-red-50/50 border border-red-200/50 rounded-2xl p-6 space-y-3 animate-in fade-in duration-300">
                        <p className="text-[10px] font-bold uppercase text-red-900/60 flex items-center gap-2">
                           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                           Community Flagged Warnings:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                           {['Grief', 'Violence', 'Mental Health'].map(w => (
                             <span key={w} className="px-3 py-1 bg-red-100 text-red-900/80 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-red-200">{w}</span>
                           ))}
                           <button className="px-3 py-1 bg-white text-accent text-[10px] font-bold rounded-lg uppercase tracking-widest border border-accent/20 hover:border-accent transition-all">+ Add Warning</button>
                        </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                       {['Cozy', 'Emotional', 'Twisty'].map(m => (
                          <span key={m} className="px-4 py-2 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest rounded-xl border border-accent/10">{m}</span>
                       ))}
                       <button className="px-4 py-2 border border-dashed border-accent/30 text-accent/50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-accent/60 transition-all">+ Mood</button>
                    </div>
                  )}
              </div>

              <div className="pt-10 space-y-6">
                <div className="flex items-center justify-between bg-accent/5 p-6 rounded-3xl border border-accent/10 group cursor-pointer hover:bg-accent/10 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent opacity-60">Verified Edition</p>
                    <p className="text-sm font-bold text-foreground opacity-90">First Edition Hardcover (1925)</p>
                  </div>
                  <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

                <div className="flex gap-4">
                  <button 
                    className="btn-primary flex-1 py-5 text-sm disabled:opacity-50" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Synchronizing Gallery...' : 'Complete Record'}
                  </button>
                  <button className="bg-red-50 text-red-900/60 p-5 rounded-3xl hover:bg-red-100 hover:text-red-900 transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
