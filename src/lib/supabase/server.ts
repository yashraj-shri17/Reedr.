import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url?.includes('placeholder')) {
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'mock-user', email: 'demo@reedr.co' } }, error: null }),
        getSession: async () => ({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
      },
      from: (table: string) => {
        const createQueryBuilder = (currentData: any) => {
          return new Proxy({}, {
            get: (target, prop) => {
              if (prop === 'then') {
                return (resolve: any) => resolve({ data: currentData, error: null })
              }
              if (prop === 'single') {
                return () => createQueryBuilder(Array.isArray(currentData) ? currentData[0] : currentData)
              }
              if (prop === 'eq') {
                return (col: string, val: any) => {
                  if (table === 'shelves' && col === 'user_id') {
                    return createQueryBuilder({ id: 'mock-shelf', name: 'Demo Shelf', theme: 'minimalist' })
                  }
                  return createQueryBuilder(currentData)
                }
              }
              return () => createQueryBuilder(currentData)
            }
          }) as any
        }
        return createQueryBuilder([])
      }
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    url!,
    key!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
