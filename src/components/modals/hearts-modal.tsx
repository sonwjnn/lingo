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

export const HeartsModal = () => {
  const { isOpen, type, close } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'hearts'

  const onClick = () => {
    close()
    router.push('/shop')
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-5 flex w-full items-center justify-center">
            <Image
              src="/images/mascot_bad.svg"
              alt="Defeated mascot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            You ran out of hearts!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Get premium for unlimited hearts, or purchase them in the shop.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex w-full flex-col gap-y-4">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={onClick}
            >
              Get unlimited hearts!
            </Button>
            <Button
              variant="primaryOutline"
              className="w-full"
              size="lg"
              onClick={close}
            >
              No, thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
