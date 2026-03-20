'use client'

import React, { useState, useEffect } from 'react'
import { UnifiedBook } from '@/lib/books/types'
import { addBookToShelf } from '@/lib/books/actions'
import { toast } from 'sonner'

export function BookSearch({ shelfId }: { shelfId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnifiedBook[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (val: string) => {
    if (!val) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(val)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const onAddBook = async (book: UnifiedBook) => {
    try {
      await addBookToShelf(book, shelfId)
      toast.success(`Added "${book.title}" to your shelf`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16">
      <div className="relative group">
        <div className="absolute -inset-1 bg-accent/20 rounded-[3rem] blur group-focus-within:opacity-100 opacity-0 transition duration-1000" />
        <div className="relative glass-panel rounded-3xl md:rounded-[3rem] flex items-center shadow-2xl transition-all overflow-hidden">
          <div className="pl-4 md:pl-10 pr-2 md:pr-4">
            <svg
              className="w-7 h-7 text-muted group-focus-within:text-accent transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search masterpiece..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent py-5 md:py-8 pr-4 md:pr-10 focus:outline-none text-lg md:text-2xl placeholder:text-muted/40 font-bold tracking-tight text-foreground truncate"
            suppressHydrationWarning
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="w-20 h-20 border-[6px] border-accent border-t-transparent animate-spin rounded-full shadow-2xl shadow-accent/20"></div>
          <p className="text-accent font-black tracking-[0.4em] text-xs uppercase animate-pulse">Consulting the indices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {results.map((book, idx) => (
            <div 
              key={`${book.isbn13}-${idx}`}
              className="glass-panel p-8 rounded-[3.5rem] flex flex-col sm:flex-row gap-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none"
            >
                <div className="w-32 h-44 bg-surface flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 border border-border/10 relative isolate perspective-1000 preserve-3d">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accent/5 flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-[10px] font-black text-accent uppercase line-clamp-3 leading-tight tracking-tighter opacity-70 font-serif">{book.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 spine-lighting pointer-events-none" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-black text-2xl md:text-3xl leading-tight text-foreground line-clamp-2 group-hover:text-accent transition-colors font-serif">
                      {book.title}
                    </h3>
                    <p className="text-lg text-muted font-medium italic opacity-90 font-serif">by {book.author}</p>
                  </div>
                  
                  <button
                    onClick={() => onAddBook(book)}
                    className="w-full py-5 border-2 border-accent/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/30 transition-all duration-500"
                  >
                    Exhibit Masterpiece
                  </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
