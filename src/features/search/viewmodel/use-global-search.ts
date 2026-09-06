import { useEffect, useState } from "react"

import { useGetCoursesQuery } from "@/features/courses/model/course-catalog-api"
import { useGetBooksQuery } from "@/features/library/model/book-catalog-api"
import { useGetNewsQuery } from "@/features/news/model/news-api"
import {
  toBookSearchResults,
  toCourseSearchResults,
  toNewsSearchResults,
} from "@/features/search/model/search-mappers"
import type { SearchResultItem, SearchResultType } from "@/features/search/model/search-schemas"

// Below this many typed characters there's nothing worth fanning out three
// requests for — matches the task's "handle the empty-query state sensibly"
// requirement.
const MIN_QUERY_LENGTH = 2
// How long to wait after the user stops typing before firing the three
// list queries — unlike the catalog filters (useBookCatalog/useCourseCatalog,
// which fire on every keystroke against a single endpoint), this hook fans
// out to three endpoints at once per keystroke would mean 3x the requests,
// so it's debounced here specifically.
const DEBOUNCE_MS = 700
// Small "quick results" page size per source, not a full catalog page.
const RESULT_LIMIT = 4

interface SearchResultGroup {
  type: SearchResultType
  items: SearchResultItem[]
}

// Backs the header's global search panel — CLAUDE.md's Home to-do calls for
// "matches on title only", and none of news/courses/books has a unified
// search endpoint, so this hook fans out to each feature's own existing
// `search`-param list query (reused directly, not duplicated) and merges
// the three results into grouped rows for the view.
function useGlobalSearch() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [query])

  const trimmedQuery = debouncedQuery.trim()
  const isSearchable = trimmedQuery.length >= MIN_QUERY_LENGTH

  const newsResult = useGetNewsQuery(
    { search: trimmedQuery, size: RESULT_LIMIT },
    { skip: !isSearchable }
  )
  const coursesResult = useGetCoursesQuery(
    { search: trimmedQuery, size: RESULT_LIMIT },
    { skip: !isSearchable }
  )
  const booksResult = useGetBooksQuery(
    { search: trimmedQuery, size: RESULT_LIMIT },
    { skip: !isSearchable }
  )

  const isLoading =
    isSearchable &&
    (newsResult.isFetching || coursesResult.isFetching || booksResult.isFetching)

  // Only surface an error state once every source failed — if e.g. books
  // fails but news/courses succeed, showing partial results beats a hard
  // error for what's still just a "quick results" panel.
  const isError =
    isSearchable && newsResult.isError && coursesResult.isError && booksResult.isError

  const allGroups: SearchResultGroup[] = [
    { type: "news", items: toNewsSearchResults(newsResult.data?.data ?? []) },
    { type: "course", items: toCourseSearchResults(coursesResult.data?.data ?? []) },
    { type: "book", items: toBookSearchResults(booksResult.data?.data ?? []) },
  ]
  const groups = allGroups.filter((group) => group.items.length > 0)

  const hasResults = groups.length > 0

  return {
    query,
    setQuery,
    isSearchable,
    isLoading,
    isError,
    groups,
    hasResults,
  }
}

export { useGlobalSearch }
export type { SearchResultGroup }
