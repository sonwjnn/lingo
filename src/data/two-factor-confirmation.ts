import db from '@/db/drizzle'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({
    where: { userId },
  })
  return twoFactorConfirmation
}
