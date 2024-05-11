import { getSelf } from '@/data/auth'
import db from '@/db/drizzle'
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

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

export const getUnits = cache(async () => {
  const self = await getSelf()

  const userProgress = await getUserProgress()

  if (!self || !self.id || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, self.id),
              },
            },
          },
        },
      },
    },
  })

  const normalizedData = data.map(unit => {
    const lessonsWithCompletedStatus = unit.lessons.map(lesson => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false }
      }
      const allCompletedChallenges = lesson.challenges.every(challenge => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every(progress => progress.completed)
        )
      })

      //allCompletedChallenges checks if every challenge in the lesson has a matching completed status in challengeProgress.
      return { ...lesson, completed: allCompletedChallenges }
    })
    return { ...unit, lessons: lessonsWithCompletedStatus }
  })

  return normalizedData
})

export const getCourseProgress = cache(async () => {
  const self = await getSelf()
  const userProgress = await getUserProgress()

  if (!self || !self.id || !userProgress?.activeCourseId) {
    return null
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, self.id),
              },
            },
          },
        },
      },
    },
  })

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap(unit => unit.lessons)
    .find(lesson => {
      //TODO: if somethings does not work, check the last if clause
      return lesson.challenges.some(challenge => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            progress => progress.completed === false
          )
        )
      })
    })

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  }
})

export const getLesson = cache(async (id?: string) => {
  const self = await getSelf()

  if (!self || !self.id) {
    return null
  }

  const courseProgress = await getCourseProgress()

  const lessonId = id || courseProgress?.activeLessonId

  if (!lessonId) {
    return null
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, self.id),
          },
        },
      },
    },
  })

  if (!data || !data.challenges) {
    return null
  }

  const normalizedChallenges = data.challenges.map(challenge => {
    //TODO: if somethings does not work, check the last if clause
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every(progress => progress.completed)

    return { ...challenge, completed }
  })

  return { ...data, challenges: normalizedChallenges }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress()

  if (!courseProgress?.activeLessonId) {
    return 0
  }

  const lesson = await getLesson(courseProgress.activeLessonId)

  if (!lesson) {
    return 0
  }

  const completedChallenges = lesson.challenges.filter(
    challenge => challenge.completed
  )

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  )

  return percentage
})

const DAY_IN_MS = 86_400_000

export const getUserSubscription = cache(async () => {
  const self = await getSelf()

  if (!self || !self.id) {
    return null
  }

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, self.id),
  })

  if (!data) return null

  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return { ...data, isActive: !!isActive }
})

export const getTopTenUsers = cache(async () => {
  const self = await getSelf()

  if (!self || !self.id) {
    return []
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    with: {
      user: true,
    },
  })

  return data
})
