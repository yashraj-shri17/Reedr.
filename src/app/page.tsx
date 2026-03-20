import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageTransition } from '@/components/layout/PageTransition'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-accent/30 grainy relative isolate">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between px-6 md:px-16 py-8 md:py-10 max-w-7xl mx-auto relative z-50">
          <div className="text-xl md:text-3xl font-black tracking-[0.4em] uppercase text-foreground/80">
            REEDR
          </div>
          <div className="hidden md:flex items-center gap-12">
            <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors">Philosophy</Link>
            <Link href="/discover" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors">Exhibition</Link>
            <Link 
              href={user ? "/shelf" : "/login"} 
              className="bg-accent text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-accent/20"
            >
              {user ? "Your Shelf" : "Entry"}
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-32 pb-48 px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-accent/5 rounded-full blur-[160px] -z-10" />
          
          <div className="max-w-6xl mx-auto text-center space-y-16">
            <div className="space-y-6">
              <p className="text-accent font-black uppercase tracking-[0.6em] text-[10px] md:text-xs">Digital Collections</p>
              <h1 className="text-5xl md:text-9xl font-black text-foreground tracking-tighter leading-[1.1] md:leading-[0.8] font-serif py-4">
                <span className="text-gradient">Where readers</span> <br />
                <span className="italic opacity-80">exhibit.</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-2xl text-muted font-medium max-w-2xl mx-auto leading-relaxed font-serif italic opacity-60 px-4">
              Transform your reading list into a stunning digital gallery. Built for those who care about the aesthetics of literature.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-6 px-8">
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-foreground text-background px-10 md:px-12 py-5 md:py-6 rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-foreground/10"
              >
                Curate Your Space
              </Link>
              <Link 
                href="/discover" 
                className="w-full sm:w-auto bg-white/40 backdrop-blur-md border border-accent/20 text-foreground px-10 md:px-12 py-5 md:py-6 rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] hover:bg-white transition-all"
              >
                Explore Galleries
              </Link>
            </div>

            {/* Book Preview Strip */}
            <div className="pt-20 md:pt-32 flex justify-center gap-4 md:gap-10 perspective-1000 overflow-hidden px-4">
               {[
                 "https://covers.openlibrary.org/b/id/12836262-L.jpg",
                 "https://covers.openlibrary.org/b/id/8231901-L.jpg",
                 "https://covers.openlibrary.org/b/id/10540869-L.jpg",
                 "https://covers.openlibrary.org/b/id/12961858-L.jpg"
               ].map((url, i) => (
                 <div 
                   key={i} 
                   className={`${i > 1 ? 'hidden sm:block' : ''} w-24 md:w-56 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden preserve-3d animate-float`}
                   style={{ animationDelay: `${i * 0.4}s` }}
                 >
                   <img src={url} alt="Book cover" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                   <div className="absolute inset-0 spine-lighting pointer-events-none" />
                 </div>
               ))}
            </div>
          </div>
        </header>

        {/* Philosophy Section */}
        <section id="features" className="py-48 px-8 border-y border-accent/5 relative overflow-hidden bg-white/[0.02]">
          <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center space-y-6">
              <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Our Philosophy</p>
              <h2 className="text-4xl md:text-8xl font-black text-foreground tracking-tight max-w-4xl mx-auto font-serif leading-tight md:leading-none px-4">
                A gallery, <br />not a spreadsheet.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-20">
              {[
                {
                  title: "Artistic Curation",
                  desc: "Add books to beautifully rendered shelves. No clutter — just your collection, displayed with intentional care.",
                  icon: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></>
                },
                {
                  title: "Atmospheric Themes",
                  desc: "From Dark Academia to Royal Library, transform your space with themes that match your reading identity.",
                  icon: <><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/></>
                },
                {
                  title: "Human Discovery",
                  desc: "Describe a mood, a place, or a memory — and let AI find the perfect next read. Something more than algorithms.",
                  icon: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></>
                }
              ].map((item, i) => (
                <div key={i} className="space-y-8 group">
                  <div className="w-20 h-20 bg-accent/5 text-accent rounded-[2rem] flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-foreground font-serif tracking-tight">{item.title}</h3>
                    <p className="text-muted leading-relaxed font-medium opacity-60">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-32 text-center space-y-10 bg-white/[0.01]">
          <div className="text-4xl font-black tracking-[0.6em] text-foreground/10 uppercase">REEDR</div>
          <div className="space-y-2">
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em]">Digital Galleries • Est. 2026</p>
            <p className="text-muted text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Hand-crafted for the aesthetic reader</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
