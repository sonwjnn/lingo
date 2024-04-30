import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import { UserButton } from './auth/user-button'
import { SidebarItem } from './sidebar-item'

type Props = {
  className?: string
}

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        'left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]',
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/images/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" href="/learn" iconSrc="/images/learn.svg" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/images/leaderboard.svg"
        />
        <SidebarItem
          label="Quests"
          href="/quests"
          iconSrc="/images/quests.svg"
        />
        <SidebarItem label="Shop" href="/shop" iconSrc="/images/shop.svg" />
      </div>
      <div className="p-4">
        <UserButton />
      </div>
    </div>
  )
}
