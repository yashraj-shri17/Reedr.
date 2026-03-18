import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[0.4em] text-foreground uppercase">
            REEDR
          </h1>
        </div>
        {children}
      </div>
    </div>
  )
}
