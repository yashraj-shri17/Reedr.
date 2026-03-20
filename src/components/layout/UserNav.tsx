'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserNavProps {
  user: any
}

export function UserNav({ user }: UserNavProps) {
  const supabase = createClient()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<{ avatar_url: string | null; full_name: string | null }>({
    avatar_url: user.user_metadata?.avatar_url || null,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member'
  })

  // Fetch the latest profile data from public.users table to ensure synced UI
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('profile_photo_url, display_name')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setProfile({
          avatar_url: data.profile_photo_url || user.user_metadata?.avatar_url || null,
          full_name: data.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member'
        })
      }
    }

    fetchProfile()
    
    // Set up a small interval or just re-fetch when navigation happens
    // For now, we fetch once on mount and rely on router.refresh() from ProfileForm to re-fetch
  }, [user.id, supabase])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
       toast.success('Logged out successfully')
       router.push('/login')
       router.refresh()
    } else {
       toast.error(error.message)
    }
  }

  const avatarUrl = profile.avatar_url
  const fullName = profile.full_name || 'Member'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-accent/5 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-accent/20 overflow-hidden border border-accent/10">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent text-[10px] font-black">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-muted truncate max-w-[100px]">{fullName}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-muted/50"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-4 w-56 glass-panel rounded-2xl border-white/20 shadow-2xl p-2 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-3 border-b border-white/10 mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-60">Connected as</p>
              <p className="text-xs font-bold truncate text-foreground/80">{user.email}</p>
            </div>
            
            <button 
              onClick={() => { router.push('/settings'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/5 transition-all text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-widest text-red-500/80 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
