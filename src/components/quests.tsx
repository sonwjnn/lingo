import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { quests } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  points: number
}

export const Quests = ({ points }: Props) => {
  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div className="flex w-full  items-center justify-between space-y-2">
        <h3 className="text-lg font-bold">Quests</h3>
        <Button size="sm" variant="primaryOutline">
          <Link href="/quests">View all</Link>
        </Button>
      </div>
      <ul className="w-full space-y-4">
        {quests.map(quest => {
          const progress = (points / quest.value) * 100

          return (
            <div
              className="flex w-full  items-center gap-x-3 pb-4"
              key={quest.title}
            >
              <Image
                src="/images/points.svg"
                alt="Points"
                height={40}
                width={40}
              />
              <div className="flex w-full flex-col gap-y-2">
                <p className="text-xl font-bold text-neutral-700">
                  {quest.title}
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  )
}
