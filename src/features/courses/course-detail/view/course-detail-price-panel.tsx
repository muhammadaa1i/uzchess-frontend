"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { CourseDetail } from "@/features/courses/course-detail/model/course-detail-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface CourseDetailPricePanelProps {
  course: CourseDetail
  isPurchased: boolean
  isFree: boolean
  continueLessonId: number | undefined
  onBuyClick: () => void
}

function CourseDetailPricePanel({
  course,
  isPurchased,
  isFree,
  continueLessonId,
  onBuyClick,
}: CourseDetailPricePanelProps) {
  const t = useTranslations("Courses.detail")

  return (
    <aside className="flex h-fit flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4 lg:col-start-2 lg:row-start-1">
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
        continueLessonId ? (
          <Button
            render={<Link href={`/courses/${course.id}/lessons/${continueLessonId}`} />}
            nativeButton={false}
          >
            {t("continueCta")}
          </Button>
        ) : (
          <Button disabled>{t("noLessonsYet")}</Button>
        )
      ) : (
        <Button onClick={onBuyClick}>{t("buyCta")}</Button>
      )}
    </aside>
  )
}

export { CourseDetailPricePanel }
