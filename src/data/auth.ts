import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { currentUser } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export const getSelf = async () => {
  try {
    const self = await currentUser()

    if (!self || !self.id) {
      throw new Error('Unauthorized')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, self.id),
    })

    if (!user) {
      throw new Error('Not found')
    }

    return user
  } catch {
    return null
  }
}

export const getSelfByUsername = async (name: string) => {
  try {
    const self = await currentUser()

    if (!self || !self.name) {
      throw new Error('Unauthorized')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.name, name),
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (self.name !== user.name) {
      throw new Error('Unauthorized')
    }

    return user
  } catch {
    return null
  }
}
