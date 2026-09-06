import {
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
} from "@/features/courses/model/course-catalog-api"
import {
  useGetCourseByIdQuery,
  useGetPurchasedCoursesQuery,
} from "@/features/courses/model/course-detail-api"
import { useGetCourseLessonsProgressQuery } from "@/features/courses/model/course-progress-api"
import { useAppSelector } from "@/lib/store/hooks"

interface DetailLessonRow {
  id: number
  title: string
  duration: number
  order: number
  isFree: boolean
  // Both derived: from the progress-aware endpoint when signed in, or a
  // naive `!isFree && !isPurchased` guess (matching the backend's own
  // `locked` formula in get-course-lessons.handler.ts) when signed out —
  // see the merge logic below.
  locked: boolean
  completed: boolean
}

interface DetailSectionRow {
  id: number
  title: string
  order: number
  lessons: DetailLessonRow[]
}

function useCourseDetail(courseId: number) {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
    refetch: refetchCourse,
  } = useGetCourseByIdQuery(courseId, { skip: !Number.isFinite(courseId) })

  // Both skipped when signed out — GET /courses/purchased and
  // GET /courses/{id}/lessons are authenticated endpoints (see
  // course-detail-api.ts/course-progress-api.ts); an anonymous visitor is
  // never "purchased" and gets the naive locked-state fallback below instead.
  const { data: purchasedCourses, refetch: refetchPurchasedCourses } = useGetPurchasedCoursesQuery(
    undefined,
    { skip: !isAuthenticated }
  )
  const { data: progress } = useGetCourseLessonsProgressQuery(courseId, {
    skip: !isAuthenticated || !Number.isFinite(courseId),
  })
  // Category/difficulty are only ever admin-managed lookup lists (small),
  // reused as-is from the catalog's own endpoints rather than duplicated —
  // both live in this same feature's model layer, so no code-splitting
  // boundary is crossed.
  const { data: categories } = useGetCourseCategoriesQuery()
  const { data: difficulties } = useGetCourseDifficultiesQuery()

  const isPurchased = purchasedCourses?.some((purchase) => purchase.id === courseId) ?? false
  const category = categories?.find((item) => item.id === course?.categoryId)
  const difficulty = difficulties?.find((item) => item.id === course?.difficultyId)

  const progressByLessonId = new Map(
    progress?.sections.flatMap((section) => section.lessons.map((lesson) => [lesson.id, lesson])) ??
      []
  )

  const sections: DetailSectionRow[] =
    course?.sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons.map((lesson) => {
        const progressRow = progressByLessonId.get(lesson.id)
        return {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          isFree: lesson.isFree,
          locked: progressRow ? progressRow.locked : !lesson.isFree && !isPurchased,
          completed: progressRow?.completed ?? false,
        }
      }),
    })) ?? []

  const allLessons = sections.flatMap((section) => section.lessons)
  const isCompleted =
    isAuthenticated && !!progress && allLessons.length > 0 && allLessons.every((l) => l.completed)

  return {
    course,
    category,
    difficulty,
    sections,
    isLoading: isCourseLoading,
    isError: isCourseError,
    refetch: refetchCourse,
    isAuthenticated,
    isPurchased,
    isCompleted,
    refetchPurchasedCourses,
  }
}

export { useCourseDetail }
export type { DetailLessonRow, DetailSectionRow }
