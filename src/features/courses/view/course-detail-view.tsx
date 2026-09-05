"use client"

import { StarIcon } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { CourseReviewsSection } from "@/features/courses/view/course-reviews-section"
import { CourseSectionsList } from "@/features/courses/view/course-sections-list"
import { useCourseDetail } from "@/features/courses/viewmodel/use-course-detail"
import { Link } from "@/lib/i18n/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { formatPrice } from "@/lib/utils"

// The purchase Dialog (react-hook-form + zod + the mutation) is loaded via
// next/dynamic (ssr:false) and only mounted while open — see
// purchase-modal.tsx — so its JS isn't part of this page's initial bundle.
// The "Buy course" trigger button below stays directly in this
// always-loaded view, per CLAUDE.md's "don't next/dynamic small,
// always-visible UI" guidance.
const PurchaseModal = dynamic(
  () => import("@/features/courses/view/purchase-modal").then((mod) => mod.PurchaseModal),
  { ssr: false }
)

interface CourseDetailViewProps {
  courseId: number
}

function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const t = useTranslations("Courses.detail")
  const tCourses = useTranslations("Courses")
  const dispatch = useAppDispatch()
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const {
    course,
    category,
    difficulty,
    sections,
    isLoading,
    isError,
    isAuthenticated,
    isPurchased,
    isCompleted,
    refetchPurchasedCourses,
  } = useCourseDetail(courseId)

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (isError || !course) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {tCourses("notFound")}
        </div>
      </div>
    )
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-dark-2">
            <Image src={course.cover} alt={course.title} fill className="object-cover" priority />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {category && <Badge variant="secondary">{category.title}</Badge>}
            {difficulty && (
              <Badge variant="secondary" className="gap-1.5">
                <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
                {difficulty.degree}
              </Badge>
            )}
            {isPurchased && <Badge>{t("purchasedBadge")}</Badge>}
          </div>

          <h1 className="text-2xl font-medium text-brand-white">{course.title}</h1>

          <div className="flex items-center gap-1 text-sm text-brand-secondary-low">
            <StarIcon className="size-4 fill-brand-yellow text-brand-yellow" />
            {course.averageRating.toFixed(1)} ({course.ratingsCount})
          </div>

          <p className="text-sm whitespace-pre-line text-brand-secondary-low">
            {course.description}
          </p>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-brand-white">{t("sectionsTitle")}</h2>
            <p className="text-sm text-brand-secondary-low">
              {t("sectionsSummary", {
                sections: course.sectionsCount,
                lessons: course.lessonsCount,
              })}
            </p>
            <CourseSectionsList courseId={course.id} sections={sections} />
          </div>

          <CourseReviewsSection courseId={course.id} canReview={isCompleted} />
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
          <div className="flex items-center gap-2">
            {course.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-brand-white">
                  {formatPrice(course.discountPrice)}
                </span>
                <span className="text-sm text-brand-secondary-low line-through">
                  {formatPrice(course.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-brand-white">
                {formatPrice(course.price)}
              </span>
            )}
          </div>

          {isPurchased || isFree ? (
            <Button
              render={<Link href={`/courses/${course.id}/lessons/${continueLessonId}`} />}
              nativeButton={false}
              disabled={!continueLessonId}
            >
              {t("continueCta")}
            </Button>
          ) : (
            <Button onClick={handleBuyClick}>{t("buyCta")}</Button>
          )}
        </aside>
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

function CourseDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full rounded" />
            ))}
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  )
}

export { CourseDetailView }
