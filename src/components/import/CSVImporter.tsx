'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { parseGoodreadsCSV } from '@/lib/import/goodreads'
import { parseStoryGraphCSV } from '@/lib/import/storygraph'
import { ImportedBook } from '@/lib/import/types'
import { addBookToShelf } from '@/lib/books/actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'

export default function CSVImporter() {
  const [importing, setImporting] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [preview, setPreview] = useState<ImportedBook[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProcessing(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
        let books: ImportedBook[] = []
        
        // Basic detection logic
        const headers = Object.keys(data[0] || {})
        if (headers.includes('Exclusive Shelf')) {
          books = parseGoodreadsCSV(data)
          toast.success(`Detected Goodreads export: ${books.length} books found`)
        } else if (headers.includes('Status') && (headers.includes('Authors') || headers.includes('Author'))) {
          books = parseStoryGraphCSV(data)
          toast.success(`Detected StoryGraph export: ${books.length} books found`)
        } else {
          toast.error('Unexpected CSV format. Please ensure it is a direct export from Goodreads or StoryGraph.')
        }
        
        setPreview(books)
        setProcessing(false)
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`)
        setProcessing(false)
      }
    })
  }

  const handleImport = async () => {
    if (preview.length === 0) return
    setImporting(true)
    setProgress({ current: 0, total: preview.length })
    
    let successCount = 0
    let errorCount = 0

    // Process sequentially to be safe with database/API limits
    for (let i = 0; i < preview.length; i++) {
        const book = preview[i]
        try {
            await addBookToShelf({
                title: book.title,
                author: book.author,
                isbn13: book.isbn13,
                isbn10: book.isbn,
            }, undefined, book.status)
            successCount++
        } catch (err) {
            console.error(`Failed to import ${book.title}:`, err)
            errorCount++
        }
        setProgress(prev => ({ ...prev, current: i + 1 }))
    }

    toast.success(`Import complete! ${successCount} books added. ${errorCount} failed.`)
    setPreview([])
    setImporting(false)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview.length === 0 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full group-hover:bg-accent/10 transition-colors duration-700" />
            
            <div className="relative z-10">
                <div className="mb-10 flex justify-center">
                    <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent ring-8 ring-accent/5 transform group-hover:rotate-6 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15l3-3 3 3"/><path d="M12 12v9"/></svg>
                    </div>
                </div>
                
                <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    id="csv-upload" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    disabled={processing}
                />
                
                <h2 className="text-4xl font-black mb-4 tracking-tight">Sync your library</h2>
                <p className="text-muted text-lg mb-10 max-w-sm mx-auto font-medium opacity-60">
                    Upload your Goodreads or StoryGraph CSV and watch your shelf come to life in seconds.
                </p>
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                    className="group/btn relative px-12 py-5 bg-white text-black rounded-full font-black text-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50 shadow-xl overflow-hidden"
                >
                    <span className="relative z-10">{processing ? 'Reading File...' : 'Choose CSV File'}</span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="absolute inset-0 z-20 flex items-center justify-center text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {processing ? 'Reading File...' : 'Choose CSV File'}
                    </span>
                </button>
                
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted opacity-40">Supported Legacy Systems</p>
                    <div className="flex gap-12 opacity-30 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Goodreads</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">StoryGraph</span>
                    </div>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{preview.length} Books Found</h3>
                  <p className="text-sm text-muted font-medium opacity-60">Review your collection before importing</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPreview([])}
                    disabled={importing}
                    className="px-6 py-3 rounded-full text-sm font-black border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleImport}
                    disabled={importing}
                    className="px-10 py-3 rounded-full text-sm font-black bg-accent text-white shadow-xl shadow-accent/20 disabled:opacity-50 hover:scale-105 transition-all"
                  >
                    {importing ? `Importing (${progress.current}/${progress.total})` : 'Import to Shelf'}
                  </button>
                </div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-card/100 backdrop-blur-md z-10">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-white/5">
                      <th className="px-8 py-5">Title</th>
                      <th className="px-8 py-5">Author</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {preview.slice(0, 100).map((book, i: number) => (
                      <tr key={i} className="hover:bg-accent/5 transition-colors group">
                        <td className="px-8 py-5 font-bold max-w-[300px] truncate group-hover:text-accent transition-colors">{book.title}</td>
                        <td className="px-8 py-5 text-muted font-medium text-sm">{book.author}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-wider block text-center border border-white/5">
                            {book.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-medium text-accent">
                          {book.rating ? (
                            <div className="flex justify-end gap-0.5">
                                {Array.from({ length: 5 }).map((_, j: number) => (
                                    <span key={j} className={j < Math.round(book.rating!) ? 'text-accent' : 'text-white/10'}>★</span>
                                ))}
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                    {preview.length > 100 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-center text-muted italic font-medium opacity-60">
                          And {preview.length - 100} more books awaiting their new home...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {importing && (
                <div className="bg-accent/10 border border-accent/20 rounded-full p-2 flex items-center overflow-hidden relative">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                        className="absolute inset-0 bg-accent transition-all duration-300"
                    />
                    <div className="relative z-10 w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-white mix-blend-difference">
                        Architecture in progress... {progress.current} of {progress.total}
                    </div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
