"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import type { NewsItem } from "@/features/home/model/home-schemas"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useNewsList } from "@/features/home/viewmodel/use-news-list"
import { formatDate } from "@/lib/utils"

// "Barchasi" links to a News list page (Figma to-do section 4), which
// doesn't exist yet — see SectionHeading's placeholder CTA. Figma's home
// frame renders this as a plain vertical list, not a carousel.
function NewsList() {
  const t = useTranslations("Home.news")
  const { news, isLoading, isError } = useNewsList()

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading title={t("title")} actionLabel={t("seeAll")} actionClassName="opacity-60" />
      {isLoading ? (
        <div className="flex flex-col divide-y divide-[#272B30]">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="my-3 h-[120px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError || news.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="flex flex-col divide-y divide-[#272B30]">
          {news.map((item) => (
            <NewsRow key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  )
}

function NewsRow({ news }: { news: NewsItem }) {
  return (
    <article className="flex items-center gap-4 py-4">
      <div className="relative h-[120px] w-[180px] shrink-0 overflow-hidden rounded-lg bg-dark-2">
        {news.imageUrl && (
          <Image src={news.imageUrl} alt={news.title} fill className="object-cover" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-sm text-[#6F767E]">{formatDate(news.publishedAt)}</span>
        <h3 className="line-clamp-2 text-base font-medium text-brand-white">{news.title}</h3>
      </div>
    </article>
  )
}

export { NewsList }
