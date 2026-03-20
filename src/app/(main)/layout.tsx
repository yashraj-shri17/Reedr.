import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'
import { UserNav } from '@/components/layout/UserNav'

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
      <header className="fixed top-2 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] md:w-[95%] max-w-4xl">
        <div className="glass-panel px-4 md:px-8 py-3 md:py-4 rounded-3xl md:rounded-[2rem] flex items-center justify-between border-white/40 shadow-2xl">
          <Link href="/" className="text-sm md:text-xl font-bold tracking-[0.4em] uppercase hover:text-accent transition-all duration-300 flex-shrink-0">
            REEDR
          </Link>
          
          <nav className="hidden sm:flex items-center justify-center gap-1 mx-4">
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

          <UserNav user={user} />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[90%] glass-panel rounded-2xl flex items-center justify-around py-4 px-2 border-white/20 shadow-2xl">
        {[
          { href: '/shelf', label: 'Shelf' },
          { href: '/discover', label: 'Explore' },
          { href: '/search', label: 'Find' },
          { href: '/settings', label: 'Set' },
        ].map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className="px-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground active:scale-95 transition-all"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 pt-24 md:pt-40 pb-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
