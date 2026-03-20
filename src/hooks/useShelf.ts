import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useCallback } from 'react'
import { updateStreak } from '@/lib/books/actions'

export function useShelf() {
  const [shelf, setShelf] = useState<any>(null)
  const [books, setBooks] = useState<any[]>([])
  const [goal, setGoal] = useState<{ current: number, target: number }>({ current: 0, target: 50 })
  const [username, setUsername] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
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
      setGoal({ current: 1, target: 20 })
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

    const year = new Date().getFullYear()

    // Fetch primary shelf, username, and reading goal
    const [shelfRes, userRes, goalRes] = await Promise.all([
      (supabase as any)
        .from('shelves')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })
        .limit(1)
        .single(),
      (supabase as any)
        .from('users')
        .select('username, current_streak')
        .eq('id', user.id)
        .single(),
      (supabase as any)
        .from('reading_goals')
        .select('target_books')
        .eq('user_id', user.id)
        .eq('year', year)
        .maybeSingle()
    ])

    const shelfData = shelfRes.data
    const profileData = userRes.data
    const goalData = goalRes.data

    if (profileData?.username) {
      setUsername(profileData.username)
      setStreak(profileData.current_streak || 0)
    }

    if (goalData) {
      setGoal(prev => ({ ...prev, target: goalData.target_books }))
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
          rating,
          rating_plot,
          rating_characters,
          rating_writing,
          rating_enjoyment,
          notes,
          works (
            canonical_title,
            canonical_author,
            primary_cover_url,
            genres
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
          reading_status: ub.reading_status,
          rating: ub.rating,
          rating_plot: ub.rating_plot,
          rating_characters: ub.rating_characters,
          rating_writing: ub.rating_writing,
          rating_enjoyment: ub.rating_enjoyment,
          notes: ub.notes,
          genres: ub.works.genres
        }))
        setBooks(formattedBooks)
        
        // Count 'read' books for goal
        const readCount = formattedBooks.filter((b: any) => b.reading_status === 'read').length
        setGoal(prev => ({ ...prev, current: readCount }))
      }
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchShelf()
    updateStreak() // Attempt to update streak on every shelf visit
  }, [fetchShelf])

  return { shelf, books, goal, streak, loading, username, refresh: fetchShelf }
}
