export interface UnifiedBook {
  title: string
  author: string
  isbn13?: string
  isbn10?: string
  googleBooksId?: string
  openLibraryWorkId?: string
  openLibraryEditionId?: string
  coverUrl?: string
  publicationYear?: number
  publisher?: string
  pageCount?: number
  genres?: string[]
}
