"use client"

import { useTranslations } from "next-intl"

import {
  type CourseCategory,
  type CourseDifficulty,
  type CourseLanguage,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/course-catalog/model/course-catalog-schemas"
import { CatalogHeader } from "@/features/course-catalog/view/catalog-header"
import { CatalogMobileFilterDialog } from "@/features/course-catalog/view/catalog-mobile-filter-dialog"
import { CatalogResults } from "@/features/course-catalog/view/catalog-results"
import { CatalogSidebarFilter } from "@/features/course-catalog/view/catalog-sidebar-filter"
import { useCourseCatalog } from "@/features/course-catalog/viewmodel/use-course-catalog"

function CoursesCatalogView() {
  const t = useTranslations("Courses")
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

  const categoryById = new Map<number, CourseCategory>(
    categories.map((category) => [category.id, category])
  )
  const difficultyById = new Map<number, CourseDifficulty>(
    difficulties.map((difficulty) => [difficulty.id, difficulty])
  )
  const languageById = new Map<number, CourseLanguage>(
    languages.map((language) => [language.id, language])
  )

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
      <CatalogHeader searchInput={searchInput} onSearchChange={updateSearch} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <CatalogSidebarFilter
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          difficulties={difficulties}
          categories={categories}
          languages={languages}
          anyDifficulty={anyDifficulty}
          anyCategory={anyCategory}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
          difficultyLabel={difficultyLabel}
          categoryLabel={categoryLabel}
          languageLabel={languageLabel}
          difficultyLabels={difficultyLabels}
          categoryLabels={categoryLabels}
        />

        <CatalogMobileFilterDialog
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          difficulties={difficulties}
          categories={categories}
          languages={languages}
          anyDifficulty={anyDifficulty}
          anyCategory={anyCategory}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
          difficultyLabel={difficultyLabel}
          categoryLabel={categoryLabel}
          languageLabel={languageLabel}
          difficultyLabels={difficultyLabels}
          categoryLabels={categoryLabels}
        />

        <CatalogResults
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          courses={courses}
          categoryById={categoryById}
          difficultyById={difficultyById}
          languageById={languageById}
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export { CoursesCatalogView }
