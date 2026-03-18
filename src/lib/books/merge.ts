import { GoogleBook, getHighResGoogleCover } from './google-books'
import { OpenLibraryDoc, getOpenLibraryCover } from './open-library'
import { UnifiedBook } from './types'

export function mergeBookResults(
  googleResults: GoogleBook[],
  olResults: OpenLibraryDoc[]
): UnifiedBook[] {
  const unifiedBooksMap = new Map<string, UnifiedBook>()

  // Process Google Results first
  googleResults.forEach((gb) => {
    const info = gb.volumeInfo
    const isbn13 = info.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier
    const isbn10 = info.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier
    const key = isbn13 || isbn10 || `gb-${gb.id}`

    unifiedBooksMap.set(key, {
      title: info.title,
      author: info.authors?.[0] || 'Unknown Author',
      isbn13,
      isbn10,
      googleBooksId: gb.id,
      coverUrl: getHighResGoogleCover(gb) || undefined,
      publicationYear: info.publishedDate ? new Date(info.publishedDate).getFullYear() : undefined,
      publisher: info.publisher,
      pageCount: info.pageCount,
      genres: info.categories,
    })
  })

  // Merge Open Library Results
  olResults.forEach((ol) => {
    const isbn13 = ol.isbn?.find((i) => i.length === 13)
    const isbn10 = ol.isbn?.find((i) => i.length === 10)
    const key = isbn13 || isbn10 || `ol-${ol.key}`

    const existing = unifiedBooksMap.get(key)

    if (existing) {
      // Enrich existing record
      existing.openLibraryWorkId = ol.key
      if (!existing.coverUrl && isbn13) {
        existing.coverUrl = getOpenLibraryCover(isbn13)
      }
      if (!existing.publicationYear) {
        existing.publicationYear = ol.first_publish_year
      }
      if (!existing.pageCount) {
        existing.pageCount = ol.number_of_pages_median
      }
    } else {
      unifiedBooksMap.set(key, {
        title: ol.title,
        author: ol.author_name?.[0] || 'Unknown Author',
        isbn13,
        isbn10,
        openLibraryWorkId: ol.key,
        coverUrl: isbn13 ? getOpenLibraryCover(isbn13) : undefined,
        publicationYear: ol.first_publish_year,
        pageCount: ol.number_of_pages_median,
      })
    }
  })

  return Array.from(unifiedBooksMap.values())
}
