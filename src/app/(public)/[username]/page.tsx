import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Bookshelf from '@/components/shelf/Bookshelf'
import ShareProfileButton from '@/components/profile/ShareProfileButton'
import Link from 'next/link'
import { PageTransition } from '@/components/layout/PageTransition'

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
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-accent/30 grainy relative">
        <header className="py-32 text-center container mx-auto px-4 space-y-10 relative isolate">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />
          
          <div className="relative inline-block">
            {user.profile_photo_url ? (
                <img 
                    src={user.profile_photo_url} 
                    className="w-40 h-40 rounded-[3rem] mx-auto border-4 border-white shadow-2xl object-cover transform rotate-3 hover:rotate-0 transition-transform duration-500" 
                    alt="" 
                />
            ) : (
              <div className="w-40 h-40 rounded-[3rem] mx-auto bg-accent/10 flex items-center justify-center text-accent shadow-inner border-4 border-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.6em] text-accent opacity-60">Verified Reader</p>
              {user.display_name && (
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight text-foreground font-serif text-gradient break-words leading-tight px-4 max-w-4xl mx-auto">
                  {user.display_name}
                </h1>
              )}
              <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] opacity-40 break-all px-4 max-w-md mx-auto line-clamp-1">@{user.username}</p>
            </div>
            
            {user.bio ? (
              <p className="text-muted text-xl font-medium italic opacity-60 max-w-xl mx-auto leading-relaxed px-6 font-serif">
                "{user.bio}"
              </p>
            ) : (
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Artistically curated collection</p>
            )}
            
            <div className="pt-8 flex flex-wrap justify-center gap-4">
              <ShareProfileButton username={user.username!} />
              <Link href="/login" className="px-8 py-4 border-2 border-accent/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-accent hover:text-white transition-all">Report Gallery</Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto pb-48">
          {shelf ? (
            <div className="space-y-16 px-4">
              <div className="flex items-center gap-6 justify-center py-12">
                 <div className="h-px flex-1 max-w-[100px] bg-accent/20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Primary Gallery</p>
                 <div className="h-px flex-1 max-w-[100px] bg-accent/20" />
              </div>
              <div className="relative">
                <Bookshelf books={mappedBooks} isPublicView={true} />
              </div>
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

        <section className="container mx-auto px-4 pb-32">
          <div className="glass-panel p-12 md:p-24 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
            <div className="space-y-4 relative z-10">
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs">Curate your own</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-foreground font-serif">Ready to exhibit your library?</h2>
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                Join thousands of readers who are transforming their reading lists into stunning digital galleries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/signup" className="btn-primary px-12 py-6 text-xs">Start Your Gallery</Link>
              <Link href="/" className="px-12 py-6 border-2 border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all">Learn More</Link>
            </div>
          </div>
        </section>

        <footer className="py-24 text-center border-t border-border/10 bg-white/5">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-[0.5em] text-foreground/20">REEDR</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted opacity-40">
              Artistic Collections • Est. 2026
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
