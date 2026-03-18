'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { addBookToShelf } from '@/lib/books/actions'
import { PageTransition } from '@/components/layout/PageTransition'

interface RecommendedBook {
  title: string
  author: string
  description: string
  coverUrl?: string | null
}

export default function DiscoverPage() {
  const [mood, setMood] = useState('')
  const [results, setResults] = useState<RecommendedBook[]>([])
  const [loading, setLoading] = useState(false)

  const handleDiscover = async () => {
    if (!mood.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
    } catch (error: any) {
      toast.error(error.message || 'AI discovery failed')
    } finally {
      setLoading(false)
    }
  }

  const onAddBook = async (book: RecommendedBook) => {
    try {
      await addBookToShelf({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl || '', 
        isbn13: '',
        genres: []
      })
      toast.success(`"${book.title}" added to your gallery!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add masterpiece')
    }
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-24 py-24 px-4 selection:bg-accent/30 grainy">
        <header className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center text-accent shadow-inner border border-accent/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-accent font-black uppercase tracking-[0.6em] text-xs">Algorithmic Insight</p>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground font-serif text-gradient leading-none">
              Mood Search
            </h1>
            <p className="text-muted text-lg md:text-xl font-medium italic opacity-60 leading-relaxed font-serif">
              Describe a memory, a scent, or an atmosphere. Our AI will curate the perfect addition to your exhibition.
            </p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto relative isolate">
          <div className="absolute -inset-4 bg-accent/5 blur-2xl rounded-[4rem] -z-10 animate-pulse" />
          <div className="glass-panel p-3 rounded-[3rem] flex flex-col md:flex-row gap-3 relative group transition-all hover:shadow-3xl hover:shadow-accent/5">
            <input 
              type="text" 
              placeholder="e.g. A rainy night in a Parisian library..."
              className="flex-1 bg-transparent px-10 py-6 focus:outline-none text-xl placeholder:text-muted/30 font-serif italic"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
              suppressHydrationWarning
            />
            <button 
              onClick={handleDiscover}
              disabled={loading}
              className="btn-primary rounded-[2rem] py-6 px-12 flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-accent/20"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>
                  Consult Oracle
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-16 pt-12">
          {loading && (
            <div className="flex flex-col items-center gap-8 py-32">
              <div className="w-24 h-24 border-[6px] border-accent border-t-transparent animate-spin rounded-full shadow-2xl shadow-accent/10"></div>
              <p className="text-accent font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Sifting Through Masterpieces...</p>
            </div>
          )}

          {results.length > 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {results.map((book, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="glass-panel rounded-[4rem] p-10 space-y-10 h-full flex flex-col hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 relative overflow-hidden">
                    <div className="aspect-[2/3] w-full relative rounded-[2rem] overflow-hidden shadow-2xl group-hover:scale-[1.03] transition-transform duration-700 isolate perspective-1000 preserve-3d">
                      {book.coverUrl && !book.coverUrl.includes('unavailable') ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/5 flex items-center justify-center p-10 text-center bg-gradient-to-br from-accent/10 to-transparent">
                           <div className="space-y-6">
                              <div className="w-16 h-px bg-accent/30 mx-auto" />
                              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent opacity-40">Gallery Selection</div>
                              <div className="text-3xl font-black text-foreground/80 leading-tight font-serif italic">{book.title}</div>
                              <div className="w-16 h-px bg-accent/30 mx-auto" />
                           </div>
                        </div>
                      )}
                      <div className="absolute inset-0 spine-lighting pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black leading-tight text-foreground line-clamp-2 font-serif group-hover:text-accent transition-colors">{book.title}</h3>
                        <p className="text-xl text-muted font-medium italic opacity-70 font-serif">by {book.author}</p>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed line-clamp-4 font-medium opacity-80">
                        {book.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => onAddBook(book)}
                      className="w-full py-5 border-2 border-accent/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-accent hover:text-white hover:border-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-500"
                    >
                      Exhibit Piece
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
