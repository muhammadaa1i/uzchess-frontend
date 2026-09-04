"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePromoBanners } from "@/features/home/viewmodel/use-promo-banners"

// Wide 676x88 hero slot for the first active promo banner (see
// GET /banners/read). The sidebar `PromoBanners` card renders from the same
// `usePromoBanners` hook/RTK Query cache entry — this doesn't re-fetch, it
// just shows a different item from the same list in a different layout.
function HeroPromoBanner() {
  const t = useTranslations("Home.banners")
  const { banners, isLoading, isError } = usePromoBanners()

  if (isLoading) {
    return <Skeleton className="h-[88px] w-full rounded-lg" />
  }

  const banner = banners[0]
  if (isError || !banner) return null

  return (
    <div className="relative flex h-[88px] w-full items-center overflow-hidden rounded-lg bg-[#0B4789]">
      {banner.imageUrl && (
        <Image src={banner.imageUrl} alt="" fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4789] via-[#0B4789]/70 to-transparent" />
      {banner.linkUrl ? (
        <Button
          size="sm"
          className="relative ml-6"
          nativeButton={false}
          render={<a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" />}
        >
          {t("cta")}
        </Button>
      ) : (
        <Button size="sm" disabled className="relative ml-6">
          {t("cta")}
        </Button>
      )}
    </div>
  )
}

export { HeroPromoBanner }
