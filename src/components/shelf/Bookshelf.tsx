'use client'

import React from 'react'
import { ShelfRow } from './ShelfRow'

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
}

interface BookshelfProps {
  shelf?: any // Matches DB type
  books: Book[]
  isPublicView?: boolean
  onBookClick?: (book: Book) => void
}

export default function Bookshelf({ books, shelf, isPublicView, onBookClick }: BookshelfProps) {
  // Organize books into rows (PRD 9.1: 3-4 visible on mobile, etc.)
  // We'll group them for desktop perspective
  const booksPerRow = 8
  const rows: Book[][] = []
  for (let i = 0; i < books.length; i += booksPerRow) {
    rows.push(books.slice(i, i + booksPerRow))
  }

  if (rows.length === 0) rows.push([])

  return (
    <div className={`w-full py-12 ${shelf?.theme || 'minimalist'}`}>
      <div className="container mx-auto">
        {rows.map((row, rowIndex) => (
          <ShelfRow 
            key={rowIndex} 
            books={row} 
            onBookClick={onBookClick} 
          />
        ))}
      </div>
    </div>
  )
}
