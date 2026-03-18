'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageTransition } from '@/components/layout/PageTransition'

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
    <PageTransition>
      <div className="max-w-6xl mx-auto py-32 px-4 space-y-24 selection:bg-accent/30 grainy">
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <p className="text-accent font-black uppercase tracking-[0.6em] text-xs">Exhibition Access</p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground font-serif text-gradient leading-none">Choose your level</h1>
          <p className="text-muted text-lg md:text-xl font-medium italic opacity-60 leading-relaxed font-serif">
            Support the artisan reading experience and unlock advanced boutique features for your collection.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* Standard Tier */}
          <div className="glass-panel rounded-[4rem] p-12 md:p-16 flex flex-col space-y-12 group hover:shadow-2xl transition-all duration-700">
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted opacity-40">Standard Gallery</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-foreground">$0</span>
                <span className="text-muted font-black uppercase tracking-widest text-[10px] opacity-40">/ Lifetime</span>
              </div>
            </div>
            
            <ul className="space-y-6 flex-1">
              {[
                'Single High-Resolution Shelf',
                'Verified Public Profile',
                '3 AI Discoveries per month',
                'Standard Atmosphere'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
                  <div className="w-5 h-5 rounded-full bg-border/40 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className="w-full py-6 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-[0.3em] text-muted cursor-not-allowed" disabled>
              Active Membership
            </button>
          </div>

          {/* Plus Tier */}
          <div className="glass-panel border-2 border-accent/20 rounded-[4rem] p-12 md:p-16 flex flex-col space-y-12 relative overflow-hidden group hover:shadow-3xl hover:shadow-accent/15 transition-all duration-700 bg-accent/[0.03] scale-105">
            <div className="absolute top-0 right-0 p-8">
               <div className="bg-accent text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">
                Boutique
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent">Reedr Plus</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-foreground">$2.99</span>
                <span className="text-muted font-black uppercase tracking-widest text-[10px] opacity-60">/ Month</span>
              </div>
            </div>
            
            <ul className="space-y-6 flex-1">
              {[
                'Unlimited Themed Shelves',
                'Advanced Analytic Ratings',
                'Custom Atmosphere Textures',
                'Unlimited AI Mood Discovery',
                'Signature Identity Cards'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-foreground">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full py-8 text-xs shadow-2xl shadow-accent/40"
            >
              {loading ? 'Curating Plus Benefits...' : 'Claim Plus Access'}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
