import { useGetAdminBannersQuery } from "@/features/admin/banner-management/model/banner-management-api"

// Backs the /admin/banners list — GET /banners/read returns a plain array,
// not a paginated envelope (confirmed against the live /swagger/home-json
// spec, unlike GET /news/read), so this hook is simpler than
// use-admin-news-list.ts: there's no page state to own.
function useAdminBannerList() {
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminBannersQuery()

  return {
    banners: data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
  }
}

export { useAdminBannerList }
