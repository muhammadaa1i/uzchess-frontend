import { useState } from "react"

import {
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
  useGetCourseLanguagesQuery,
  useGetCoursesQuery,
} from "@/features/courses/model/course-catalog-api"

const CATALOG_PAGE_SIZE = 12

// "Any" sentinels for the filter Selects — base-ui's Select doesn't support
// an empty string as a real option value, and each filter field being unset
// on the query params means "don't filter" anyway (same pattern as
// useRanking's ALL_COUNTRIES sentinel).
const ANY_CATEGORY = "any"
const ANY_DIFFICULTY = "any"
const ANY_LANGUAGE = "any"
const ANY_RATING = "any"

interface CatalogFilters {
  search: string
  categoryId: string
  difficultyId: string
  languageId: string
  minRating: string
}

const DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  categoryId: ANY_CATEGORY,
  difficultyId: ANY_DIFFICULTY,
  languageId: ANY_LANGUAGE,
  minRating: ANY_RATING,
}

// Search text, selected filters and the current page are all purely
// ephemeral, view-local UI state (what the currently-open list is showing),
// not app-wide data — plain `useState` here follows CLAUDE.md's "dropdown
// open/close"-style exception to the Redux Toolkit mandate, same reasoning
// as useRanking/useNewsList.
function useCourseCatalog() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCoursesQuery({
    page,
    size: CATALOG_PAGE_SIZE,
    search: filters.search.trim() || undefined,
    categoryId: filters.categoryId === ANY_CATEGORY ? undefined : Number(filters.categoryId),
    difficultyId:
      filters.difficultyId === ANY_DIFFICULTY ? undefined : Number(filters.difficultyId),
    languageId: filters.languageId === ANY_LANGUAGE ? undefined : Number(filters.languageId),
    minRating: filters.minRating === ANY_RATING ? undefined : Number(filters.minRating),
  })
  const { data: categories } = useGetCourseCategoriesQuery()
  const { data: difficulties } = useGetCourseDifficultiesQuery()
  const { data: languages } = useGetCourseLanguagesQuery()

  function updateFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.categoryId !== ANY_CATEGORY ||
    filters.difficultyId !== ANY_DIFFICULTY ||
    filters.languageId !== ANY_LANGUAGE ||
    filters.minRating !== ANY_RATING

  return {
    courses: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    categories: categories ?? [],
    difficulties: difficulties ?? [],
    languages: languages ?? [],
    anyCategory: ANY_CATEGORY,
    anyDifficulty: ANY_DIFFICULTY,
    anyLanguage: ANY_LANGUAGE,
    anyRating: ANY_RATING,
  }
}

export { CATALOG_PAGE_SIZE, useCourseCatalog }
