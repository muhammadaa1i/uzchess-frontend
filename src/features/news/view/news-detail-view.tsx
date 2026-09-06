"use client"

import { EyeIcon, Share2Icon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { ErrorState } from "@/components/shared/error-state"
import { NewsCard } from "@/components/shared/news-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
          <ShareButton title={news.title} />
        </div>

        <h1 className="text-2xl font-medium text-brand-white">{news.title}</h1>
        <p className="whitespace-pre-line text-base text-brand-secondary-low">{news.content}</p>
      </article>

      {relatedNews.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-brand-white">{t("related")}</h2>
          <div className="flex flex-col divide-y divide-[#272B30]">
            {relatedNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function NewsDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-8 w-2/3 rounded-lg" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full rounded" />
        ))}
      </div>
    </div>
  )
}

// Uses the Web Share API where available (mobile browsers), falling back to
// copying the URL to the clipboard with a brief "copied" confirmation —
// `copied` is purely ephemeral view-local UI state (CLAUDE.md's
// dropdown-open/close-style exception to the Redux Toolkit mandate).
function ShareButton({ title }: { title: string }) {
  const t = useTranslations("News.share")
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" className="text-brand-blue-light" onClick={handleShare}>
      <Share2Icon />
      {copied ? t("copied") : t("label")}
    </Button>
  )
}

export { NewsDetailView }
