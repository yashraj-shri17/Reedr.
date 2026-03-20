'use client'

import React, { useState } from 'react'
import { ShelfRow } from './ShelfRow'
import { BookDetailsModal } from './BookDetailsModal'

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  description?: string
}

interface BookshelfProps {
  shelf?: any // Matches DB type
  books: Book[]
  isPublicView?: boolean
  onBookClick?: (book: Book) => void
}

export default function Bookshelf({ books, shelf, isPublicView, onBookClick }: BookshelfProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Organize books into rows
  const booksPerRow = 12
  const rows: Book[][] = []
  for (let i = 0; i < books.length; i += booksPerRow) {
    rows.push(books.slice(i, i + booksPerRow))
  }

  if (rows.length === 0) rows.push([])

  const handleBookClick = (book: Book) => {
    if (onBookClick) {
      onBookClick(book)
    } else {
      setSelectedBook(book)
    }
  }

  return (
    <div className={`w-full py-6 md:py-12 ${shelf?.theme || 'minimalist'}`}>
      <div className="container mx-auto">
        {rows.map((row, rowIndex) => (
          <ShelfRow 
            key={rowIndex} 
            books={row} 
            onBookClick={handleBookClick} 
          />
        ))}
      </div>

      <BookDetailsModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  )
}
