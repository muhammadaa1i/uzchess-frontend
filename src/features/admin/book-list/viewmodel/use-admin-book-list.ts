import { useState } from "react"

import { useGetAdminBooksQuery } from "@/features/admin/book-list/model/book-list-api"

const PAGE_SIZE = 10

// Backs the /admin/books list — GET /books/read is paginated
// (PaginatedGetBooksResponse per the live /swagger/books-json spec, same
// envelope shape as GET /news/read), so this hook mirrors
// use-admin-news-list.ts rather than use-admin-banner-list.ts's plain-array
// shape. `page` is purely ephemeral, view-local UI state (which page of the
// table is showing), not app-wide data, so plain `useState` follows
// CLAUDE.md's dropdown-open/close-style exception to the Redux Toolkit
// mandate.
function useAdminBookList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminBooksQuery({
    page,
    size: PAGE_SIZE,
  })

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
  }
}

export { useAdminBookList }
