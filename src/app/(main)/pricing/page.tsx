'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { createCheckoutSession } from '@/lib/stripe/actions'
import { PageTransition } from '@/components/layout/PageTransition'
import Link from 'next/link'
import { toast } from 'sonner'

const plans = [
  {
    id: 'free',
    name: 'Standard Gallery',
    price: '$0',
    frequency: 'forever',
    description: 'Perfect for casual collectors starting their digital gallery.',
    features: [
      'Single 3D Shelving unit',
      'Up to 100 Verified Pieces',
      'Themed Public Profile',
      'Passive AI Recommendations',
      'Community Moods & Tags'
    ],
    buttonText: 'Current Plan',
    active: true,
    isPopular: false,
    priceId: null
  },
  {
    id: 'plus_monthly',
    name: 'Reedr Plus',
    price: '$9',
    frequency: 'per month',
    description: 'For serious curators who want infinite creative control.',
    features: [
      'Infinite 3D Shelves',
      'Unlimited Collection size',
      'Private Gallery Notes',
      'Detailed sub-ratings',
      'Early access to new Themes',
      'No watermarks on shared cards'
    ],
    buttonText: 'Upgrade to Plus',
    active: false,
    isPopular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder'
  },
  {
    id: 'plus_annual',
    name: 'Curator Annual',
    price: '$79',
    frequency: 'per year',
    description: 'The ultimate commitment to your literary legacy. Save 30%.',
    features: [
      'Everything in PLUS Monthly',
      'Curator Badge on Profile',
      'Priority Metadata updates',
      '2 Months FREE included',
      'One-time Early Adopter Price'
    ],
    buttonText: 'Go Annual',
    active: false,
    isPopular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder'
  }
]

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleUpgrade = async (priceId: string | null) => {
    if (!priceId) return
    setLoadingId(priceId)
    try {
      await createCheckoutSession(priceId)
    } catch (e: any) {
      toast.error(e.message || "Failed to initiate checkout. Please ensure you have restarted your server after adding .env keys.")
      console.error(e)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background py-24 md:py-40 px-6 grainy selection:bg-accent/30">
        <div className="max-w-7xl mx-auto space-y-24">
          <header className="text-center max-w-3xl mx-auto space-y-10">
            <div className="space-y-4">
              <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Economics of Curation</p>
              <h1 className="text-5xl md:text-9xl font-black tracking-tighter text-foreground font-serif text-gradient leading-none">Investment</h1>
            </div>
            <p className="text-muted text-lg md:text-2xl font-medium italic opacity-60 leading-relaxed font-serif">
              Choose the tier that reflects your passion for the written word. Support the growth of specialized digital shelving.
            </p>
            <div className="pt-4">
              <Link href="/shelf" className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center justify-center gap-2 group">
                 <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                 Return to Gallery
              </Link>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 relative items-start">
             {/* Decorative Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />

             {plans.map((plan) => (
               <motion.div
                 key={plan.id}
                 whileHover={{ y: -12 }}
                 className={`glass-panel p-8 md:p-12 rounded-[3.5rem] flex flex-col space-y-12 relative overflow-hidden group transition-all duration-700 ${plan.isPopular ? 'border-accent/40 shadow-2xl shadow-accent/10 scale-105 z-10 bg-accent/[0.02]' : 'border-white/10 hover:border-white/20'}`}
               >
                 {plan.isPopular && (
                   <div className="absolute top-0 right-0">
                      <div className="bg-accent text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg">Most Popular</div>
                   </div>
                 )}

                 <div className="space-y-6">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${plan.isPopular ? 'text-accent' : 'text-foreground/40'}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">{plan.price}</span>
                      <span className="text-muted text-xs font-medium opacity-40">/{plan.frequency}</span>
                    </div>
                    <p className="text-sm text-muted font-medium italic opacity-60 leading-relaxed font-serif pt-2">{plan.description}</p>
                 </div>

                 <div className="space-y-6 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Included Assets</p>
                    <ul className="space-y-5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-4 text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isPopular ? 'text-accent' : 'text-accent/30'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                          <span className="leading-tight tracking-wide">{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div className="pt-10">
                    {plan.priceId ? (
                       <button
                         onClick={() => handleUpgrade(plan.priceId)}
                         disabled={loadingId === plan.priceId}
                         className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-50 ${plan.isPopular ? 'bg-accent text-white shadow-accent/30' : 'bg-foreground text-background shadow-foreground/10 hover:bg-accent hover:text-white hover:border-accent'}`}
                       >
                         {loadingId === plan.priceId ? 'Processing...' : plan.buttonText}
                       </button>
                    ) : (
                      <div className="w-full text-center py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-accent/5 text-accent border border-accent/10 opacity-40 cursor-default">
                         Current Membership
                      </div>
                    )}
                 </div>
               </motion.div>
             ))}
          </div>

          <footer className="pt-32 text-center space-y-12">
             <div className="h-px w-full bg-accent/5" />
             <div className="grid md:grid-cols-3 gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Encrypted via Stripe</p>
                  <p className="text-[8px] font-medium opacity-60">Industry standard 256-bit SSL encryption</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Artisan Support</p>
                  <p className="text-[8px] font-medium opacity-60">100% of proceeds go toward development</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Cancelation Protocol</p>
                  <p className="text-[8px] font-medium opacity-60">No-questions-asked one-click cancelation</p>
               </div>
             </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  )
}
