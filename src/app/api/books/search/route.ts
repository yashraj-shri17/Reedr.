import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchGoogleBooks } from '@/lib/books/google-books'
import { searchOpenLibrary } from '@/lib/books/open-library'
import { mergeBookResults } from '@/lib/books/merge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl?.includes('placeholder')) {
    // Return mock results for demo
    return NextResponse.json([
      { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', isbn13: '9780141439570', coverUrl: 'https://m.media-amazon.com/images/I/71Y8w4WfEAL._AC_UF1000,1000_QL80_.jpg', genres: ['Classic', 'Horror'] },
      { title: 'The Secret History', author: 'Donna Tartt', isbn13: '9780140167771', coverUrl: 'https://m.media-amazon.com/images/I/81I-l9WpBOL._AC_UF1000,1000_QL80_.jpg', genres: ['Contemporary', 'Thriller'] },
      { title: 'Circe', author: 'Madeline Miller', isbn13: '9781408890080', coverUrl: 'https://m.media-amazon.com/images/I/81S65-YqS-L._AC_UF1000,1000_QL80_.jpg', genres: ['Fantasy', 'Mythology'] },
    ])
  }

  const supabase = await createClient()

  // 1. Check database cache first (fuzzy match or exact title/author)
  const { data: cachedBooks, error: cacheError } = await supabase
    .from('works')
    .select('*, editions(*)')
    .or(`canonical_title.ilike.%${query}%,canonical_author.ilike.%${query}%`)
    .limit(10)

  if (cachedBooks && cachedBooks.length > 5) {
    // Return cached results if we have enough
    return NextResponse.json(cachedBooks)
  }

  // 2. Cache miss or insufficient results -> Fetch from APIs
  const [googleResults, olResults] = await Promise.all([
    searchGoogleBooks(query),
    searchOpenLibrary(query),
  ])

  const unifiedBooks = mergeBookResults(googleResults, olResults)

  // 3. Optional: Background task to save these to DB (omitted for brevity in route handler)
  // In a real app, you'd insert them now or when user adds to shelf.

  return NextResponse.json(unifiedBooks)
}
