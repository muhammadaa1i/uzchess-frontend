import { useGetPurchasedCoursesQuery } from "@/features/profile/model/profile-orders-api"
import { useAppSelector } from "@/lib/store/hooks"

function usePurchasedCourses() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const {
    data: courses,
    isLoading,
    isError,
  } = useGetPurchasedCoursesQuery(undefined, { skip: !isAuthenticated })

  return {
    courses: courses ?? [],
    isLoading: isLoading && isAuthenticated,
    isError,
  }
}

export { usePurchasedCourses }
