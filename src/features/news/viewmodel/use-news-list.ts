import { useEffect, useState } from "react"

import { useGetNewsQuery } from "@/features/news/model/news-api"

const PAGE_SIZE = 12

// How long the search box waits after the user stops typing before it
// commits to the query (same debounce as Courses/Library's catalog search —
// see use-course-catalog.ts) — without this, every keystroke would fire a
// fresh GET /news/read?search=... request.
const SEARCH_DEBOUNCE_MS = 700

// Current page/search are purely ephemeral, view-local UI state (what the
// currently open list is showing), not app-wide data — plain `useState`
// here follows CLAUDE.md's "dropdown open/close"-style exception to the
// Redux Toolkit mandate rather than needing a slice (same reasoning as
// useCourseCatalog/useRanking).
function useNewsList() {
  // `searchInput` is what the search box renders/updates immediately on
  // every keystroke; `search` (and the query below) only catches up
  // SEARCH_DEBOUNCE_MS after typing settles — see the effect below.
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isFetching, isError, refetch } = useGetNewsQuery({
    page,
    size: PAGE_SIZE,
    search: search.trim() || undefined,
  })

  function updateSearch(value: string) {
    setSearchInput(value)
  }

  return {
    news: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
    searchInput,
    updateSearch,
  }
}

export { useNewsList }
