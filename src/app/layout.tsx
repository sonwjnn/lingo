import { auth } from '@/auth'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Nunito } from 'next/font/google'

import './globals.css'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'lingo',
  description: 'lingo use nextjs',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
