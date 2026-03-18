import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useCallback } from 'react'

export function useShelf() {
  const [shelf, setShelf] = useState<any>(null)
  const [books, setBooks] = useState<any[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchShelf = useCallback(async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (url?.includes('placeholder')) {
      console.log('Using direct mock data in useShelf')
      setUsername('demo')
      setShelf({ id: 'mock-shelf', name: 'Demo Shelf', theme: 'minimalist' })
      setBooks([
        { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg', pages_read: 210, total_pages: 324, reading_status: 'currently_reading' },
        { id: 'b2', title: '1984', author: 'George Orwell', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', pages_read: 420, total_pages: 420, reading_status: 'read' },
      ])
      setLoading(false)
      return
    }

    console.log('Fetching shelf data from Supabase...')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // Fetch primary shelf and username
    const [shelfRes, userRes] = await Promise.all([
      (supabase as any)
        .from('shelves')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })
        .limit(1)
        .single(),
      (supabase as any)
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single()
    ])

    const shelfData = shelfRes.data
    const profileData = userRes.data

    if (profileData?.username) {
      setUsername(profileData.username)
    }

    if (shelfData) {
      setShelf(shelfData)
      
      // Fetch books for this shelf
      const { data: userBooks } = await (supabase as any)
        .from('user_books')
        .select(`
          id,
          reading_status,
          pages_read,
          total_pages,
          works (
            canonical_title,
            canonical_author,
            primary_cover_url
          )
        `)
        .eq('shelf_id', shelfData.id)
        .order('date_added', { ascending: false })

      if (userBooks) {
        const formattedBooks = userBooks.map((ub: any) => ({
          id: ub.id,
          title: ub.works.canonical_title,
          author: ub.works.canonical_author,
          coverUrl: ub.works.primary_cover_url,
          pages_read: ub.pages_read || 0,
          total_pages: ub.total_pages || 0,
          reading_status: ub.reading_status
        }))
        setBooks(formattedBooks)
      }
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchShelf()
  }, [fetchShelf])

  return { shelf, books, loading, username, refresh: fetchShelf }
}
