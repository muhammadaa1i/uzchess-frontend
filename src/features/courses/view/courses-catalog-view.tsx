"use client"

import { GraduationCapIcon, HomeIcon, SearchIcon, StarIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { MouseEvent, ReactNode } from "react"

import { ErrorState } from "@/components/shared/error-state"
import { TextField } from "@/components/shared/text-field"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { translateCategoryTitle, translateDifficultyDegree } from "@/features/courses/model/course-schemas"
import { CourseListCard } from "@/features/courses/view/course-list-card"
import { useCourseCatalog } from "@/features/courses/viewmodel/use-course-catalog"
import { Link } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

const RATING_OPTIONS = [5, 4, 3, 2, 1]

function CoursesCatalogView() {
  const t = useTranslations("Courses")
  const tNav = useTranslations("Nav")
  const difficultyLabels = (t.raw as (key: string) => Record<string, string>)("difficultyLevels")
  const categoryLabels = (t.raw as (key: string) => Record<string, string>)("categoryLabels")
  const {
    courses,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
    filters,
    searchInput,
    updateSearch,
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
  const languageById = new Map(languages.map((language) => [language.id, language]))

  // base-ui's Select.Value renders the raw `value` string (e.g. the "any"
  // sentinel or a numeric id) unless told how to turn a value into a label —
  // it does not read the matching SelectItem's children. Each trigger below
  // passes one of these instead of a bare placeholder so it shows the actual
  // translated/localized label rather than "any" or "3".
  function categoryLabel(value: string) {
    if (value === anyCategory) return t("filters.any")
    const title = categoryById.get(Number(value))?.title
    return title ? translateCategoryTitle(categoryLabels, title) : t("filters.category")
  }
  function difficultyLabel(value: string) {
    if (value === anyDifficulty) return t("filters.any")
    const degree = difficultyById.get(Number(value))?.degree
    return degree ? translateDifficultyDegree(difficultyLabels, degree) : t("filters.difficulty")
  }
  function languageLabel(value: string) {
    if (value === anyLanguage) return t("filters.any")
    return languageById.get(Number(value))?.title ?? t("filters.language")
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />} className="flex items-center gap-1.5">
              <HomeIcon className="size-4" />
              {tNav("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex w-full shrink-0 items-center justify-center gap-3 rounded-lg border border-[#1F272A] bg-dark px-6 py-5 lg:w-[326px]">
          <GraduationCapIcon aria-hidden className="size-11 shrink-0 text-brand-white" />
          <h1 className="text-[32px] leading-tight font-bold text-brand-white">{t("title")}</h1>
        </div>

        <div className="relative flex h-[52px] w-full items-center rounded-lg border border-[#232627] bg-[#15181A] px-4">
          <SearchIcon aria-hidden className="pointer-events-none absolute left-4 size-5 text-brand-white/40" />
          <TextField
            placeholder={t("filters.searchPlaceholder")}
            value={searchInput}
            onChange={(event) => updateSearch(event.target.value)}
            className="h-full border-none bg-transparent pl-8 text-sm text-brand-white shadow-none placeholder:text-brand-white/40 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="flex w-full shrink-0 flex-col gap-6 rounded-lg border border-[#1F272A] bg-dark p-5 lg:w-[326px]">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-brand-white">{t("filters.heading")}</span>
            {hasActiveFilters && (
              <Button
                variant="link"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-brand-blue"
              >
                {t("filters.clear")}
              </Button>
            )}
          </div>

          <CatalogFilterGroup label={t("filters.difficultyLabel")}>
            <Select
              value={filters.difficultyId}
              onValueChange={(value) => value && updateFilter("difficultyId", value)}
            >
              <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
                <SelectValue placeholder={t("filters.difficulty")}>{difficultyLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={anyDifficulty}>{t("filters.any")}</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.id} value={String(difficulty.id)}>
                    {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CatalogFilterGroup>

          <CatalogFilterGroup label={t("filters.categoryLabel")}>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => value && updateFilter("categoryId", value)}
            >
              <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
                <SelectValue placeholder={t("filters.category")}>{categoryLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={anyCategory}>{t("filters.any")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {translateCategoryTitle(categoryLabels, category.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CatalogFilterGroup>

          <CatalogFilterGroup label={t("filters.languageLabel")}>
            <Select
              value={filters.languageId}
              onValueChange={(value) => value && updateFilter("languageId", value)}
            >
              <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
                <SelectValue placeholder={t("filters.language")}>{languageLabel}</SelectValue>
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
          </CatalogFilterGroup>

          <CatalogFilterGroup label={t("filters.ratingLabel")}>
            <RatingStarFilter
              value={filters.minRating}
              anyRating={anyRating}
              onChange={(value) => updateFilter("minRating", value)}
            />
          </CatalogFilterGroup>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[141px] w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={refetch} />
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
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface CatalogFilterGroupProps {
  label: string
  children: ReactNode
}

function CatalogFilterGroup({ label, children }: CatalogFilterGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-brand-secondary-low uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

interface RatingStarFilterProps {
  value: string
  anyRating: string
  onChange: (value: string) => void
}

// Figma shows the rating filter as 5 literal stars rather than a text
// dropdown — clicking star N sets `minRating` to N, clicking the
// already-active star again toggles it back to the "any" sentinel, same
// semantics the old Select-based rating filter used.
function RatingStarFilter({ value, anyRating, onChange }: RatingStarFilterProps) {
  const t = useTranslations("Courses.filters")
  const selected = value === anyRating ? 0 : Number(value)

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[#232627] bg-[#15181A] px-4 py-4">
      {RATING_OPTIONS.slice()
        .reverse()
        .map((star) => (
          <button
            key={star}
            type="button"
            aria-pressed={star <= selected}
            aria-label={t("ratingAndUp", { stars: star })}
            onClick={() => onChange(star === selected ? anyRating : String(star))}
            className="p-0.5"
          >
            <StarIcon
              className={cn(
                "size-5 transition-colors",
                star <= selected
                  ? "fill-brand-accent text-brand-accent"
                  : "text-brand-secondary-low"
              )}
            />
          </button>
        ))}
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
