"use client"

import Image from "next/image"

import { Link } from "@/lib/i18n/navigation"
import { cn, formatDate } from "@/lib/utils"

// Purely presentational news row, shared between the Home page's news
// widget (src/features/home/view/news-list.tsx) and the full News list page
// (src/features/news/view/news-list-view.tsx) — see CLAUDE.md's
// code-splitting mandate: since neither feature may import the other's
// model/view files, this row shape is defined locally here rather than
// importing a feature's zod-inferred type, the same pattern already used by
// @/components/shared/ranking-table. Each feature's own `NewsItem` type is a
// structural superset of `NewsCardRow`, so no adapter/mapping is needed to
// pass it in directly.
interface NewsCardRow {
  id: number
  title: string
  imageUrl?: string | null
  publishedAt: string
}

interface NewsCardProps {
  news: NewsCardRow
  className?: string
}

function NewsCard({ news, className }: NewsCardProps) {
  return (
    <Link
      href={`/news/${news.id}`}
      className={cn("flex items-center gap-4 py-4", className)}
    >
      <div className="relative h-[120px] w-[180px] shrink-0 overflow-hidden rounded-lg bg-dark-2">
        {news.imageUrl && (
          <Image src={news.imageUrl} alt={news.title} fill className="object-cover" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-sm text-[#6F767E]">{formatDate(news.publishedAt)}</span>
        <h3 className="line-clamp-2 text-base font-medium text-brand-white">{news.title}</h3>
      </div>
    </Link>
  )
}

export { NewsCard }
export type { NewsCardRow }
