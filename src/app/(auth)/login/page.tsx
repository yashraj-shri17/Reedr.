'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // This allows new users to "sign up" via OTP
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Wait for the 6-digit code in your email!')
      setStep('otp')
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Access granted.')
      router.push('/shelf')
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
       toast.error(error.message)
    }
  }

  return (
    <div className="glass-panel p-10 rounded-[2.5rem] border-none shadow-2xl space-y-8 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-foreground">Secure Entry</h2>
        <p className="text-muted text-sm font-medium opacity-60 italic font-serif">
          {step === 'email' ? 'Enter your coordinates to receive a code' : 'Check your inbox for the secret key'}
        </p>
      </div>
      
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-4">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. reader@example.com"
              className="w-full bg-background border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-sm"
          >
            {loading ? 'Transmitting...' : 'Send Access Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-4">6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full bg-background border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-center text-2xl font-black tracking-[0.5em]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-sm"
          >
            {loading ? 'Verifying...' : 'Unlock Gallery'}
          </button>
          <button 
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            Use different email
          </button>
        </form>
      )}

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
            <span className="bg-surface px-4 text-muted">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 border-2 border-border/50 hover:border-accent/40 bg-white p-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-background"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google Account
        </button>
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
        By entering, you agree to our <span className="text-foreground underline">Terms of Exhibition</span>
      </p>
    </div>
  )
}
