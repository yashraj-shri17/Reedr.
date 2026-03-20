import CSVImporter from '@/components/import/CSVImporter'
import Link from 'next/link'
import { PageTransition } from '@/components/layout/PageTransition'

export default function ImportPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-accent/30 grainy py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-6 space-y-24">
          <header className="space-y-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-4">
                <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-xs opacity-60">Migration Protocol</p>
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tight text-foreground font-serif text-gradient leading-none">Import</h1>
                <p className="text-muted text-lg md:text-xl font-medium italic opacity-60 leading-relaxed font-serif max-w-2xl">
                  Transfer your digital footprint from Goodreads or StoryGraph effortlessly.
                </p>
              </div>
              <Link 
                href="/settings"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-accent/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-accent hover:text-white transition-all shadow-sm flex-shrink-0 mx-auto md:mx-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Return to Settings
              </Link>
            </div>
          </header>

          <section className="relative group">
            <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full -z-10 group-hover:bg-accent/10 transition-colors duration-1000" />
            <CSVImporter />
          </section>

          <footer className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="glass-panel p-8 md:p-12 rounded-[3rem] space-y-6 border-white/10 group hover:border-accent/30 transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.4em] text-foreground">Goodreads Protocol</h3>
              <div className="space-y-4 text-sm text-muted font-medium font-serif leading-loose opacity-70">
                <p>1. Open Goodreads on your desktop browser.</p>
                <p>2. Navigate to <span className="text-foreground">My Books</span> and then <span className="text-foreground">Import and Export</span>.</p>
                <p>3. Click <span className="text-foreground">Export Library</span> and download the generated file.</p>
              </div>
            </div>
            
            <div className="glass-panel p-8 md:p-12 rounded-[3rem] space-y-6 border-white/10 group hover:border-accent/30 transition-all duration-500">
               <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="m17 5-5-3-5 3v14l5 3 5-3V5Z"/><path d="m12 14 5-3"/><path d="m7 11 5 3"/><path d="m12 14 v8"/></svg>
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.4em] text-foreground">StoryGraph Protocol</h3>
              <div className="space-y-4 text-sm text-muted font-medium font-serif leading-loose opacity-70">
                <p>1. Access your StoryGraph <span className="text-foreground">Settings</span>.</p>
                <p>2. Find the <span className="text-foreground">Export Data</span> section at the bottom.</p>
                <p>3. Select <span className="text-foreground">Download Export</span> to retrieve your library CSV.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  )
}
