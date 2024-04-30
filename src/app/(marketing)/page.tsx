import { LoginButton } from '@/components/auth/login-button'
import { RegisterButton } from '@/components/auth/register-button'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MarketingPage = async () => {
  const user = await currentUser()

  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row ">
      <div className="relative mb-8 h-[240px] w-[240px] lg:mb-0 lg:h-[424px] lg:w-[424px]">
        <Image src="/images/hero.svg" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
          Learn, practice, and master new languages with Lingo.
        </h1>
        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          {user ? (
            <Button size="lg" variant="secondary" className="w-full" asChild>
              <Link href="/learn">Continue Learning</Link>
            </Button>
          ) : (
            <>
              <RegisterButton mode="modal" asChild>
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </RegisterButton>
              <LoginButton mode="modal" asChild>
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account.
                </Button>
              </LoginButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketingPage
