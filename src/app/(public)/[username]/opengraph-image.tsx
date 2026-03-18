import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export const alt = 'Reedr Public Profile'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  
  const supabase = await createClient()
  
  // Fetch user profile
  const { data: user } = await supabase
    .from('users')
    .select('id, username, display_name, profile_photo_url, bio')
    .eq('username', username)
    .single()

  if (!user) {
    return new ImageResponse(
      (
        <div 
          style={{ 
            background: '#0a0a0a', 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white',
            fontFamily: 'sans-serif'
          }}
        >
          <div style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '20px', color: '#3b82f6' }}>Reedr</div>
          <div style={{ fontSize: '30px', opacity: 0.6 }}>User not found</div>
        </div>
      ),
      { ...size }
    )
  }

  // Fetch their primary shelf
  const { data: shelf } = await supabase
    .from('shelves')
    .select('id, theme')
    .eq('user_id', user.id)
    .eq('is_public', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single()

  // Fetch books for that shelf
  const { data: userBooks } = await supabase
    .from('user_books')
    .select('works(canonical_title, canonical_author, primary_cover_url)')
    .eq('shelf_id', shelf?.id)
    .limit(5)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: '400px',
          height: '400px',
          borderRadius: '200px',
          background: 'rgba(59, 130, 246, 0.1)',
          filter: 'blur(100px)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: '400px',
          height: '400px',
          borderRadius: '200px',
          background: 'rgba(168, 85, 247, 0.1)',
          filter: 'blur(100px)',
        }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '60px 80px',
            borderRadius: '48px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            {user.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '32px',
                  marginRight: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '32px',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  marginRight: '24px',
                }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
                @{user.username}
              </div>
              <div style={{ fontSize: '24px', color: '#94a3b8', marginTop: '4px' }}>
                {user.display_name || 'Curator'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {userBooks && userBooks.length > 0 ? (
               userBooks.map((book: any, i: number) => (
                <div
                  key={i}
                  style={{
                    width: '140px',
                    height: '210px',
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {book.works?.primary_cover_url ? (
                    <img
                      src={book.works.primary_cover_url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ 
                      padding: '16px', 
                      fontSize: '14px', 
                      textAlign: 'center', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      lineHeight: '1.2'
                    }}>
                      {book.works?.canonical_title}
                    </div>
                  )}
                </div>
              ))
            ) : (
                <div style={{ height: '210px', display: 'flex', alignItems: 'center', color: '#475569', fontSize: '20px', fontStyle: 'italic' }}>
                    Awaiting curation...
                </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 900, 
            letterSpacing: '0.4em', 
            color: '#3b82f6',
            textTransform: 'uppercase'
          }}>
            Reedr Boutique
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
