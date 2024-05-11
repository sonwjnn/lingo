'use server'

import { getUserSubscription } from '@/db/queries'
import { currentUser } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

const returnUrl = absoluteUrl('/shop') //TODO: when we deploy => https://my-dummy-website.com

export const createStripeUrl = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new Error('Unauthorized')
  }
  const userSubscription = await getUserSubscription()

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    })

    return { data: stripeSession.url }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.email as string,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Lingo Pro',
            description: 'Unlimited Hearts',
          },
          unit_amount: 2000, //equalivent to $20USD
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  })

  return { data: stripeSession.url }
}
