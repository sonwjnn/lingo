import { Button } from '@/components/ui/button'
import React from 'react'

const ButtonPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <Button>default</Button>
      <Button variant="primary">primary</Button>
      <Button variant="primaryOutline">primary outline</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="secondaryOutline">secondary outline</Button>
      <Button variant="danger">danger</Button>
      <Button variant="dangerOutline">danger outline</Button>
      <Button variant="super">super</Button>
      <Button variant="superOutline">super outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="sidebar">sidebar</Button>
      <Button variant="sidebarOutline">sidebar outline</Button>
    </div>
  )
}

export default ButtonPage
