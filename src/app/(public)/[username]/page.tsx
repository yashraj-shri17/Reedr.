import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Bookshelf from '@/components/shelf/Bookshelf'
import ShareProfileButton from '@/components/profile/ShareProfileButton'

interface PublicProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params
  
  const supabase = await createClient()
  
  // Fetch user profile
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Fetch their primary shelf
  const { data: shelf, error: shelfError } = await supabase
    .from('shelves')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_public', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single()

  // Fetch books for that shelf
  const { data: userBooks, error: booksError } = await supabase
    .from('user_books')
    .select('*, works(*), editions(*)')
    .eq('shelf_id', shelf?.id)
    .order('custom_sort_position', { ascending: true })

  const mappedBooks = userBooks?.map((ub: any) => ({
    id: ub.id,
    title: ub.works?.canonical_title || 'Unknown Title',
    author: ub.works?.canonical_author || 'Unknown Author',
    coverUrl: ub.works?.primary_cover_url
  })) || []

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      <header className="py-24 text-center container mx-auto px-4 space-y-8">
        <div className="relative inline-block">
          {user.profile_photo_url ? (
              <img 
                  src={user.profile_photo_url} 
                  className="w-32 h-32 rounded-[2.5rem] mx-auto border-4 border-white shadow-2xl object-cover transform rotate-3 hover:rotate-0 transition-transform duration-500" 
                  alt="" 
              />
          ) : (
            <div className="w-32 h-32 rounded-[2.5rem] mx-auto bg-accent/10 flex items-center justify-center text-accent shadow-inner border-4 border-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-[0.4em] text-accent">@{user.username}</h1>
            {user.display_name && <p className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">{user.display_name}</p>}
          </div>
          {user.bio && (
            <p className="text-muted text-lg font-medium italic opacity-60 max-w-lg mx-auto leading-relaxed px-6">
              "{user.bio}"
            </p>
          )}
          <div className="pt-4">
            <ShareProfileButton username={user.username!} />
          </div>
        </div>
      </header>

      <main className="container mx-auto pb-32">
        {shelf ? (
          <div className="space-y-12 px-4">
            <div className="flex items-center gap-4 justify-center py-8">
               <div className="h-px w-12 bg-accent/20" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Curated Collection</p>
               <div className="h-px w-12 bg-accent/20" />
            </div>
            <Bookshelf shelf={shelf} books={mappedBooks} isPublicView={true} />
          </div>
        ) : (
          <div className="glass-panel py-32 rounded-[3.5rem] text-center space-y-8 border-dashed border-2 border-accent/20 mx-4">
             <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent opacity-40"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
             </div>
             <p className="text-muted text-lg font-medium italic opacity-60">This gallery is currently being curated.</p>
          </div>
        )}
      </main>

      <footer className="py-16 text-center border-t border-border/50">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
          Created with <span className="text-accent">Reedr Boutique</span>
        </p>
      </footer>
    </div>
  )
}
