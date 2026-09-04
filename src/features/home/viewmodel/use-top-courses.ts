import { useGetTopRatedCoursesQuery } from "@/features/home/model/home-api"

const TOP_COURSES_SIZE = 4

function useTopCourses() {
  const { data, isLoading, isError } = useGetTopRatedCoursesQuery()

  return {
    courses: (data ?? []).slice(0, TOP_COURSES_SIZE),
    isLoading,
    isError,
  }
}

export { useTopCourses }
