import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { BookSearch } from '@/components/book/BookSearch'
import React from 'react'

export default async function SearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user's primary shelf
  let { data: shelf } = await supabase
    .from('shelves')
    .select('id')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true })
    .maybeSingle()

  // Auto-create a default shelf for the user if they don't have one
  if (!shelf) {
    // 1. Ensure user exists in public.users (Use ADMIN to bypass RLS)
    await supabaseAdmin.from('users').upsert({
      id: user.id,
      email: user.email,
      username: user.email?.split('@')[0],
      display_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
    }, { onConflict: 'id' })

    // 2. Create the Shelf (Use ADMIN)
    const { data: newShelf } = await supabaseAdmin
      .from('shelves')
      .insert({
        user_id: user.id,
        name: 'My Shelf',
        theme: 'minimalist',
        sort_order: 0,
        is_public: true
      })
      .select('id')
      .single()
      
    if (newShelf) {
      shelf = newShelf
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 selection:bg-accent/30">
      <header className="text-center mb-12 md:mb-24 space-y-4">
        <h1 className="text-3xl md:text-8xl font-bold tracking-tight text-foreground">
          Expand your Library
        </h1>
        <p className="text-muted text-lg md:text-xl font-medium opacity-60">
          Search for masterpieces to curate on your digital shelf.
        </p>
      </header>
      
      <BookSearch shelfId={shelf?.id || ''} />
    </div>
  )
}
