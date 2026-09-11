import { useState } from "react"

import { useGetAdminCoursesQuery } from "@/features/admin/course-list/model/course-list-api"

const PAGE_SIZE = 10

// Backs the /admin/courses list — GET /courses/read is paginated
// (PaginatedGetCoursesResponse per the live /swagger/courses-json spec, same
// envelope shape as GET /books/read), so this hook mirrors
// use-admin-book-list.ts. `page` is purely ephemeral, view-local UI state
// (which page of the table is showing), not app-wide data, so plain
// `useState` follows CLAUDE.md's dropdown-open/close-style exception to the
// Redux Toolkit mandate.
function useAdminCourseList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminCoursesQuery({
    page,
    size: PAGE_SIZE,
  })

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
  }
}

export { useAdminCourseList }
