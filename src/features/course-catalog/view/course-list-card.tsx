"use client"

import { HeartIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import {
  type CourseCategory,
  type CourseDifficulty,
  type CourseLanguage,
  type CourseListItem,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/course-catalog/model/course-catalog-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface CourseListCardProps {
  course: CourseListItem
  category?: CourseCategory
  difficulty?: CourseDifficulty
  language?: CourseLanguage
}

// Figma's catalog row-card layout (horizontal thumbnail + metadata), sibling
// to the grid CourseCard rather than a replacement — CourseCard stays the
// poster shape used by Home's top-courses widget. Feature-local like
// CourseCard, per CLAUDE.md's code-splitting mandate. No course-authors
// display: same shape-fidelity-only `authorIds` gap noted in
// course-catalog-schemas.ts — no author lookup is wired into this feature's
// catalog hook, so (unlike the Library row card) no byline is rendered here.
function CourseListCard({ course, category, difficulty, language }: CourseListCardProps) {
  const t = useTranslations("Courses.card")
  const tCourses = useTranslations("Courses")
  const difficultyLabels = (tCourses.raw as (key: string) => Record<string, string>)(
    "difficultyLevels"
  )
  const categoryLabels = (tCourses.raw as (key: string) => Record<string, string>)(
    "categoryLabels"
  )
  const isFree = course.price === 0

  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex gap-4 rounded-lg bg-dark p-3 transition-colors hover:bg-[#202426] sm:gap-5 sm:p-4"
    >
      <div className="relative h-[141px] w-[130px] shrink-0 overflow-hidden rounded-md bg-dark-2 sm:w-[185px]">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          sizes="185px"
          className="object-cover"
        />
        {language && (
          <span className="absolute top-2 left-2 rounded border border-[#232627] bg-dark/80 px-1.5 py-0.5 text-[10px] font-medium text-brand-white backdrop-blur-sm">
            {language.code.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          {isFree ? (
            <span className="text-lg font-semibold text-brand-green">{t("free")}</span>
          ) : course.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-brand-green">
                {formatPrice(course.discountPrice)}
              </span>
              <span className="text-sm text-brand-secondary-low line-through">
                {formatPrice(course.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-brand-green">
              {formatPrice(course.price)}
            </span>
          )}
          <HeartIcon aria-hidden className="size-5 shrink-0 text-brand-secondary-low" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-secondary-low">
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
            {course.averageRating.toFixed(1)} ({course.ratingsCount})
          </span>
          {difficulty && (
            <Badge variant="secondary" className="gap-1.5">
              <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
              {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
            </Badge>
          )}
          <span aria-hidden className="h-3 w-px bg-brand-secondary/60" />
          <span>{t("lessons", { count: course.lessonsCount })}</span>
          {category && (
            <>
              <span aria-hidden className="h-3 w-px bg-brand-secondary/60" />
              <Badge variant="outline">{translateCategoryTitle(categoryLabels, category.title)}</Badge>
            </>
          )}
        </div>

        <h3 className="mt-auto line-clamp-2 text-xl font-bold text-brand-white">{course.title}</h3>
      </div>
    </Link>
  )
}

export { CourseListCard }
