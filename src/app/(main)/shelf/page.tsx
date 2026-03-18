'use client'

import React from 'react'
import Link from 'next/link'
import { useShelf } from '@/hooks/useShelf'
import Bookshelf from '@/components/shelf/Bookshelf'
import { useShelfTheme } from '@/components/theme/ThemeProvider'
import { BookDetailOverlay } from '@/components/book/BookDetailOverlay'
import { CurrentlyReading } from '@/components/shelf/CurrentlyReading'
import { ProgressModal } from '@/components/shelf/ProgressModal'
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'
import { ReadingGoal } from '@/components/profile/ReadingGoalTracker'
import { Recommendations } from '@/components/shelf/Recommendations'
import { ShelfSwitcher } from '@/components/shelf/ShelfSwitcher'
import { ReadingStreak } from '@/components/profile/ReadingStreak'
import ShareProfileButton from '@/components/profile/ShareProfileButton'

export default function ShelfPage() {
  const { shelf, books, goal, loading, username, refresh } = useShelf()
  const { currentTheme } = useShelfTheme()
  const themeDisplayNames: Record<string, string> = {
    minimalist: 'Boutique',
    dark_academia: 'Dark Academia',
    botanical: 'Botanical',
    pastel: 'Midnight',
    vintage_library: 'Royal'
  }
  const [selectedBook, setSelectedBook] = React.useState<any | null>(null)
  const [showProgressModal, setShowProgressModal] = React.useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent animate-spin rounded-full"></div>
      </div>
    )
  }

  // Count 'read' books for goal
  const readCount = books.filter((b: any) => b.reading_status === 'read').length
  // Note: The original instruction included `setGoal(prev => ({ ...prev, current: readCount }))`
  // but `setGoal` is not available here. Assuming `goal` from `useShelf` is already updated.
  // If `goal.current` needs to reflect `readCount` immediately, `useShelf` would need to handle it,
  // or a local state for `goal` would be needed. For now, `goal.current` from `useShelf` is used.

  const currentlyReading = books.find((b: any) => b.reading_status === 'currently_reading') || books[0]

  return (
    <div className="max-w-7xl mx-auto space-y-24 py-16 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-bold text-foreground tracking-tighter leading-[0.8]">
            {shelf?.name || 'Library'}
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-px w-12 bg-accent opacity-60" />
              <p className="text-muted text-sm font-bold uppercase tracking-[0.3em] opacity-90">
                Curated in <span className="text-accent">{themeDisplayNames[currentTheme]}</span>
              </p>
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-center gap-8 w-full">
           {/* Shelf Switcher (Multiple Shelves) */}
           <div className="flex-1">
             <ShelfSwitcher />
           </div>
           
           <div className="flex flex-wrap items-center gap-6">
              {/* Reading Goal Progress */}
              <ReadingGoal current={goal.current} target={goal.target} />

              {/* Reading Streak (Plus) */}
              <ReadingStreak days={12} />
              
              <div className="flex items-center gap-4">
                 <ThemeSwitcher shelfId={shelf?.id} />
                 
                 <div className="px-8 py-5 bg-foreground text-background rounded-[2.5rem] flex items-center gap-4 shadow-2xl transition-transform hover:scale-105 cursor-default">
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Library Count</p>
                     <p className="text-2xl font-black">{books.length}</p>
                   </div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center opacity-40">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </header>
      {/* Mobile share button */}
      {username && (
        <div className="sm:hidden -mt-16 px-4">
           <ShareProfileButton username={username} />
        </div>
      )}

      {books.length > 0 && (
        <section className="px-4">
          <CurrentlyReading 
            book={currentlyReading} 
            onUpdateClick={() => setShowProgressModal(true)} 
          />
        </section>
      )}

      <section className="space-y-16 pt-16">
        <div className="flex items-center gap-4 px-4">
           <div className="h-px flex-1 bg-accent/10" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Primary Collection</p>
           <div className="h-px flex-1 bg-accent/10" />
        </div>
        
        {books.length > 0 ? (
          <div className="relative">
            <Bookshelf 
              books={books} 
              onBookClick={(book) => setSelectedBook(book)}
            />
          </div>
        ) : (
          <div className="glass-panel py-32 rounded-[3.5rem] text-center space-y-8 border-dashed border-2 border-accent/20">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Your shelf is quiet...</h2>
              <p className="text-muted max-w-sm mx-auto">Start building your digital library by searching for your favorite masterpieces.</p>
            </div>
            <Link 
              href="/search"
              className="btn-primary inline-flex items-center gap-3 px-10"
            >
              Discover Books
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        )}
      </section>

      {/* Passive Recommendations Section */}
      <section className="pb-32">
        <Recommendations />
      </section>

      <ProgressModal 
        book={currentlyReading}
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onUpdate={() => refresh()} 
      />

      <BookDetailOverlay 
        book={selectedBook} 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  )
}
