import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { authModalOpened } from "@/features/auth/model/auth-slice"
import { getCourseErrorMessage } from "@/features/courses/model/course-error"
import {
  useCompleteLessonMutation,
  useGetCourseLessonsProgressQuery,
  useLazyGetNextLessonQuery,
} from "@/features/courses/model/course-progress-api"
import { useRouter } from "@/lib/i18n/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"

// Countdown gate + completion is this feature's reconciliation of Figma's
// "tactics answering screen" with what the backend actually models — see
// CLAUDE.md's Education/Courses section and the gap noted in this feature's
// report: lessons only carry a video + duration, no question/answer payload,
// so "answering" is implemented as a watch-gated completion (the Complete
// button unlocks once the lesson's own duration has elapsed) rather than an
// actual right/wrong quiz.
function useLesson(courseId: number, lessonId: number) {
  const t = useTranslations("Courses.lesson.errors")
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [nextLessonLockedOpen, setNextLessonLockedOpen] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [trackedLessonId, setTrackedLessonId] = useState<number | undefined>(undefined)

  const {
    data: progress,
    isLoading,
    isError,
    refetch,
  } = useGetCourseLessonsProgressQuery(courseId, {
    skip: !isAuthenticated || !Number.isFinite(courseId),
  })
  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation()
  const [fetchNextLesson, { isFetching: isLoadingNext }] = useLazyGetNextLessonQuery()

  const lesson = progress?.sections
    .flatMap((section) => section.lessons)
    .find((row) => row.id === lessonId)

  useEffect(() => {
    if (!isAuthenticated) dispatch(authModalOpened("sign-in"))
  }, [isAuthenticated, dispatch])

  const countdownActive = !!lesson && !lesson.completed && !lesson.locked

  // Reset the countdown when the lesson identity changes, following React's
  // "adjusting state when a prop changes" pattern: a conditional setState
  // during render (not in an effect) so the reset takes effect before paint,
  // instead of ticking down from a stale value for one frame.
  if (countdownActive && lesson && lesson.id !== trackedLessonId) {
    setTrackedLessonId(lesson.id)
    setRemaining(lesson.duration)
  } else if (!countdownActive && trackedLessonId !== undefined) {
    setTrackedLessonId(undefined)
  }

  useEffect(() => {
    if (!countdownActive) return
    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdownActive, lesson?.id])

  const effectiveCountdown = countdownActive ? remaining : 0

  async function goToNextLesson() {
    const result = await fetchNextLesson(lessonId).unwrap()
    if (!result.hasNext) {
      router.push(`/courses/${courseId}/certificate`)
      return
    }
    if (result.locked) {
      setNextLessonLockedOpen(true)
      return
    }
    router.push(`/courses/${courseId}/lessons/${result.lessonId}`)
  }

  async function handleComplete() {
    setErrorMessage(null)
    try {
      await completeLesson(lessonId).unwrap()
      await goToNextLesson()
    } catch (error) {
      setErrorMessage(getCourseErrorMessage(error, t("generic")))
    }
  }

  async function handleContinue() {
    setErrorMessage(null)
    try {
      await goToNextLesson()
    } catch (error) {
      setErrorMessage(getCourseErrorMessage(error, t("generic")))
    }
  }

  return {
    lesson,
    isLoading: isLoading && isAuthenticated,
    isError,
    refetch,
    isAuthenticated,
    countdown: effectiveCountdown,
    canComplete: effectiveCountdown <= 0,
    onComplete: handleComplete,
    onContinue: handleContinue,
    isSubmitting: isCompleting || isLoadingNext,
    errorMessage,
    nextLessonLockedOpen,
    onNextLessonLockedOpenChange: setNextLessonLockedOpen,
  }
}

export { useLesson }
