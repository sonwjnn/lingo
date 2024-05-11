'use client'

import { upsertChallengeProgress } from '@/actions/challenge-progress'
import { reduceHearts } from '@/actions/user-progress'
import { challengeOptions, challenges, userSubscription } from '@/db/schema'
import { useModal } from '@/store/use-modal-store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Confetti from 'react-confetti'
import { useAudio, useMount, useWindowSize } from 'react-use'
import { toast } from 'sonner'

import { Challenge } from './challenge'
import { Footer } from './footer'
import { Header } from './header'
import { QuestionBubble } from './question-bubble'
import { ResultCard } from './result-card'

type Props = {
  initialPercentage: number
  initialHearts: number
  initialLessonId: string
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean
      })
    | null
}

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open } = useModal()

  useMount(() => {
    if (initialPercentage === 100) {
      open('practice')
    }
  })

  const { width, height } = useWindowSize()
  const router = useRouter()
  const [finishAudio] = useAudio({ src: '/sounds/finish.mp3', autoPlay: true })
  const [correctAudio, _c, correctControls] = useAudio({
    src: '/sounds/correct.wav',
  })
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: '/sounds/incorrect.wav',
  })

  const [isPending, startTransition] = useTransition()
  const [lessonId] = useState(initialLessonId)
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })
  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      challenge => !challenge.completed
    )
    // If all challenges are completed, start from the beginning
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const [selectedOption, setSelectedOption] = useState<string>()
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none')
  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []
  const onNext = () => {
    setActiveIndex(current => current + 1)
  }

  const onSelect = (id: string) => {
    if (status !== 'none') return

    setSelectedOption(id)
  }

  const onContinue = () => {
    if (!selectedOption) return

    if (status === 'wrong') {
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    if (status === 'correct') {
      onNext()
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    const correctOption = options.find(option => option.correct)
    if (!correctOption) {
      return
    }
    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then(response => {
            if (response?.error === 'No hearts left') {
              open('hearts')
              return
            }

            correctControls.play()
            setStatus('correct')
            setPercentage(prev => prev + 100 / challenges.length)
            //this is a practice
            if (initialPercentage === 100) {
              setHearts(prev => Math.min(prev + 1, 5))
            }
          })
          .catch(() => toast.error('Something went wrong. Please try again'))
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then(response => {
            if (response?.error === 'No hearts left') {
              open('hearts')
              return
            }

            incorrectControls.play()
            setStatus('wrong')

            if (!response?.error) {
              setHearts(prev => Math.max(prev - 1, 0))
            }
          })
          .catch(() => toast.error('Something went wrong. Please try again'))
      })
    }
  }
  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/images/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />
          <h1 className="text-xl font-bold  text-neutral-700 lg:text-3xl">
            Great job! <br /> You&apos;ve completed this lesson.
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push('/learn')}
        />
      </>
    )
  }

  const title =
    challenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : challenge.question

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>
            <div>
              {challenge.type === 'ASSIST' && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={isPending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  )
}
