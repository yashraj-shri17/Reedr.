'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { updateBookProgress } from '@/lib/books/actions'
import { toast } from 'sonner'

interface ProgressModalProps {
  book: any
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ProgressModal({ book, isOpen, onClose, onUpdate }: ProgressModalProps) {
  const [pagesRead, setPagesRead] = useState(book?.pages_read || 0)
  const [totalPages, setTotalPages] = useState(book?.total_pages || 0)
  const [loading, setLoading] = useState(false)

  if (!isOpen || !book) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateBookProgress(book.id, pagesRead, totalPages)
      toast.success('Progress updated!')
      onUpdate()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update progress')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-panel w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 space-y-8"
        >
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Update Progress</h3>
            <p className="text-muted text-sm font-medium">Kitni padh li aapne?</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-2">Current Page</label>
              <input 
                type="number" 
                value={pagesRead}
                onChange={(e) => setPagesRead(parseInt(e.target.value) || 0)}
                className="sexy-input text-center text-xl font-black"
                placeholder="210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-2">Total Pages</label>
              <input 
                type="number" 
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                className="sexy-input text-center text-xl font-black opacity-60 focus:opacity-100"
                placeholder="324"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex-[2] btn-primary py-4"
            >
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
