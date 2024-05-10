'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/store/use-modal-store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const ExitModal = () => {
  const { isOpen, type, close } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'exit'

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-5 flex w-full items-center justify-center">
            <Image
              src="/images/mascot_sad.svg"
              alt="Sad mascot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Please, don&apos;t go!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You&apos;re about to leave the lesson. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex w-full flex-col gap-y-4">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={close}
            >
              Keep learning!
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                close()
                router.push('/learn')
              }}
            >
              End lesson
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
