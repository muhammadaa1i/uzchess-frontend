import { useState } from "react"

import { useGetAdminNewsQuery } from "@/features/admin/news-management/model/news-management-api"

const PAGE_SIZE = 10

// Backs the /admin/news list — `page` is purely ephemeral, view-local UI
// state (which page of the table is showing), not app-wide data, so plain
// `useState` follows CLAUDE.md's dropdown-open/close-style exception to the
// Redux Toolkit mandate, same as the public news feature's useNewsList.
function useAdminNewsList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminNewsQuery({
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

export { useAdminNewsList }
