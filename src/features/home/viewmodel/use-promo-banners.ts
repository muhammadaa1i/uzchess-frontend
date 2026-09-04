import { useGetBannersQuery } from "@/features/home/model/home-api"

function usePromoBanners() {
  const { data, isLoading, isError } = useGetBannersQuery()

  return {
    banners: (data ?? []).filter((banner) => banner.isActive),
    isLoading,
    isError,
  }
}

export { usePromoBanners }
