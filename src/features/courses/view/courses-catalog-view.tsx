"use client"

import { useTranslations } from "next-intl"
import type { MouseEvent } from "react"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseCard } from "@/features/courses/view/course-card"
import { useCourseCatalog } from "@/features/courses/viewmodel/use-course-catalog"

const RATING_OPTIONS = [5, 4, 3, 2, 1]

function CoursesCatalogView() {
  const t = useTranslations("Courses")
  const {
    courses,
    isLoading,
    isError,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    categories,
    difficulties,
    languages,
    anyCategory,
    anyDifficulty,
    anyLanguage,
    anyRating,
  } = useCourseCatalog()

  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const difficultyById = new Map(difficulties.map((difficulty) => [difficulty.id, difficulty]))

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <TextField
            placeholder={t("filters.searchPlaceholder")}
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            className="lg:w-64"
          />
          <Select
            value={filters.categoryId}
            onValueChange={(value) => value && updateFilter("categoryId", value)}
          >
            <SelectTrigger className="lg:w-44">
              <SelectValue placeholder={t("filters.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={anyCategory}>{t("filters.any")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.difficultyId}
            onValueChange={(value) => value && updateFilter("difficultyId", value)}
          >
            <SelectTrigger className="lg:w-44">
              <SelectValue placeholder={t("filters.difficulty")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={anyDifficulty}>{t("filters.any")}</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.id} value={String(difficulty.id)}>
                  {difficulty.degree}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.languageId}
            onValueChange={(value) => value && updateFilter("languageId", value)}
          >
            <SelectTrigger className="lg:w-40">
              <SelectValue placeholder={t("filters.language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={anyLanguage}>{t("filters.any")}</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={String(language.id)}>
                  {language.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.minRating}
            onValueChange={(value) => value && updateFilter("minRating", value)}
          >
            <SelectTrigger className="lg:w-36">
              <SelectValue placeholder={t("filters.rating")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={anyRating}>{t("filters.any")}</SelectItem>
              {RATING_OPTIONS.map((stars) => (
                <SelectItem key={stars} value={String(stars)}>
                  {t("filters.ratingAndUp", { stars })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="lg:ml-auto">
              {t("filters.clear")}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : isError || courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
            {t("empty")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  category={categoryById.get(course.categoryId)}
                  difficulty={difficultyById.get(course.difficultyId)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <CatalogPagination
                page={page}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface CatalogPaginationProps {
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function CatalogPagination({
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: CatalogPaginationProps) {
  const t = useTranslations("Courses.pagination")

  function goTo(nextPage: number) {
    return (event: MouseEvent) => {
      event.preventDefault()
      onPageChange(nextPage)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("previous")}
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page - 1)}
          />
        </PaginationItem>
        {getPageNumbers(page, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink href="#" isActive={entry === page} onClick={goTo(entry)}>
                {entry}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            text={t("next")}
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

// Windows the visible page numbers around the current page — duplicated
// from Ranking/News's identical helper per CLAUDE.md's code-splitting
// mandate rather than shared.
function getPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const keep = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...keep].filter((value) => value >= 1 && value <= total).sort((a, b) => a - b)

  const result: Array<number | "ellipsis"> = []
  let previous = 0
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push("ellipsis")
    result.push(value)
    previous = value
  }
  return result
}

export { CoursesCatalogView }
