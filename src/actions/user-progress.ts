'use server'

import { POINTS_TO_REFILL } from '@/constants'
import db from '@/db/drizzle'
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from '@/db/queries'
import { challengeProgress, challenges, userProgress } from '@/db/schema'
import { currentUser } from '@/lib/auth'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const upsertUserProgress = async (courseId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new Error('Unauthorized')
  }

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error('Course is empty')
  }

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
    })

    revalidatePath('/courses')
    revalidatePath('/learn')
    redirect('/learn')
  }

  await db.insert(userProgress).values({
    userId: user.id,
    activeCourseId: courseId,
  })

  revalidatePath('/courses')
  revalidatePath('/learn')
  redirect('/learn')
}

export const reduceHearts = async (challengeId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new Error('Unauthorized')
  }

  const currentUserProgress = await getUserProgress()
  const userSubscription = await getUserSubscription()

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  })

  if (!challenge) {
    throw new Error('Challenge not found')
  }

  const lessonId = challenge.lessonId

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, user.id),
      eq(challengeProgress.challengeId, challengeId)
    ),
  })

  const isPractice = !!existingChallengeProgress

  if (isPractice) {
    return { error: 'Already practiced' }
  }

  if (!currentUserProgress) {
    throw new Error('User progress not found')
  }

  if (userSubscription?.isActive) {
    return { error: 'Subscription' }
  }

  if (currentUserProgress.hearts === 0) {
    return { error: 'No hearts left' }
  }

  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, user.id))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
  revalidatePath(`/lesson/${lessonId}`)
}

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress()

  if (!currentUserProgress) {
    throw new Error('User progress not found')
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error('Hearts already full')
  }

  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error('Not enough points')
  }

  await db
    .update(userProgress)
    .set({
      hearts: 5,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
}
