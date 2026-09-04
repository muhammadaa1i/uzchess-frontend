"use client"

import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePromoBanners } from "@/features/home/viewmodel/use-promo-banners"

// Narrow 326x192 sidebar slot. Shares the `usePromoBanners` RTK Query cache
// entry with `HeroPromoBanner` (no extra fetch) — renders the second active
// banner when there is one, otherwise falls back to the first so a single
// banner still shows up somewhere.
function PromoBanners() {
  const t = useTranslations("Home.banners")
  const { banners, isLoading, isError } = usePromoBanners()

  if (isLoading) {
    return <Skeleton className="h-[192px] w-full rounded-lg" />
  }

  const banner = banners[1] ?? banners[0]
  if (isError || !banner) return null

  return (
    <div className="relative flex h-[192px] w-full flex-col justify-end overflow-hidden rounded-lg bg-[#0B4789] p-5">
      {banner.imageUrl && (
        <Image src={banner.imageUrl} alt="" fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4789] via-[#0B4789]/60 to-transparent" />
      <div className="relative flex flex-col gap-4">
        <span className="text-xl font-bold text-brand-white">{banner.title}</span>
        {banner.linkUrl ? (
          <Button
            size="sm"
            className="w-fit"
            nativeButton={false}
            render={<a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" />}
          >
            {t("cta")}
            <ArrowRightIcon />
          </Button>
        ) : (
          <Button size="sm" disabled className="w-fit">
            {t("cta")}
            <ArrowRightIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export { PromoBanners }
