import type { ImportedBook } from './types'

/**
 * Parses a row from a Goodreads CSV export.
 * Goodreads columns include: Title, Author, ISBN, ISBN13, My Rating, Date Read, Date Added, Exclusive Shelf
 */
export function parseGoodreadsRow(row: any): ImportedBook | null {
  const title = row['Title']
  const author = row['Author']
  
  if (!title || !author) return null

  let status: ImportedBook['status'] = 'read'
  const exclusiveShelf = row['Exclusive Shelf']
  
  if (exclusiveShelf === 'to-read') status = 'want_to_read'
  else if (exclusiveShelf === 'currently-reading') status = 'currently_reading'
  else if (exclusiveShelf === 'read') status = 'read'
  
  // Goodreads ISBNs are often exported as ="ISBN"
  const cleanISBN = (val: string) => val?.replace(/[="]/g, '').trim() || undefined

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

export function parseGoodreadsCSV(data: any[]): ImportedBook[] {
  return data
    .map(parseGoodreadsRow)
    .filter((book): book is ImportedBook => book !== null)
}
