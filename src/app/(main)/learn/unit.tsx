import { lessons, units } from '@/db/schema'

import { LessonButton } from './lesson-button'
import { UnitBanner } from './unit-banner'

type Props = {
  id: string
  order: number
  title: string
  description: string
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean
  })[]
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect
      })
    | undefined
  activeLessonPercentage: number
}

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="relative flex flex-col items-center">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id
          const isLocked = !lesson.completed && !isCurrent

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          )
        })}
      </div>
    </>
  )
}
