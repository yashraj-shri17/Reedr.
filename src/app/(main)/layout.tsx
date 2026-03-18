import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div className="glass-panel px-8 py-4 rounded-[2rem] flex items-center justify-between border-white/40 shadow-2xl">
          <Link href="/" className="text-xl font-bold tracking-[0.4em] uppercase hover:text-accent transition-all duration-300">
            REEDR
          </Link>
          
          <nav className="flex flex-wrap items-center justify-center gap-1">
            {[
              { href: '/shelf', label: 'Shelf' },
              { href: '/discover', label: 'Discover' },
              { href: '/search', label: 'Search' },
              { href: '/settings', label: 'Settings' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground hover:bg-accent/5 rounded-xl transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-12">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
