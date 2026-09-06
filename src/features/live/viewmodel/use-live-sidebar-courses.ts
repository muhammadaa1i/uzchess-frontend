import { useGetLiveSidebarCoursesQuery } from "@/features/live/model/live-api"

const SIDEBAR_COURSES_SIZE = 3

function useLiveSidebarCourses() {
  const { data, isLoading, isError } = useGetLiveSidebarCoursesQuery()

  return {
    courses: (data ?? []).slice(0, SIDEBAR_COURSES_SIZE),
    isLoading,
    isError,
  }
}

export { useLiveSidebarCourses }
