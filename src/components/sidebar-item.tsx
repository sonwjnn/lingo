'use client'

//since we are using client side routing we need to add this line due to nextjs approuter approach
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  label: string
  iconSrc: string
  href: string
}

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Button
      variant={active ? 'sidebarOutline' : 'sidebar'}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  )
}
