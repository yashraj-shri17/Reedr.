export interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  isbn?: string[]
  first_publish_year?: number
  number_of_pages_median?: number
  cover_i?: number
}

export async function searchOpenLibrary(query: string): Promise<OpenLibraryDoc[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Reedr/1.0 (https://reedr.co)'
      }
    })
    if (!response.ok) {
      console.warn(`[Open Library] Search failed with status: ${response.status}`)
      return []
    }
    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('[Open Library] Search Error:', (error as Error).message || error)
    return []
  }
}

export function getOpenLibraryCover(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}

export async function getOpenLibraryWork(workId: string) {
  const url = `https://openlibrary.org${workId}.json`
  try {
    const response = await fetch(url)
    return await response.json()
  } catch {
    return null
  }
}
