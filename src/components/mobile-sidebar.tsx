import { Sidebar } from '@/components/sidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="z-[100] p-0" side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
