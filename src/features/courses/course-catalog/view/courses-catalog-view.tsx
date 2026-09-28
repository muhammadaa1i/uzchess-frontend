"use client"

import { CatalogHeader } from "@/features/courses/course-catalog/view/catalog-header"
import { CatalogResults } from "@/features/courses/course-catalog/view/catalog-results"
import { useCourseCatalog } from "@/features/courses/course-catalog/viewmodel/use-course-catalog"
import { CatalogFilterPanel } from "@/features/courses/course-catalog-filters/view/catalog-filter-panel"
import {
  type CourseCategory,
  type CourseDifficulty,
  type CourseLanguage,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-schemas"

function CoursesCatalogView() {
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

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <CatalogHeader searchInput={searchInput} onSearchChange={updateSearch} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <CatalogFilterPanel
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          anyCategory={anyCategory}
          anyDifficulty={anyDifficulty}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
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
