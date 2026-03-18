import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url?.includes('placeholder')) {
    console.warn('Using mock Supabase client')
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'mock-user', email: 'demo@reedr.co' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'mock-user' } }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (cb: any) => {
          cb('SIGNED_IN', { user: { id: 'mock-user' } })
          return { data: { subscription: { unsubscribe: () => {} } } }
        }
      },
      from: (table: string) => {
        const createQueryBuilder = (currentData: any) => {
          return new Proxy({}, {
            get: (target, prop) => {
              if (prop === 'then') {
                return (resolve: any) => setTimeout(() => resolve({ data: currentData, error: null }), 100)
              }
              if (prop === 'single') {
                return () => createQueryBuilder(Array.isArray(currentData) ? currentData[0] : currentData)
              }
              if (prop === 'eq') {
                return (col: string, val: any) => {
                  if (table === 'user_books' && col === 'shelf_id') {
                    return createQueryBuilder([
                      { id: 'b1', shelf_id: 'mock-shelf', reading_status: 'reading', works: { canonical_title: 'The Great Gatsby', canonical_author: 'F. Scott Fitzgerald', primary_cover_url: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg' } },
                      { id: 'b2', shelf_id: 'mock-shelf', reading_status: 'want_to_read', works: { canonical_title: '1984', canonical_author: 'George Orwell', primary_cover_url: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' } },
                      { id: 'b3', shelf_id: 'mock-shelf', reading_status: 'read', works: { canonical_title: 'The Hobbit', canonical_author: 'J.R.R. Tolkien', primary_cover_url: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg' } },
                      { id: 'b4', shelf_id: 'mock-shelf', reading_status: 'read', works: { canonical_title: 'Project Hail Mary', canonical_author: 'Andy Weir', primary_cover_url: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg' } },
                      { id: 'b5', shelf_id: 'mock-shelf', reading_status: 'read', works: { canonical_title: 'Dune', canonical_author: 'Frank Herbert', primary_cover_url: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg' } },
                      { id: 'b6', shelf_id: 'mock-shelf', reading_status: 'want_to_read', works: { canonical_title: 'The Alchemist', canonical_author: 'Paulo Coelho', primary_cover_url: '' } },
                    ])
                  }
                  if (table === 'shelves' && col === 'user_id') {
                    return createQueryBuilder({ id: 'mock-shelf', name: 'Demo Shelf', theme: 'minimalist' })
                  }
                  return createQueryBuilder(currentData)
                }
              }
              // Handle other common methods by just returning the builder again
              return () => createQueryBuilder(currentData)
            }
          }) as any
        }
        return createQueryBuilder([])
      }
    } as any
  }

  return createBrowserClient<Database>(url!, key!)
}
