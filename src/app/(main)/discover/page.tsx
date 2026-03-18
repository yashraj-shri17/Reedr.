'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { addBookToShelf } from '@/lib/books/actions'

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
      toast.success(`"${book.title}" added to your shelf!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-12 px-4 selection:bg-accent/30">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
          Mood Discovery
        </h1>
        <p className="text-muted text-lg font-medium">
          Describe a feeling, a place, or a memory, and let AI find the perfect next read for your collection.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="glass-panel p-2 rounded-[2.5rem] flex flex-col md:flex-row gap-2 relative group transition-all hover:shadow-2xl hover:shadow-accent/5">
          <input 
            type="text" 
            placeholder="e.g. A dark Victorian mystery set in a rainy London..."
            className="flex-1 bg-transparent px-8 py-5 focus:outline-none text-lg placeholder:text-muted/50 font-medium"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
            suppressHydrationWarning
          />
          <button 
            onClick={handleDiscover}
            disabled={loading}
            className="btn-primary rounded-3xl py-5 px-10 flex items-center justify-center gap-3 disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            ) : (
              <>
                Discover
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-12 pt-12">
        {loading && (
          <div className="flex flex-col items-center gap-6 py-24">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent animate-spin rounded-full"></div>
            <p className="text-accent font-bold uppercase tracking-widest text-xs animate-pulse">Curating Recommendations...</p>
          </div>
        )}

        {results.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {results.map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="glass-panel rounded-[3rem] p-8 space-y-8 h-full flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[2/3] w-full relative rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                    {book.coverUrl && !book.coverUrl.includes('unavailable') ? (
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/5 flex items-center justify-center p-8 text-center bg-gradient-to-br from-accent/10 to-transparent">
                         <div className="space-y-4">
                            <div className="w-12 h-px bg-accent/30 mx-auto" />
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent opacity-40">Artistic Archive</div>
                            <div className="text-2xl font-black text-foreground/80 leading-tight font-serif italic">{book.title}</div>
                            <div className="w-12 h-px bg-accent/30 mx-auto" />
                         </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black leading-tight text-foreground line-clamp-2">{book.title}</h3>
                      <p className="text-lg text-muted font-medium italic opacity-90">by {book.author}</p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => onAddBook(book)}
                    className="w-full py-4 border-2 border-accent/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                  >
                    Add to Shelf
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
