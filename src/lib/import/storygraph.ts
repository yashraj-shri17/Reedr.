import type { ImportedBook } from './types'

/**
 * Parses a row from a StoryGraph CSV export.
 * StoryGraph columns include: Title, Authors, ISBN, ISBN13, My Rating, Date Read, Date Added, Status
 */
export function parseStoryGraphRow(row: any): ImportedBook | null {
  const title = row['Title']
  const author = row['Authors']
  
  if (!title || !author) return null

  let status: ImportedBook['status'] = 'read'
  const sgStatus = row['Status']
  
  if (sgStatus === 'to-read') status = 'want_to_read'
  else if (sgStatus === 'currently-reading') status = 'currently_reading'
  else if (sgStatus === 'read') status = 'read'
  else if (sgStatus === 'did-not-finish') status = 'dnf'
  
  const cleanISBN = (val: string) => val?.replace(/-/g, '').trim() || undefined

  return {
    title,
    author,
    isbn13: cleanISBN(row['ISBN13']),
    isbn: cleanISBN(row['ISBN']),
    rating: parseFloat(row['My Rating']) || undefined,
    status,
    dateRead: row['Date Read'] || undefined,
    dateAdded: row['Date Added'] || undefined,
  }
}

export function parseStoryGraphCSV(data: any[]): ImportedBook[] {
  return data
    .map(parseStoryGraphRow)
    .filter((book): book is ImportedBook => book !== null)
}
