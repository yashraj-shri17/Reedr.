'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  initialProfile: {
    username: string | null
    display_name: string | null
    bio: string | null
    profile_photo_url: string | null
  }
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [profile, setProfile] = useState({
    display_name: initialProfile?.display_name || '',
    bio: initialProfile?.bio || '',
    profile_photo_url: initialProfile?.profile_photo_url || ''
  })
  
  const supabase = createClient()
  const router = useRouter()

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('You must be logged in to upload a photo.')
      
      setPhotoUploading(true)
      
      // 1. Upload logic (Creates a unique path like /user_id/1234.png)
      const filePath = `${user.id}/${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)
        
      if (uploadError) {
         // Fallback handling if bucket doesn't exist yet in the user's Supabase project
         toast.error('Storage bucket "avatars" is missing in Supabase.')
         console.error('Upload Error:', uploadError)
         throw uploadError
      }
      
      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
        
      setProfile(prev => ({ ...prev, profile_photo_url: publicUrl }))
      toast.success('Photo uploaded! Remember to save.')
      
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('users')
        .update({
          display_name: profile.display_name,
          bio: profile.bio,
          profile_photo_url: profile.profile_photo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // 2. Synchronize with Auth Metadata so it reflects in the Nav profile 
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: profile.profile_photo_url,
          full_name: profile.display_name 
        }
      })

      if (authError) console.error("Could not sync auth metadata:", authError)
      
      toast.success('Boutique Identity Updated!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Photo Upload Section */}
        <div className="flex-shrink-0 space-y-4">
          <div className="relative group mx-auto md:mx-0">
            {profile.profile_photo_url ? (
               <img 
                 src={profile.profile_photo_url} 
                 className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105" 
                 alt="Profile" 
               />
            ) : (
               <div className="w-32 h-32 rounded-[2.5rem] bg-accent/10 border-4 border-white shadow-inner flex items-center justify-center text-accent transition-transform group-hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
            )}
            
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 md:group-hover:opacity-100 rounded-[2.5rem] cursor-pointer transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">
                {photoUploading ? '...' : 'Change'}
              </span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
                disabled={photoUploading}
              />
            </label>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">Avatar</p>
            <label className="inline-block px-4 py-2 border border-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent cursor-pointer hover:bg-accent/5 transition-all">
               {photoUploading ? 'Uploading...' : 'Upload Photo'}
               <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
                disabled={photoUploading}
              />
            </label>
          </div>
        </div>

        {/* Text Fields Section */}
        <div className="flex-1 w-full space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-4">Display Name</label>
            <input 
              name="display_name"
              value={profile.display_name}
              onChange={handleTextChange}
              className="w-full bg-background border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium" 
              placeholder="Your Name (e.g. Yashraj Studio)" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-4">Boutique Bio</label>
            <textarea 
               name="bio"
               value={profile.bio}
               onChange={handleTextChange}
               className="w-full bg-background border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium h-32 resize-none" 
               placeholder="Tell the world about your curated taste..." 
               maxLength={160} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-border/50">
        <button 
          onClick={handleSave} 
          disabled={loading || photoUploading}
          className="btn-primary py-3 px-8 text-xs disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Saving...' : 'Save Identity'}
        </button>
      </div>
    </div>
  )
}
