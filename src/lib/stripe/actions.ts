'use server'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(priceId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('placeholder')) {
    throw new Error('STRIPE_SECRET_KEY is not configured on the server.')
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27' as any,
  })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (priceId.includes('placeholder')) {
    throw new Error('This price ID is a placeholder. Please add the real Price ID from Stripe Dashboard to your .env file.')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: user.id,
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shelf?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session URL')
    }

    redirect(session.url)
  } catch (error: any) {
    console.error('Stripe error:', error)
    if (error.message.includes('No such price')) {
       throw new Error(`The Price ID "${priceId}" does not exist in your Stripe account. Make sure you are using Test Mode IDs.`)
    }
    throw new Error(`Stripe Error: ${error.message}`)
  }
}
