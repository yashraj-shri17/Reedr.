'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QuarterStarRating } from './QuarterStarRating'
import { updateBookDetails, addTag, removeTag } from '@/lib/books/actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

interface BookDetailOverlayProps {
  book: any | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
  isPlus?: boolean
}

export function BookDetailOverlay({ book, isOpen, onClose, onUpdate, isPlus = false }: BookDetailOverlayProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSubRatings, setShowSubRatings] = useState(false)
  const [showWarnings, setShowWarnings] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [tags, setTags] = useState<any[]>([])
  const [loadingTags, setLoadingTags] = useState(false)
  const [newTagVal, setNewTagVal] = useState('')
  const [tagType, setTagType] = useState<'mood' | 'trope' | 'content_warning'>('mood')
  
  const supabase = createClient()

  const [ratings, setRatings] = useState({
    main: 0,
    plot: 0,
    chars: 0,
    writing: 0,
    enjoyment: 0
  })

  useEffect(() => {
    if (book && isOpen) {
      setNotes(book.notes || '')
      setStatus(book.reading_status || 'want_to_read')
      setRatings({
        main: book.rating || 0,
        plot: book.rating_plot || 0,
        chars: book.rating_characters || 0,
        writing: book.rating_writing || 0,
        enjoyment: book.rating_enjoyment || 0
      })
      fetchTags()
    }
  }, [book, isOpen])

  const fetchTags = async () => {
    const workId = book.work_id || book.works?.id || book.workId
    if (!workId) return
    
    setLoadingTags(true)
    const { data } = await supabase
      .from('book_tags')
      .select('*')
      .eq('work_id', workId)
    
    if (data) setTags(data)
    setLoadingTags(false)
  }

  const handleAddTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagVal.trim()) return
    
    const workId = book.work_id || book.works?.id || book.workId
    try {
      await addTag(workId, tagType, newTagVal.trim())
      setNewTagVal('')
      fetchTags()
    } catch (e) {
      toast.error("Could not add tag")
    }
  }

  const handleRemoveTag = async (tag: any) => {
    try {
      await removeTag(tag.work_id, tag.tag_type, tag.tag_value)
      fetchTags()
    } catch (e) {
      toast.error("Could not remove tag")
    }
  }

  const handleSave = async () => {
    if (!book?.id) return
    setIsSaving(true)
    try {
      const response = await updateBookDetails(book.id, {
        rating: ratings.main,
        rating_plot: isPlus ? ratings.plot : null,
        rating_characters: isPlus ? ratings.chars : null,
        rating_writing: isPlus ? ratings.writing : null,
        rating_enjoyment: isPlus ? ratings.enjoyment : null,
        notes: isPlus ? notes : null,
        reading_status: status
      })
      if (response.success) {
        toast.success("Gallery record updated successfully")
        if (onUpdate) onUpdate()
        onClose()
      }
    } catch (e) {
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  if (!book) return null

  const moods = tags.filter(t => t.tag_type === 'mood')
  const warningTags = tags.filter(t => t.tag_type === 'content_warning')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 w-full max-w-2xl bg-surface rounded-t-[3rem] shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[95vh]"
          >
            <div className="flex justify-center p-6 pb-2 cursor-pointer group" onClick={onClose}>
               <div className="w-12 h-1.5 bg-border group-hover:bg-accent/40 rounded-full transition-colors" />
            </div>

            <div className="overflow-y-auto p-6 md:p-10 pt-4 space-y-12 pb-32">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-56 aspect-[2/3] relative flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white transform md:-rotate-2 hover:rotate-0 transition-transform duration-500 mx-auto md:mx-0">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accent/5 flex items-center justify-center p-8 text-center bg-gradient-to-br from-accent/10 to-transparent">
                      <div className="space-y-4">
                        <div className="w-12 h-px bg-accent/30 mx-auto" />
                        <div className="text-xl font-black text-foreground/80 font-serif italic leading-tight">{book.title}</div>
                        <div className="w-12 h-px bg-accent/30 mx-auto" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-8 text-center md:text-left">
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-loose text-foreground">{book.title}</h2>
                    <p className="text-xl text-muted font-medium italic opacity-70">by {book.author}</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                     {book.genres?.map((genre: string) => (
                       <span key={genre} className="bg-accent/5 text-accent text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-accent/10">
                         {genre}
                       </span>
                     ))}
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-1">Library Status</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Read', 'Currently Reading', 'Want to Read', 'DNF'].map((s) => {
                           const statusVal = s.toLowerCase().replace(/ /g, '_')
                           const isActive = status === statusVal
                           return (
                             <button 
                               key={s} 
                               onClick={() => setStatus(statusVal)}
                               className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isActive ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-background hover:border-accent/40 border-border'}`}
                             >
                               {s}
                             </button>
                           )
                        })}
                      </div>
                    </div>

                    <QuarterStarRating 
                      label="Main Rating"
                      value={ratings.main} 
                      onChange={(v) => setRatings({...ratings, main: v})} 
                    />

                    <div className="space-y-4 pt-4 border-t border-border">
                       <button onClick={() => setShowSubRatings(!showSubRatings)} className="flex items-center gap-2 group mx-auto md:mx-0">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Detailed Review </span>
                          {!isPlus && <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[8px] font-black">PLUS</span>}
                          <svg className={`w-4 h-4 text-accent transition-transform ${showSubRatings ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                       </button>

                       {showSubRatings && (
                         <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500 relative">
                             {!isPlus && (
                               <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
                                  <Link href="/pricing" className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Unlock Analytics</Link>
                               </div>
                             )}
                             <QuarterStarRating label="Plot" isPlusOnly value={ratings.plot} onChange={(v) => setRatings({...ratings, plot: v})} />
                             <QuarterStarRating label="Characters" isPlusOnly value={ratings.chars} onChange={(v) => setRatings({...ratings, chars: v})} />
                             <QuarterStarRating label="Writing" isPlusOnly value={ratings.writing} onChange={(v) => setRatings({...ratings, writing: v})} />
                             <QuarterStarRating label="Enjoyment" isPlusOnly value={ratings.enjoyment} onChange={(v) => setRatings({...ratings, enjoyment: v})} />
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Private Notes (Plus only) */}
              <div className="space-y-4 pt-10 border-t border-border group relative">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                    Private Gallery Notes 
                    {!isPlus && <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[8px] font-black">PLUS</span>}
                  </label>
                  <div className="relative">
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={!isPlus}
                      placeholder={isPlus ? "Write your personal thoughts or favorite bookish moments here..." : "Upgrade to Plus to record and save detailed personal notes for your library."}
                      className={`w-full h-32 bg-background border border-border rounded-3xl p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all leading-relaxed ${!isPlus ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    />
                    {!isPlus && (
                       <Link href="/pricing" className="absolute inset-x-0 bottom-4 text-center text-[8px] font-black uppercase tracking-[0.3em] text-accent opacity-0 group-hover:opacity-100 transition-opacity">Upgrade to Write</Link>
                    )}
                  </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-8 pt-10 border-t border-border">
                  <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Atmosphere & Moods</label>
                     <div className="flex flex-wrap gap-2 min-h-8">
                        {moods.map(tag => (
                          <span key={tag.id} className="flex items-center gap-2 px-4 py-2 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest rounded-xl border border-accent/10">
                            {tag.tag_value}
                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 text-lg leading-none">×</button>
                          </span>
                        ))}
                     </div>
                     <form onSubmit={handleAddTagSubmit} className="flex gap-2">
                        <input 
                          value={newTagVal}
                          onChange={(e) => setNewTagVal(e.target.value)}
                          placeholder="Type a mood (e.g. Cozy, Dark)"
                          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                          onFocus={() => setTagType('mood')}
                        />
                        <button type="submit" className="px-6 py-2 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-white transition-all">Add</button>
                     </form>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Content Warnings</label>
                        <button onClick={() => setShowWarnings(!showWarnings)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">{showWarnings ? 'Hide' : 'Add Warnings'}</button>
                     </div>
                     {showWarnings && (
                        <div className="bg-red-50/50 border border-red-200/50 rounded-3xl p-6 space-y-4">
                           <div className="flex flex-wrap gap-2">
                              {warningTags.map(tag => (
                                <span key={tag.id} className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-900/80 text-[10px] font-bold rounded-xl uppercase tracking-widest border border-red-200">
                                  {tag.tag_value}
                                  <button onClick={() => handleRemoveTag(tag)}>×</button>
                                </span>
                              ))}
                           </div>
                           <div className="flex gap-2">
                              <input 
                                placeholder="Flag a warning..."
                                className="flex-1 bg-white border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
                                onKeyPress={(e) => {
                                   if (e.key === 'Enter') {
                                      e.preventDefault()
                                      setTagType('content_warning')
                                      handleAddTagSubmit(e as any)
                                   }
                                }}
                              />
                           </div>
                        </div>
                     )}
                  </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex gap-4">
                <button 
                  className="btn-primary flex-1 py-5 text-sm disabled:opacity-50" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Synchronizing...' : 'Update & Record'}
                </button>
                <button className="bg-red-50 text-red-900/40 p-5 rounded-3xl hover:bg-red-100 hover:text-red-900 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
