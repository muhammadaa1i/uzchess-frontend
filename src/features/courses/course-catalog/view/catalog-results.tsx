"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  CourseCategory,
  CourseDifficulty,
  CourseLanguage,
  CourseListItem,
} from "@/features/courses/course-catalog/model/course-catalog-schemas"
import { CatalogPagination } from "@/features/courses/course-catalog/view/catalog-pagination"
import { CourseListCard } from "@/features/courses/course-catalog/view/course-list-card"

interface CatalogResultsProps {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  courses: CourseListItem[]
  categoryById: Map<number, CourseCategory>
  difficultyById: Map<number, CourseDifficulty>
  languageById: Map<number, CourseLanguage>
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function CatalogResults({
  isLoading,
  isError,
  onRetry,
  courses,
  categoryById,
  difficultyById,
  languageById,
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: CatalogResultsProps) {
  const t = useTranslations("Courses")

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      {isLoading ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[141px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {courses.map((course) => (
              <CourseListCard
                key={course.id}
                course={course}
                category={categoryById.get(course.categoryId)}
                difficulty={difficultyById.get(course.difficultyId)}
                language={languageById.get(course.languageId)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export { CatalogResults }
