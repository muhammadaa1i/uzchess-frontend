import { useGetTopRatedCoursesQuery } from "@/features/top-courses/model/top-courses-api"

const TOP_COURSES_SIZE = 4

function useTopCourses() {
  const { data, isLoading, isError, refetch } = useGetTopRatedCoursesQuery()

  return {
    courses: (data ?? []).slice(0, TOP_COURSES_SIZE),
    isLoading,
    isError,
    refetch,
  }
}

export { useTopCourses }
