import { useGetOrdersQuery } from "@/features/profile/model/profile-orders-api"
import { useAppSelector } from "@/lib/store/hooks"

function useOrders() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const { data: orders, isLoading, isError } = useGetOrdersQuery(undefined, {
    skip: !isAuthenticated,
  })

  return {
    orders: orders ?? [],
    isLoading: isLoading && isAuthenticated,
    isError,
  }
}

export { useOrders }
