import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PageTransition } from '@/components/layout/PageTransition'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Profile data for identity
  const { data: profile } = await supabase
    .from('users')
    .select('username, display_name, bio, profile_photo_url')
    .eq('id', user?.id)
    .single()

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-32 px-4 space-y-24 selection:bg-accent/30 grainy">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <p className="text-accent font-black uppercase tracking-[0.4em] text-xs">Curation Console</p>
            <h1 className="text-6xl md:text-9xl font-black tracking-tight text-foreground font-serif text-gradient leading-none">Settings</h1>
            <p className="text-muted text-lg md:text-xl font-medium italic opacity-60 leading-relaxed font-serif">Manage your digital collection and boutique identity.</p>
          </div>
          {profile?.username && (
            <Link 
              href={`/${profile.username}`}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-accent/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-accent hover:text-white transition-all shadow-sm flex-shrink-0"
            >
              Public Gallery
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </Link>
          )}
        </header>

        <div className="grid gap-16">
          {/* Profile Section */}
          <section className="glass-panel overflow-hidden rounded-[3rem] relative">
             <div className="absolute top-0 right-0 p-8">
               <div className="text-[8px] font-black uppercase tracking-[0.4em] text-accent opacity-20 transform rotate-90 origin-right">Identity Meta</div>
             </div>
            <div className="p-10 md:p-16 space-y-12">
              <div className="flex items-center gap-6">
                 <div className="h-px w-12 bg-accent/40" />
                 <h2 className="text-sm font-black uppercase tracking-[0.4em] text-foreground">Boutique Profile</h2>
              </div>
              
              <ProfileForm initialProfile={profile || { username: '', display_name: '', bio: '', profile_photo_url: '' }} />
            </div>
          </section>

          {/* Tools Section */}
          <div className="grid md:grid-cols-2 gap-10">
             <section className="glass-panel p-12 rounded-[3.5rem] space-y-8 flex flex-col group border-none">
               <div className="space-y-4">
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">Import Tools</h2>
                 <p className="text-sm text-muted font-medium opacity-60 leading-relaxed font-serif">Transfer your library from Goodreads or StoryGraph effortlessly.</p>
               </div>
               <div className="pt-8 mt-auto">
                 <Link 
                   href="/settings/import" 
                   className="w-full inline-flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white hover:shadow-xl hover:shadow-accent/20 transition-all duration-500"
                 >
                   Launch Importer
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                 </Link>
               </div>
             </section>

             <section className="glass-panel p-12 rounded-[3.5rem] space-y-8 flex flex-col bg-accent/[0.03] border-accent/10">
               <div className="space-y-4">
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent">Gallery Tier</h2>
                 <div className="flex items-center gap-3">
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Current:</p>
                   <span className="bg-accent text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg italic">Standard</span>
                 </div>
               </div>
               <div className="pt-8 mt-auto">
                  <Link href="/pricing" className="btn-primary w-full inline-block text-center py-5 text-xs shadow-2xl shadow-accent/20">
                    Upgrade to PLUS
                  </Link>
               </div>
             </section>
          </div>

          {/* Danger Zone */}
          <section className="p-10 md:p-16 border-2 border-dashed border-red-500/10 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-10 bg-red-500/[0.01]">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-500/60">Deactivate Account</h3>
              <p className="text-sm text-muted font-medium italic opacity-60 font-serif">Permanently remove your boutique and collection from REEDR Gallery.</p>
            </div>
            <button className="border-2 border-red-500/10 text-red-500/50 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-500">
              Destroy Records
            </button>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
