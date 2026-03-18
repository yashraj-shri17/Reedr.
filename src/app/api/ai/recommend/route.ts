import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPassiveRecommendations } from '@/lib/ai/recommendations'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Check cache in database (PRD section 6 - ai_recommendations_cache)
    const { data: cached } = await supabase
      .from('ai_recommendations_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('recommendation_type', 'passive')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (cached) {
      return NextResponse.json(cached.recommended_books)
    }

    // 2. Fetch user's books to understand their taste
    const { data: userBooks } = await supabase
        .from('user_books')
        .select('*, works(*)')
        .eq('user_id', user.id)

    if (!userBooks || userBooks.length === 0) {
        return NextResponse.json({ message: 'Add some books to your shelf first!' })
    }

    // 3. Call Claude via lib/ai/recommendations
    const recommendations = await getPassiveRecommendations(userBooks)

    // 4. Cache the result
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 day cache

    await supabase.from('ai_recommendations_cache').upsert({
      user_id: user.id,
      recommendation_type: 'passive',
      recommended_books: recommendations,
      expires_at: expiresAt.toISOString()
    })

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('AI Recommendations error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}
