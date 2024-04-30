'use client'

import { RegisterForm } from '@/components/auth/register-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface RegisterButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export const RegisterButton = ({
  children,
  mode = 'redirect',
  asChild,
}: RegisterButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/register')
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-transparent p-0">
          <RegisterForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
