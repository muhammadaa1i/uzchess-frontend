import { useGetBannersQuery } from "@/features/home/promo-banners/model/promo-banners-api"

function usePromoBanners() {
  const { data, isLoading, isError } = useGetBannersQuery()

  return {
    banners: (data ?? []).filter((banner) => banner.isActive),
    isLoading,
    isError,
  }
}

export { usePromoBanners }
