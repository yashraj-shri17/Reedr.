import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'

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
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-16 selection:bg-accent/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted text-lg md:text-xl font-medium opacity-60">Manage your digital collection and boutique identity.</p>
        </div>
        {profile?.username && (
          <Link 
            href={`/${profile.username}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
          >
            View Public Profile
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </Link>
        )}
      </header>

      <div className="grid gap-12">
        {/* Profile Section */}
        <section className="glass-panel overflow-hidden rounded-[3rem]">
          <div className="p-10 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-8 bg-accent rounded-full" />
               <h2 className="text-2xl font-black uppercase tracking-widest text-foreground">Boutique Profile</h2>
            </div>
            
            <ProfileForm initialProfile={profile || { username: '', display_name: '', bio: '', profile_photo_url: '' }} />
          </div>
        </section>

        {/* Tools Section */}
        <div className="grid md:grid-cols-2 gap-8">
           <section className="glass-panel p-10 rounded-[3rem] space-y-6 flex flex-col">
             <div className="space-y-2">
               <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Import Tools</h2>
               <p className="text-sm text-muted font-medium opacity-60 leading-relaxed">Transfer your collection from Goodreads or StoryGraph effortlessly.</p>
             </div>
             <div className="pt-4 mt-auto">
               <Link 
                 href="/settings/import" 
                 className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest hover:gap-4 transition-all"
               >
                 Launch Importer
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </Link>
             </div>
           </section>

           <section className="glass-panel p-10 rounded-[3rem] space-y-6 flex flex-col bg-accent/5">
             <div className="space-y-2">
               <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Subscription</h2>
               <div className="flex items-center gap-2">
                 <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Current Tier:</p>
                 <span className="text-accent text-sm font-black uppercase tracking-widest italic">Standard</span>
               </div>
             </div>
             <div className="pt-4 mt-auto">
                <Link href="/pricing" className="btn-primary w-full inline-block text-center py-4 text-xs">
                  Upgrade to PLUS
                </Link>
             </div>
           </section>
        </div>

        {/* Danger Zone */}
        <section className="p-10 border-2 border-dashed border-red-500/20 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black uppercase tracking-widest text-red-500">Deactivate Account</h3>
            <p className="text-sm text-muted font-medium opacity-60">Permanently remove your boutique and collection from REEDR.</p>
          </div>
          <button className="border-2 border-red-500/20 text-red-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Delete Records
          </button>
        </section>
      </div>
    </div>
  )
}
