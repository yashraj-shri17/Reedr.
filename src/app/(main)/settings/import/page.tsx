import CSVImporter from '@/components/import/CSVImporter'

export default function ImportPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 min-h-screen">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight">Import Library</h1>
        <p className="text-muted text-xl font-medium opacity-60">Easily migrate your data to your new digital gallery.</p>
      </header>

      <CSVImporter />

      <div className="mt-24 grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-accent">Export from Goodreads</h3>
          <p className="text-sm text-muted leading-relaxed font-medium">
            1. Log in to Goodreads on desktop<br/>
            2. Go to <span className="text-white">My Books</span> in the top nav<br/>
            3. Click <span className="text-white">Import and Export</span> in the sidebar<br/>
            4. Select <span className="text-white">Export Library</span> and download the CSV.
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-accent">Export from StoryGraph</h3>
          <p className="text-sm text-muted leading-relaxed font-medium">
            1. Open StoryGraph and go to <span className="text-white">Settings</span><br/>
            2. Scroll to <span className="text-white">Export Data</span><br/>
            3. Click <span className="text-white">Download Export</span><br/>
            4. You'll receive a .csv file ready for upload.
          </p>
        </div>
      </div>
    </div>
  )
}
