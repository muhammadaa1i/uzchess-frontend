"use client"

import { EyeIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { NewsGridCard } from "@/components/shared/news/news-grid-card"
import { NewsDetailSkeleton } from "@/features/news/view/news-detail-skeleton"
import { NewsShareButton } from "@/features/news/view/news-share-button"
import { useNewsDetail } from "@/features/news/viewmodel/use-news-detail"
import { formatDate } from "@/lib/utils"

interface NewsDetailViewProps {
  newsId: number
}

// Detail page for GET /news/read/{id} — image, meta (date, view count),
// share, related articles (relatedNews from the same response). No comment
// thread: CLAUDE.md flags this as a backend gap (no comments endpoint in
// /swagger/home or /swagger/account), same pattern as the missing
// forgot-password endpoint, so it isn't built here.
function NewsDetailView({ newsId }: NewsDetailViewProps) {
  const t = useTranslations("News")
  const { news, relatedNews, isLoading, isError, refetch } = useNewsDetail(newsId)

  if (isLoading) {
    return <NewsDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  if (!news) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("notFound")}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <article className="flex flex-col gap-4">
        {news.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-dark-2">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              sizes="(min-width: 1024px) 1328px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-brand-secondary-low">
            <span>{formatDate(news.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <EyeIcon className="size-4" />
              {t("views", { count: news.viewsCount })}
            </span>
          </div>
          <NewsShareButton title={news.title} />
        </div>

        <h1 className="text-2xl font-medium text-brand-white">{news.title}</h1>
        <p className="whitespace-pre-line text-base text-brand-secondary-low">{news.content}</p>
      </article>

      {relatedNews.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-brand-white">{t("related")}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNews.map((item) => (
              <NewsGridCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export { NewsDetailView }
