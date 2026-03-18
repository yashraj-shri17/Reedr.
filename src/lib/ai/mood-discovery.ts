import { groq } from './groq'
import { searchGoogleBooks, getHighResGoogleCover } from '../books/google-books'
import { searchOpenLibrary } from '../books/open-library'

/**
 * Strictly verifies if a cover image exists and is high quality (not a placeholder).
 */
async function verifyCover(url: string | null): Promise<boolean> {
  if (!url) return false
  
  // Force HTTPS
  const secureUrl = url.replace('http://', 'https://')

  try {
    const res = await fetch(secureUrl, { 
      method: 'HEAD', 
      cache: 'force-cache',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    if (!res.ok) return false
    
    const contentType = res.headers.get('content-type')
    const contentLength = res.headers.get('content-length')
    
    // Filtering based on common placeholder sizes. 
    // Smallest real book cover is usually > 15KB. 
    // Google/OL placeholders are almost always < 8KB.
    if (contentLength && parseInt(contentLength) < 8000) {
      console.log(`[Verify] Rejected low-quality image: ${secureUrl} size: ${contentLength}`)
      return false
    }
    
    if (contentType && !contentType.startsWith('image/')) return false

    return true
  } catch (error) {
    return false
  }
}

export async function discoverBooksByMood(mood: string) {
  if (!process.env.GROQ_API_KEY) {
    return [
      { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', description: 'A mysterious gothic tale.', coverUrl: 'https://covers.openlibrary.org/b/id/10549429-L.jpg' }
    ]
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional book librarian. 
          Return a JSON object with a key "books" containing an array of exactly 20 books (WE NEED A LARGE POOL TO ENSURE COVERS) that match the user's mood/description perfectly.
          Return ONLY valid JSON: {"books": [{"title": "Title", "author": "Author", "description": "Why it matches"}]}`
        },
        {
          role: 'user',
          content: `Mood/Prompt: ${mood}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content || '{"books": []}'
    const parsed = JSON.parse(content)
    const candidates: any[] = parsed.books || []
    
    const enrichedResults: any[] = []
    
    // Process candidates to find at least 5 with high-quality covers
    for (const book of candidates) {
      if (enrichedResults.length >= 6) break // Stop after finding enough good ones

      try {
        const query = `${book.title} ${book.author}`
        let foundCover: string | null = null
        
        // Priority 1: Google Books (Check first 3 results)
        const gResults = await searchGoogleBooks(query)
        for (let i = 0; i < Math.min(gResults.length, 3); i++) {
          const cover = getHighResGoogleCover(gResults[i])
          if (cover && !cover.includes('fife') && await verifyCover(cover)) {
            foundCover = cover.replace('http://', 'https://')
            break
          }
        }

        // Priority 2: Open Library (Check first 3 results)
        if (!foundCover) {
          const olResults = await searchOpenLibrary(query)
          for (let i = 0; i < Math.min(olResults.length, 3); i++) {
            const doc = olResults[i]
            const useId = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=404` : null
            const useIsbn = (doc.isbn && doc.isbn.length > 0) ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg?default=404` : null
            
            if (useId && await verifyCover(useId)) {
                foundCover = useId
                break
            } else if (useIsbn && await verifyCover(useIsbn)) {
                foundCover = useIsbn
                break
            }
          }
        }
        
        if (foundCover) {
          enrichedResults.push({ ...book, coverUrl: foundCover })
          console.log(`[Discovery] Verified book found with cover: ${book.title}`)
        }
      } catch (e) {
        // Skip silent
      }
    }

    // Safety fallback only if pool failed
    if (enrichedResults.length < 3) {
      return [
        { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', description: 'A haunting mystery.', coverUrl: 'https://covers.openlibrary.org/b/id/10549429-L.jpg' },
        { title: 'The Night Circus', author: 'Erin Morgenstern', description: 'A magical contest.', coverUrl: 'https://covers.openlibrary.org/b/id/12918827-L.jpg' },
        { title: 'Normal People', author: 'Sally Rooney', description: 'Human connection.', coverUrl: 'https://covers.openlibrary.org/b/id/12869588-L.jpg' },
        { title: 'Circe', author: 'Madeline Miller', description: 'Goddess of magic.', coverUrl: 'https://covers.openlibrary.org/b/id/8381830-L.jpg' },
        { title: 'The Secret History', author: 'Donna Tartt', description: 'Dark academia.', coverUrl: 'https://covers.openlibrary.org/b/id/12658825-L.jpg' }
      ].slice(0, 5)
    }

    return enrichedResults.slice(0, 5)
  } catch (error) {
    console.error('Groq discovery error:', error)
    return [
       { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', description: 'A haunting mystery.', coverUrl: 'https://covers.openlibrary.org/b/id/10549429-L.jpg' }
    ]
  }
}
