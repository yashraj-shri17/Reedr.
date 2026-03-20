'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export function Recommendations({ seedBook }: { seedBook?: any }) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      // If no book, just show some default high-quality classics
      const query = seedBook ? `subject:${seedBook.author}` : 'subject:literature+classic'
      
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=4`)
        const data = await response.json()
        
        if (data.items) {
          const recs = data.items.map((item: any) => ({
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0] || 'Unknown',
            coverUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || `https://covers.openlibrary.org/b/id/12836262-L.jpg`
          }))
          setRecommendations(recs)
        }
      } catch (error) {
        console.error("Failed to fetch recs:", error)
        // Fallback to static if API fails
        setRecommendations([
          { title: "Project Hail Mary", author: "Andy Weir", coverUrl: "https://covers.openlibrary.org/b/id/11182470-L.jpg" },
          { title: "Circe", author: "Madeline Miller", coverUrl: "https://covers.openlibrary.org/b/id/9264426-L.jpg" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [seedBook])

  if (loading) {
    return (
      <div className="flex gap-6 py-12 px-4 opacity-50">
         {[1, 2, 3].map(i => (
           <div key={i} className="w-32 aspect-[2/3] bg-accent/5 animate-pulse rounded-xl border border-accent/10" />
         ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center gap-4 px-4 overflow-hidden">
        <div className="h-px w-24 bg-accent/20" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent whitespace-nowrap">Aesthetically Curated for You</h3>
        <div className="h-px flex-1 bg-accent/20" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {recommendations.map((book, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="group relative cursor-pointer"
          >
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-accent/20">
              <img src={book.coverUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <p className="text-white text-xs font-black uppercase tracking-widest truncate">{book.title}</p>
                 <p className="text-white/60 text-[10px] uppercase font-bold truncate">by {book.author}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
