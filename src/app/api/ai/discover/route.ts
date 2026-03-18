import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { discoverBooksByMood } from '@/lib/ai/mood-discovery'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mood } = await request.json()

  if (!mood) {
    return NextResponse.json({ error: 'Mood description required' }, { status: 400 })
  }

  try {
    console.log('[API Discovery] Starting for mood:', mood)
    // Clear any potential caches by using fresh discovery
    const results = await discoverBooksByMood(mood)
    console.log('[API Discovery] Results count:', results?.length || 0)
    
    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error) {
    console.error('AI Discovery error:', error)
    return NextResponse.json({ error: 'Failed to discover books' }, { status: 500 })
  }
}
