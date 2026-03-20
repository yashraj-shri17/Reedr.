'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] text-center space-y-8 shadow-2xl">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 className="text-3xl font-black text-foreground font-serif">Authentication Error</h1>
        <div className="space-y-2">
          <p className="text-muted text-sm font-medium opacity-60">
            There was a problem verifying your login attempt.
          </p>
          {error && (
            <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 mt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 opacity-60 mb-1">Error Message</p>
              <p className="text-xs font-bold text-red-500/80">{decodeURIComponent(error)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Link 
          href="/login" 
          className="btn-primary inline-block w-full py-4 text-[10px] font-black uppercase tracking-widest"
        >
          Back to Login
        </Link>
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-40">
        REEDR Authentication System
      </p>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Suspense fallback={<div>Loading Error...</div>}>
         <ErrorContent />
      </Suspense>
    </div>
  )
}
