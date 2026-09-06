import { useGetLiveSidebarPromoQuery } from "@/features/live/model/live-api"

function useLiveSidebarPromo() {
  const { data, isLoading, isError } = useGetLiveSidebarPromoQuery()

  return {
    banners: (data ?? []).filter((banner) => banner.isActive),
    isLoading,
    isError,
  }
}

export { useLiveSidebarPromo }
