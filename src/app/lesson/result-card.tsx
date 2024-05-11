import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  value: number
  variant: 'points' | 'hearts'
}

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc =
    variant === 'hearts' ? '/images/heart.svg' : '/images/points.svg'
  return (
    <div
      className={cn(
        'w-full rounded-2xl border-2',
        variant === 'points' && 'border-orange-400 bg-orange-400',
        variant === 'hearts' && 'border-rose-400 bg-rose-400'
      )}
    >
      <div
        className={cn(
          'rounded-t-xl p-1.5 text-center text-xs font-bold uppercase text-white',
          variant === 'hearts' && 'bg-rose-500',
          variant === 'points' && 'bg-orange-500'
        )}
      >
        {variant === 'hearts' ? 'Hearts Left' : 'Total XP'}
      </div>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-white p-6 text-lg font-bold',
          variant === 'points' && 'text-orange-400',
          variant === 'hearts' && 'text-rose-400'
        )}
      >
        <Image
          alt="icon"
          src={imageSrc}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value}
      </div>
    </div>
  )
}
