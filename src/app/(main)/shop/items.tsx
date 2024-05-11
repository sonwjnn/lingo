'use client'

import { refillHearts } from '@/actions/user-progress'
import { createStripeUrl } from '@/actions/user-subscription'
import { Button } from '@/components/ui/button'
import { POINTS_TO_REFILL } from '@/constants'
import Image from 'next/image'
import { useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
  hearts: number
  points: number
  hasActiveSubscription: boolean
}

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition()

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return
    }

    startTransition(() => {
      refillHearts().catch(() => toast.error('Something went wrong'))
    })
  }

  const onUpgrade = () => {
    startTransition(() => {
      createStripeUrl()
        .then(response => {
          if (response.data) {
            window.location.href = response.data
          }
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  return (
    <ul className="w-full">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4">
        <Image src="/images/heart.svg" alt="Heart" height={60} width={60} />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-4xl">
            Refill hearts
          </p>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
        >
          {hearts === 5 ? (
            'Full'
          ) : (
            <div className="flex">
              <Image
                src="/images/points.svg"
                alt="Points"
                height={20}
                width={20}
              />
              {POINTS_TO_REFILL}
            </div>
          )}
        </Button>
      </div>
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image
          src="/images//unlimited.svg"
          alt="Unlimited"
          height={60}
          width={60}
        />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-4xl">
            Unlimited hearts
          </p>
        </div>
        <Button onClick={onUpgrade} disabled={pending}>
          {hasActiveSubscription ? 'Settings' : 'Upgrade!'}
        </Button>
      </div>
    </ul>
  )
}
