import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Removed redirect to allow viewing landing page while logged in
  /*
  if (user) {
    redirect('/shelf')
  }
  */

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-8 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-[0.3em] uppercase text-foreground">
          REEDR
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">Features</Link>
          <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">Pricing</Link>
          <Link 
            href="/login" 
            className="bg-accent text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:brightness-105 transition-all shadow-lg shadow-accent/20"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
            Where readers curate, <br />
            display, and discover.
          </h1>
          <p className="text-lg md:text-xl text-muted font-bold max-w-xl mx-auto opacity-100">
            Build a bookshelf you're proud to share.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20"
            >
              Build Your Shelf
            </Link>
            <Link 
              href="/discover" 
              className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border border-border text-foreground px-10 py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-white transition-all"
            >
              Explore a demo shelf
            </Link>
          </div>

          {/* Book Preview Strip (Matching Image 1 bottom) */}
          <div className="pt-24 flex justify-center gap-8 md:gap-12 opacity-80 saturate-[0.8]">
             {[
               "https://covers.openlibrary.org/b/id/12836262-L.jpg",
               "https://covers.openlibrary.org/b/id/8231901-L.jpg",
               "https://covers.openlibrary.org/b/id/10540869-L.jpg",
               "https://covers.openlibrary.org/b/id/12961858-L.jpg"
             ].map((url, i) => (
               <div key={i} className="w-32 md:w-48 aspect-[2/3] bg-white rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 hover:-translate-y-4">
                 <img src={url} alt="Book cover" className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
        </div>
      </header>

      {/* Feature Section (Matching Image 2) */}
      <section id="features" className="py-32 px-8 bg-white/30 backdrop-blur-sm border-y border-border">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <p className="text-accent font-serif italic text-xl tracking-tighter">A shelf, not a spreadsheet</p>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight max-w-2xl mx-auto">
              Built for readers who care how their books look
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16 md:gap-8">
            <div className="text-center space-y-6 group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Curate Your Collection</h3>
              <p className="text-muted leading-relaxed font-normal">
                Add books to beautifully rendered shelves. No spreadsheets, no clutter — just your collection, displayed with care.
              </p>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.9 4.9 2.9 2.9"/><path d="m16.2 16.2 2.9 2.9"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.9 19.1 2.9-2.9"/><path d="m16.2 7.8 2.9-2.9"/></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Choose Your Atmosphere</h3>
              <p className="text-muted leading-relaxed font-normal">
                From Minimalist to Dark Academia, transform your shelf with immersive themes that reflect your reading identity.
              </p>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Discover What's Next</h3>
              <p className="text-muted leading-relaxed font-normal">
                Describe a mood, a feeling, a memory — and find books that match. Not algorithms. Something more human.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center space-y-6">
        <div className="text-xl font-black tracking-[0.4em] uppercase opacity-20">REEDR</div>
        <p className="text-muted text-xs font-bold uppercase tracking-widest">Digital Collections • Est. 2026</p>
      </footer>
    </div>
  )
}
