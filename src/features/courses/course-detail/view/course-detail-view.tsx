"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { authModalOpened } from "@/features/auth/model/auth-slice"
import { CourseDetailContent } from "@/features/courses/course-detail/view/course-detail-content"
import { CourseDetailError } from "@/features/courses/course-detail/view/course-detail-error"
import { CourseDetailHeader } from "@/features/courses/course-detail/view/course-detail-header"
import { CourseDetailNotFound } from "@/features/courses/course-detail/view/course-detail-not-found"
import { CourseDetailPricePanel } from "@/features/courses/course-detail/view/course-detail-price-panel"
import { CourseDetailSkeleton } from "@/features/courses/course-detail/view/course-detail-skeleton"
import { useCourseDetail } from "@/features/courses/course-detail/viewmodel/use-course-detail"
import { useAppDispatch } from "@/lib/store/hooks"

// The purchase Dialog (react-hook-form + zod + the mutation) is loaded via
// next/dynamic (ssr:false) and only mounted while open — see
// purchase-modal.tsx — so its JS isn't part of this page's initial bundle.
// The "Buy course" trigger button itself lives in course-detail-price-panel.tsx,
// stays directly in this always-loaded view tree, per CLAUDE.md's "don't
// next/dynamic small, always-visible UI" guidance.
const PurchaseModal = dynamic(
  () => import("@/features/courses/course-detail/view/purchase-modal").then((mod) => mod.PurchaseModal),
  { ssr: false }
)

interface CourseDetailViewProps {
  courseId: number
}

function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const dispatch = useAppDispatch()
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const {
    course,
    category,
    difficulty,
    sections,
    isLoading,
    isError,
    refetch,
    isAuthenticated,
    isPurchased,
    isCompleted,
    refetchPurchasedCourses,
  } = useCourseDetail(courseId)

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (isError) {
    return <CourseDetailError onRetry={refetch} />
  }

  if (!course) {
    return <CourseDetailNotFound />
  }

  const allLessons = sections.flatMap((section) => section.lessons)
  const continueLessonId =
    allLessons.find((lesson) => !lesson.completed && !lesson.locked)?.id ?? allLessons[0]?.id

  function handleBuyClick() {
    if (!isAuthenticated) {
      dispatch(authModalOpened("sign-in"))
      return
    }
    setPurchaseOpen(true)
  }

  const isFree = course.price === 0

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      {/* A plain 2-item grid (main column + aside) would put the price/buy
          box last in DOM order, which is fine at `lg` (it's a separate short
          column next to the image) but disastrous on mobile: the grid
          collapses to one column and stacks children in DOM order, so the
          price/CTA would land below the entire lesson list AND the full
          reviews list — a user would have to scroll past everything to see
          the price or buy button. Splitting the main column into a "header"
          (image/badges/title/description) and "content" (sections/reviews)
          piece and placing the price panel between them via explicit grid
          placement fixes this: at `lg` the explicit column/row start values
          reproduce the exact desktop layout (aside beside the header block),
          while on mobile — where none of the `lg:` placement classes apply —
          plain DOM order takes over and stacks them header, panel, content,
          so pricing/CTA sits right after the description instead of at the
          very end of the page. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <CourseDetailHeader course={course} category={category} difficulty={difficulty} isPurchased={isPurchased} />

        <CourseDetailPricePanel
          course={course}
          isPurchased={isPurchased}
          isFree={isFree}
          continueLessonId={continueLessonId}
          onBuyClick={handleBuyClick}
        />

        <CourseDetailContent course={course} sections={sections} isCompleted={isCompleted} />
      </div>

      {purchaseOpen && (
        <PurchaseModal
          courseId={course.id}
          open={purchaseOpen}
          onOpenChange={setPurchaseOpen}
          onPurchased={refetchPurchasedCourses}
        />
      )}
    </div>
  )
}

export { CourseDetailView }
