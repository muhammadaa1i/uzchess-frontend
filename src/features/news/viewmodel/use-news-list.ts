import { useState } from "react"

import { useGetNewsQuery } from "@/features/news/model/news-api"

const PAGE_SIZE = 12

// Current page is purely ephemeral, view-local UI state (what the currently
// open list is showing), not app-wide data — plain `useState` here follows
// CLAUDE.md's "dropdown open/close"-style exception to the Redux Toolkit
// mandate rather than needing a slice (same reasoning as useRanking).
function useNewsList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isError, refetch } = useGetNewsQuery({
    page,
    size: PAGE_SIZE,
  })

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
  }
}

export { useNewsList }
