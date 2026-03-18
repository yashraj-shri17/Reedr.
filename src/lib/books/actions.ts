'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { UnifiedBook } from './types'
import { revalidatePath } from 'next/cache'

export async function ensureDefaultShelf(supabase: any, userId: string) {
  // Use maybeSingle to avoid PGRST116 error if no shelf is found
  const { data: shelf } = await (supabase as any)
    .from('shelves')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (shelf) return shelf.id

  // 1. Ensure user profile exists using ADMIN client to bypass RLS
  const { data: { user } } = await supabase.auth.getUser()
  
  await supabaseAdmin.from('users').upsert({
    id: userId,
    email: user?.email || `${userId}@placeholder.reedr.com`,
    username: user?.email?.split('@')[0] || `user_${userId.substring(0, 5)}`,
    display_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
  }, { onConflict: 'id' })

  // 2. Create shelf using ADMIN client
  const { data: newShelf, error } = await supabaseAdmin
    .from('shelves')
    .insert({
      user_id: userId,
      name: 'Primary Shelf',
      theme: 'minimalist',
      is_public: true
    })
    .select('id')
    .single()

  if (error) {
    console.error("Shelf creation error:", error)
    throw error
  }
  return newShelf.id
}

export async function addBookToShelf(book: UnifiedBook, shelfId?: string, status: string = 'want_to_read') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Force Sync User Profile using ADMIN
  await supabaseAdmin.from('users').upsert({
    id: user.id,
    email: user.email,
    username: user.email?.split('@')[0],
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' })

  // 2. Resolve Shelf ID
  let targetShelfId = (shelfId && shelfId !== "") ? shelfId : null;
  
  if (!targetShelfId) {
    targetShelfId = await ensureDefaultShelf(supabase, user.id)
  }

  // 3. Find or Create Work (Use Admin to ensure global access)
  let workId: string

  const { data: existingWork } = await supabaseAdmin
    .from('works')
    .select('id')
    .eq('canonical_title', book.title)
    .eq('canonical_author', book.author)
    .maybeSingle()

  if (existingWork) {
    workId = existingWork.id
  } else {
    const { data: newWork, error: workError } = await supabaseAdmin
      .from('works')
      .insert({
        canonical_title: book.title,
        canonical_author: book.author,
        open_library_work_id: book.openLibraryWorkId,
        primary_cover_url: book.coverUrl,
        genres: book.genres,
      })
      .select('id')
      .single()

    if (workError) {
      console.error("Work Insert Error:", workError)
      throw new Error(`Work creation failed: ${workError.message}`)
    }
    workId = newWork.id
  }

  // 4. Find or Create Edition (Admin)
  let editionId: string | undefined

  if (book.isbn13 || book.isbn10) {
    const { data: existingEdition } = await supabaseAdmin
      .from('editions')
      .select('id')
      .or(`isbn13.eq.${book.isbn13},isbn.eq.${book.isbn10}`)
      .maybeSingle()

    if (existingEdition) {
      editionId = existingEdition.id
    } else {
      const { data: newEdition, error: editionError } = await supabaseAdmin
        .from('editions')
        .insert({
          work_id: workId,
          isbn: book.isbn10,
          isbn13: book.isbn13,
          google_books_id: book.googleBooksId,
          open_library_edition_id: book.openLibraryEditionId,
          title: book.title,
          author: book.author,
          cover_image_url: book.coverUrl,
          publication_year: book.publicationYear,
          publisher: book.publisher,
          page_count: book.pageCount,
        })
        .select('id')
        .single()

      if (!editionError) {
        editionId = newEdition.id
      }
    }
  }

  // 5. Link User to Work (Regular Client)
  const { error: junctionError } = await (supabase as any)
    .from('user_books')
    .upsert({
      user_id: user.id,
      work_id: workId,
      edition_id: editionId,
      shelf_id: targetShelfId,
      reading_status: status as any,
      total_pages: book.pageCount || 0,
      pages_read: status === 'read' ? (book.pageCount || 0) : 0
    }, { onConflict: 'user_id,work_id,shelf_id' })

  if (junctionError) {
    console.error("Final Junction Error (23503 Check):", junctionError)
    throw new Error(`Shelf link failed: ${junctionError.message} (Code: ${junctionError.code})`)
  }

  revalidatePath('/shelf')
  return { success: true }
}

export async function updateBookProgress(userBookId: string, pagesRead: number, totalPages?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const updateData: any = {
    pages_read: pagesRead,
    updated_at: new Date().toISOString()
  }

  if (totalPages !== undefined) {
    updateData.total_pages = totalPages
  }

  // If pages_read == total_pages, auto-mark as read?
  if (totalPages && pagesRead >= totalPages) {
    updateData.reading_status = 'read'
  }

  const { error } = await (supabase as any)
    .from('user_books')
    .update(updateData)
    .eq('id', userBookId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/shelf')
  return { success: true }
}

export async function updateShelfTheme(shelfId: string, theme: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('shelves')
    .update({ theme })
    .eq('id', shelfId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/shelf')
  return { success: true }
}

export async function updateBookDetails(userBookId: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('user_books')
    .update({ 
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', userBookId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/shelf')
  return { success: true }
}

export async function updateReadingGoal(target: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const year = new Date().getFullYear()

  await supabaseAdmin
    .from('reading_goals')
    .upsert({
      user_id: user.id,
      year: year,
      target_books: target,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,year' })

  revalidatePath('/shelf')
  return { success: true }
}
