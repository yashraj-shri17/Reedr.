export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    industryIdentifiers?: Array<{ type: string; identifier: string }>
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
      small?: string
      medium?: string
      large?: string
      extraLarge?: string
    }
  }
}

export async function searchGoogleBooks(query: string): Promise<GoogleBook[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
        console.warn(`[Google Books] Search failed with status: ${response.status}`)
        return []
    }
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.warn('[Google Books] Search Error:', (error as Error).message || error)
    return []
  }
}

export function getHighResGoogleCover(volume: GoogleBook): string | null {
  const links = volume.volumeInfo.imageLinks
  if (!links) return null
  
  // Potential for zoom=3 trick mentioned in PRD
  let cover = links.extraLarge || links.large || links.medium || links.small || links.thumbnail
  
  if (cover && cover.includes('zoom=1')) {
     return cover.replace('zoom=1', 'zoom=3')
  }
  
  return cover || null
}
