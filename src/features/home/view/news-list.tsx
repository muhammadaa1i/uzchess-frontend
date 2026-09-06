"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error-state"
import { NewsCard } from "@/components/shared/news-card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useNewsList } from "@/features/home/viewmodel/use-news-list"

// "Barchasi" links to the full News list page (Figma to-do section 4) — the
// row rendering itself lives in the shared `NewsCard` component
// (@/components/shared/news-card) so this widget and the News list page
// don't import from each other's feature folder (see CLAUDE.md's
// code-splitting mandate). Figma's home frame renders this as a plain
// vertical list, not a carousel.
function NewsList() {
  const t = useTranslations("Home.news")
  const { news, isLoading, isError, refetch } = useNewsList()

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading title={t("title")} actionLabel={t("seeAll")} href="/news" />
      {isLoading ? (
        <div className="flex flex-col divide-y divide-[#272B30]">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="my-3 h-[120px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : news.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="flex flex-col divide-y divide-[#272B30]">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export { NewsList }
