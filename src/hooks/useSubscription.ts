import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export function useSubscription() {
  const [tier, setTier] = useState<'free' | 'plus'>('free')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getSubscription() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setTier(data.subscription_tier as 'free' | 'plus')
        }
      }
      setLoading(false)
    }

    getSubscription()
  }, [])

  return {
    tier,
    isPlus: tier === 'plus',
    loading
  }
}
