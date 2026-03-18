'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ThemeKey, themes } from './themes'
import { useShelfTheme } from './ThemeProvider'
import { updateShelfTheme } from '@/lib/books/actions'
import { toast } from 'sonner'

export function ThemeSwitcher({ shelfId }: { shelfId?: string }) {
  const { currentTheme, setTheme } = useShelfTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const themeDisplayNames: Record<ThemeKey, string> = {
    minimalist: 'Boutique',
    dark_academia: 'Dark Academia',
    botanical: 'Botanical',
    pastel: 'Midnight',
    vintage_library: 'Royal'
  }

  const handleThemeChange = async (theme: ThemeKey) => {
    setTheme(theme)
    if (shelfId) {
      try {
        await updateShelfTheme(shelfId, theme)
      } catch (e: any) {
        console.error("Failed to sync theme to DB:", e)
      }
    }
    toast.success(`${themeDisplayNames[theme]} theme applied!`, {
      style: {
        background: themes[theme]['--surface'],
        color: themes[theme]['--foreground'],
        border: `1px solid ${themes[theme]['--glass-border']}`
      }
    })
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 glass-panel rounded-2xl flex items-center gap-3 hover:scale-105 transition-all group"
      >
        <div 
          className="w-4 h-4 rounded-full shadow-inner" 
          style={{ backgroundColor: themes[currentTheme]['--preview-color'] }} 
        />
        <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          Theme: {themeDisplayNames[currentTheme]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-4 z-50 glass-panel p-4 rounded-[2rem] w-64 space-y-2 border border-white/20 shadow-2xl"
            >
              <div className="px-3 py-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Aesthetic Selection</p>
              </div>
              
              <div className="grid grid-cols-1 gap-1">
                {(Object.keys(themes) as ThemeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleThemeChange(key)
                      setIsOpen(false)
                    }}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-xl transition-all group/item
                      ${currentTheme === key ? 'bg-accent/10 border-accent/20 border' : 'hover:bg-white/5 border border-transparent'}
                    `}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg shadow-lg rotate-3 group-hover/item:rotate-12 transition-transform" 
                      style={{ backgroundColor: themes[key]['--preview-color'] }}
                    />
                    <div className="text-left">
                      <p className={`text-xs font-black uppercase tracking-tight ${currentTheme === key ? 'text-accent' : 'text-foreground'}`}>
                        {themeDisplayNames[key]}
                      </p>
                      <p className="text-[9px] font-bold text-muted uppercase">Premium Aesthetic</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
