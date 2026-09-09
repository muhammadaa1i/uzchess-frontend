"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import type {
  CourseCategory,
  CourseDetail,
  CourseDifficulty,
} from "@/features/course-detail/model/course-detail-schemas"
import {
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/course-detail/model/course-detail-schemas"

interface CourseDetailHeaderProps {
  course: CourseDetail
  category?: CourseCategory
  difficulty?: CourseDifficulty
  isPurchased: boolean
}

function CourseDetailHeader({ course, category, difficulty, isPurchased }: CourseDetailHeaderProps) {
  const t = useTranslations("Courses.detail")
  const tCourses = useTranslations("Courses")
  const difficultyLabels = (tCourses.raw as (key: string) => Record<string, string>)(
    "difficultyLevels"
  )
  const categoryLabels = (tCourses.raw as (key: string) => Record<string, string>)("categoryLabels")

  return (
    <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-dark-2">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <Badge variant="secondary">{translateCategoryTitle(categoryLabels, category.title)}</Badge>
        )}
        {difficulty && (
          <Badge variant="secondary" className="gap-1.5">
            <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
            {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
          </Badge>
        )}
        {isPurchased && <Badge>{t("purchasedBadge")}</Badge>}
      </div>

      <h1 className="text-2xl font-medium text-brand-white">{course.title}</h1>

      <div className="flex items-center gap-1 text-sm text-brand-secondary-low">
        <StarIcon className="size-4 fill-brand-yellow text-brand-yellow" />
        {course.averageRating.toFixed(1)} ({course.ratingsCount})
      </div>

      <p className="text-sm whitespace-pre-line text-brand-secondary-low">{course.description}</p>
    </div>
  )
}

export { CourseDetailHeader }
