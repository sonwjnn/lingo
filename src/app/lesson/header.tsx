//the reason we are not using "use client" here is because quiz.tsx is already
//using it, which means that header.tsx is also using it, since it is a child of quiz.tsx
//and we are not going to reuse this component in any other place
import { Progress } from '@/components/ui/progress'
import { useModal } from '@/store/use-modal-store'
import { InfinityIcon, X } from 'lucide-react'
import Image from 'next/image'

type Props = {
  hearts: number
  percentage: number
  hasActiveSubscription: boolean
}

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: Props) => {
  const { open } = useModal()
  return (
    <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
      <X
        onClick={() => open('exit')}
        className="cursor-pointer text-slate-500 transition hover:opacity-75"
      />
      <Progress value={percentage} />
      <div className="text-center font-bold text-rose-500">
        <Image
          src="/images/heart.svg"
          width={28}
          height={28}
          alt="heart"
          className="mr-2"
        />
        {hasActiveSubscription ? (
          <InfinityIcon className="h-6 w-6 shrink-0 stroke-[3]" />
        ) : (
          hearts
        )}
      </div>
    </header>
  )
}
