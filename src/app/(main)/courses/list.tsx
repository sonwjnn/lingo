'use client'

import { upsertUserProgress } from '@/actions/user-progress'
import { courses, userProgress } from '@/db/schema'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Card } from './card'

type Props = {
  courses: (typeof courses.$inferSelect)[] //we use $inferSelect to get the type of the select query
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId
}

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onClick = (id: string) => {
    if (pending) return

    if (id === activeCourseId) {
      return router.push('/learn')
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error('Something went wrong.'))
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map(course => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  )
}
