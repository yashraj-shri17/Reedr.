'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/mock-upgrade', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to upgrade')
      toast.success('Payment successful! Welcome to Reedr Plus. 🎉')
      router.push('/shelf')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-24 px-4 space-y-20 selection:bg-accent/30">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">Choose your level</h1>
        <p className="text-muted text-lg md:text-xl font-medium opacity-60 leading-relaxed">
          Support the artisan reading experience and unlock advanced boutique features for your collection.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Standard Tier */}
        <div className="glass-panel rounded-[3.5rem] p-12 flex flex-col space-y-10 group hover:shadow-2xl transition-all duration-500">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-widest text-foreground">Standard</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-foreground">$0</span>
              <span className="text-muted font-bold uppercase tracking-widest text-xs opacity-60">/ Lifetime</span>
            </div>
          </div>
          
          <ul className="space-y-6 flex-1">
            {[
              'Single 3D Bookshelf',
              'Public Profile URL',
              '3 AI Recommendations / month',
              'Standard Textures'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 text-sm font-bold opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent/40"><path d="M20 6 9 17l-5-5"/></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button className="w-full py-5 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-[0.2em] text-muted cursor-not-allowed" disabled>
            Current Access
          </button>
        </div>

        {/* Plus Tier */}
        <div className="glass-panel border-4 border-accent rounded-[3.5rem] p-12 flex flex-col space-y-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 bg-accent/5">
          <div className="absolute top-8 right-8 bg-accent text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            Preferred
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-widest text-accent">Plus</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-foreground">$2.99</span>
              <span className="text-muted font-bold uppercase tracking-widest text-xs opacity-60">/ Month</span>
            </div>
          </div>
          
          <ul className="space-y-6 flex-1">
            {[
              'Unlimited Shelves',
              'Advanced Sub-ratings',
              'Custom Boutique Textures',
              'Unlimited AI Discovery',
              'Watermark-free Identity Cards'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 text-sm font-black text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M20 6 9 17l-5-5"/></svg>
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary w-full py-6"
          >
            {loading ? 'Opening Vault...' : 'Upgrade to PLUS'}
          </button>
        </div>
      </div>
    </div>
  )
}
