import { useEffect, useRef, useState } from "react"

import { useGetBooksQuery } from "@/features/library/book-catalog/model/book-catalog-api"
import { useBookCatalogReferenceData } from "@/features/library/book-catalog-reference-data/viewmodel/use-book-catalog-reference-data"
import { usePageQueryParam } from "@/lib/hooks/use-page-query-param"

const CATALOG_PAGE_SIZE = 12

// How long the search box waits after the user stops typing before it
// commits to `filters.search` (and the query it drives) — without this, the
// TextField's onChange fired a fresh GET .../read?search=... request per
// keystroke.
const SEARCH_DEBOUNCE_MS = 700

// "Any" sentinels for the filter Selects — base-ui's Select doesn't support
// an empty string as a real option value, and each filter field being unset
// on the query params means "don't filter" anyway (same pattern as
// useCourseCatalog/useRanking's sentinels).
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
// as useCourseCatalog/useRanking/useNewsList.
function useBookCatalog() {
  // `searchInput` is what the search box renders/updates immediately on
  // every keystroke; `filters.search` (and the query below) only catches up
  // SEARCH_DEBOUNCE_MS after typing settles — see the effect below.
  const [searchInput, setSearchInput] = useState(DEFAULT_FILTERS.search)
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [page, setPage] = usePageQueryParam()
  // `useEffect` always runs once right after mount regardless of its
  // dependency array — without this guard, the debounce effect below would
  // unconditionally call `setPage(1)` ~700ms after every mount, silently
  // wiping out a page number restored from the URL (e.g. a reload on page
  // 2) right after usePageQueryParam had just set it correctly.
  const isFirstSearchCommit = useRef(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((current) =>
        current.search === searchInput ? current : { ...current, search: searchInput }
      )
      if (isFirstSearchCommit.current) {
        isFirstSearchCommit.current = false
      } else {
        setPage(1)
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
    // `setPage`'s identity changes with the page number (it's derived from
    // the URL via usePageQueryParam, not a plain useState setter) — adding
    // it here would re-fire this debounce effect on every page change and
    // reset back to page 1, the opposite of what usePageQueryParam fixes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBooksQuery({
    page,
    size: CATALOG_PAGE_SIZE,
    search: filters.search.trim() || undefined,
    categoryId: filters.categoryId === ANY_CATEGORY ? undefined : Number(filters.categoryId),
    difficultyId:
      filters.difficultyId === ANY_DIFFICULTY ? undefined : Number(filters.difficultyId),
    languageId: filters.languageId === ANY_LANGUAGE ? undefined : Number(filters.languageId),
    minRating: filters.minRating === ANY_RATING ? undefined : Number(filters.minRating),
  })
  // Category/author/difficulty/language reference data (needed to resolve
  // each result card's id fields to labels) comes from the sibling
  // book-catalog-reference-data slice — the same hook the book-catalog-filters
  // slice calls independently for its own Select options, so both consumers
  // share one RTK Query cache entry per list rather than firing duplicate
  // requests on the same page load.
  const { categories, difficulties, languages, authors } = useBookCatalogReferenceData()

  function updateSearch(value: string) {
    setSearchInput(value)
  }

  function updateFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  function clearFilters() {
    setSearchInput(DEFAULT_FILTERS.search)
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const hasActiveFilters =
    searchInput.trim() !== "" ||
    filters.categoryId !== ANY_CATEGORY ||
    filters.difficultyId !== ANY_DIFFICULTY ||
    filters.languageId !== ANY_LANGUAGE ||
    filters.minRating !== ANY_RATING

  return {
    books: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
    filters,
    searchInput,
    updateSearch,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    categories,
    difficulties,
    languages,
    authors,
    anyCategory: ANY_CATEGORY,
    anyDifficulty: ANY_DIFFICULTY,
    anyLanguage: ANY_LANGUAGE,
    anyRating: ANY_RATING,
  }
}

export { CATALOG_PAGE_SIZE, useBookCatalog }
