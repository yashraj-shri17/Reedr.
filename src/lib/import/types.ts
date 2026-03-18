export interface ImportedBook {
  title: string
  author: string
  isbn13?: string
  isbn?: string
  rating?: number
  status: 'read' | 'currently_reading' | 'want_to_read' | 'dnf'
  dateRead?: string
  dateAdded?: string
}
