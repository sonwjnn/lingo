import { getSelf } from '@/data/auth'
import db from '@/db/drizzle'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

import { courses, userProgress } from './schema'

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()
  return data
})

export const getUserProgress = cache(async () => {
  const self = await getSelf()

  if (!self || !self.id) {
    return null
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, self.id),
    with: {
      activeCourse: true,
    },
  })

  return data
})

export const getCourseById = cache(async (courseId: string) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  })

  return data
})
