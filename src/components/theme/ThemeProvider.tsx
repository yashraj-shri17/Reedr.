'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeKey, themes } from './themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeContextType {
  currentTheme: ThemeKey
  setTheme: (theme: ThemeKey) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('minimalist')

  useEffect(() => {
    const savedTheme = localStorage.getItem('reedr-shelf-theme') as ThemeKey
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const themeVariables = themes[currentTheme]
    const root = document.documentElement
    
    // Explicitly apply each variable to the root element
    Object.entries(themeVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
    
    // Sync with next-themes if possible or just force class
    root.classList.remove('minimalist', 'dark_academia', 'botanical', 'pastel', 'vintage_library')
    root.classList.add(currentTheme)
    
    // Add data-theme attribute for easier targeting
    root.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  const setTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme)
    localStorage.setItem('reedr-shelf-theme', theme)
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="min-h-screen transition-all duration-700">
          {children}
        </div>
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useShelfTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useShelfTheme must be used within a ThemeProvider')
  }
  return context
}
