import * as schema from '@/db/schema'
import { neon } from '@neondatabase/serverless'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { v4 as uuidv4 } from 'uuid'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding database...')

    await db.delete(schema.courses)
    await db.delete(schema.userProgress)
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)
    await db.delete(schema.userSubscription)

    const coursesIds = Array.from({ length: 5 }, () => uuidv4())

    await db.insert(schema.courses).values([
      {
        id: coursesIds[0],
        title: 'Spanish',
        imageSrc: '/images/es.svg',
      },
      {
        id: coursesIds[1],
        title: 'Arabic',
        imageSrc: '/ar.svg',
      },
      {
        id: coursesIds[2],
        title: 'English',
        imageSrc: '/en.svg',
      },
      {
        id: coursesIds[3],
        title: 'German',
        imageSrc: '/de.svg',
      },
      {
        id: coursesIds[4],
        title: 'Italian',
        imageSrc: '/it.svg',
      },
    ])

    const unit1Id = uuidv4()

    await db.insert(schema.units).values([
      {
        id: unit1Id,
        courseId: coursesIds[0], // Spanish
        title: 'Unit 1',
        description: 'Learn the basics of Spanish',
        order: 1,
      },
    ])

    const lessonsIds = Array.from({ length: 5 }, () => uuidv4())

    await db.insert(schema.lessons).values([
      {
        id: lessonsIds[0],
        unitId: unit1Id, // Unit 1 (Learn the basics of...)
        title: 'Nouns',
        order: 1,
      },
      {
        id: lessonsIds[1],
        unitId: unit1Id, // Unit 1 (Learn the basics of...)
        title: 'Verbs',
        order: 2,
      },
      {
        id: lessonsIds[2],
        unitId: unit1Id, // Unit 1 (Learn the basics of...)
        title: 'Nouns',
        order: 3,
      },
      {
        id: lessonsIds[3],
        unitId: unit1Id, // Unit 1 (Learn the basics of...)
        title: 'Verbs',
        order: 4,
      },
      {
        id: lessonsIds[4],
        unitId: unit1Id, // Unit 1 (Learn the basics of...)
        title: 'Nouns',
        order: 5,
      },
    ])

    const challengeIds = Array.from({ length: 6 }, () => uuidv4())

    await db.insert(schema.challenges).values([
      {
        id: challengeIds[0],
        lessonId: lessonsIds[0], // Nouns
        type: 'SELECT',
        order: 1,
        question: 'Which one of these is Spanish for "the dog"?',
      },
      {
        id: challengeIds[1],
        lessonId: lessonsIds[0], // Nouns
        type: 'ASSIST',
        order: 2,
        question: '"the dog" in Spanish is...',
      },
      {
        id: challengeIds[2],
        lessonId: lessonsIds[0], // Nouns
        type: 'SELECT',
        order: 3,
        question: 'Which one of these in Spanish is "the chicken"?',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challengeIds[0], // Which one of these is the Spanish for "the dog"?
        imageSrc: '/images/dog.svg',
        correct: true,
        text: 'El perro',
        audioSrc: '/sounds/es_dog.mp3',
      },
      {
        challengeId: challengeIds[1], // Which one of these is the Spanish for "the dog"?
        imageSrc: '/images/chicken.svg',
        correct: false,
        text: 'El pollo',
        audioSrc: '/sounds/es_chicken.mp3',
      },
      {
        challengeId: challengeIds[2], // Which one of these is the Spanish for "the dog"?
        imageSrc: '/images/goat.svg',
        correct: false,
        text: 'El cabra',
        audioSrc: '/sounds/es_goat.mp3',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challengeIds[1], // "the dog" in Spanish is...
        correct: true,
        text: 'El perro',
        audioSrc: '/sounds/es_dog.mp3',
      },
      {
        challengeId: challengeIds[1], // "the dog" in Spanish is...
        correct: false,
        text: 'El pollo',
        audioSrc: '/sounds/es_chicken.mp3',
      },
      {
        challengeId: challengeIds[1], // "the dog" in Spanish is...
        correct: false,
        text: 'El cabra',
        audioSrc: '/sounds/es_goat.mp3',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challengeIds[2], // Which one of these is Spanish for "the chicken"?
        imageSrc: '/images/dog.svg',
        correct: false,
        text: 'El perro',
        audioSrc: '/sounds/es_dog.mp3',
      },
      {
        challengeId: challengeIds[2], // Which one of these is Spanish for "the chicken"?
        imageSrc: '/images/chicken.svg',
        correct: true,
        text: 'El pollo',
        audioSrc: '/sounds/es_chicken.mp3',
      },
      {
        challengeId: challengeIds[2], // Which one of these is Spanish for "the dog"?
        imageSrc: '/images/goat.svg',
        correct: false,
        text: 'El cabra',
        audioSrc: '/sounds/es_goat.mp3',
      },
    ])

    await db.insert(schema.challenges).values([
      {
        id: challengeIds[3],
        lessonId: lessonsIds[1], // Verbs
        type: 'SELECT',
        order: 1,
        question: 'Which one of these is Spanish for "the dog"?',
      },
      {
        id: challengeIds[4],
        lessonId: lessonsIds[1], // Verbs
        type: 'ASSIST',
        order: 2,
        question: '"the dog" in Spanish is...',
      },
      {
        id: challengeIds[5],
        lessonId: lessonsIds[1], // Verbs
        type: 'SELECT',
        order: 3,
        question: 'Which one of these in Spanish is "the chicken"?',
      },
    ])

    console.log('Seeding completed successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()
