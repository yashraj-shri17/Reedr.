import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Idempotency check (PRD 16.4)
  const { data: existingEvent } = await supabaseAdmin
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single()

  if (existingEvent) {
    return NextResponse.json({ received: true, message: 'Already processed' })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutSession(session)
      break
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(subscription)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Record event (idempotency)
  await supabaseAdmin.from('stripe_webhook_events').insert({
    id: event.id,
    event_type: event.type
  })

  return NextResponse.json({ received: true })
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id
    if (!userId) return

    await supabaseAdmin
        .from('users')
        .update({ 
            subscription_tier: 'plus',
            stripe_customer_id: session.customer as string
        })
        .eq('id', userId)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    
    await supabaseAdmin
        .from('users')
        .update({ subscription_tier: 'free' })
        .eq('stripe_customer_id', customerId)
}
