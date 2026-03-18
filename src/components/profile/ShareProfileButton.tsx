'use client'

import { toast } from 'sonner'

export default function ShareProfileButton({ username }: { username: string }) {
  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`
    const title = `@${username}'s Bookshelf | Reedr`
    const text = `Check out @${username}'s curated bookshelf on Reedr Boutique.`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        toast.success('Shared successfully!')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Could not share. Link copied instead.')
          navigator.clipboard.writeText(url)
        }
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
      Share Shelf
    </button>
  )
}
