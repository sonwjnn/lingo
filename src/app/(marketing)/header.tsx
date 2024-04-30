import { LoginButton } from '@/components/auth/login-button'
import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import Image from 'next/image'

interface HeaderProps {}

export const Header = async ({}: HeaderProps) => {
  const user = await currentUser()

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="mx-auto flex h-full items-center justify-between  lg:max-w-screen-lg">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/images/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Lingo
          </h1>
        </div>
        <div className="flex items-center gap-x-3 pb-7 pr-4 pt-8">
          {user ? (
            <UserButton />
          ) : (
            <LoginButton mode="modal" asChild>
              <Button size="lg" variant="ghost">
                Log in
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </header>
  )
}
