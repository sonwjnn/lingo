import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}))

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(), // Unit 1, Unit 2, etc.
  description: text('description').notNull(), //Learn the basics of <language>
  courseId: uuid('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: integer('order').notNull(),
})

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  unitId: uuid('unit_id')
    .references(() => units.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: integer('order').notNull(),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}))

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST'])

export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id')
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}))

export const challengeOptions = pgTable('challenge_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id')
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: text('image_src'),
  audioSrc: text('audio_src'),
})

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
)

export const challengeProgress = pgTable('challenge_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  challengeId: uuid('challenge_id')
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed').notNull().default(false),
})

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
    user: one(users, {
      fields: [challengeProgress.userId],
      references: [users.id],
    }),
  })
)
export const userProgress = pgTable('user_progress', {
  userId: uuid('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/images/mascot.svg'),
  activeCourseId: uuid('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0),
})

//this is a one to many relationship with an active course
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}))

export const userSubscription = pgTable('user_subscription', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
})
