"use client"

import { ImageIcon } from "lucide-react"
import Image from "next/image"

import { Link } from "@/lib/i18n/navigation"
import { cn, formatDate } from "@/lib/utils"

// Image-on-top card used by the full News list page's 3-column grid and the
// news detail page's "related articles" row (Figma: News frame #718:87748,
// card component #713:29422) — distinct from the Home widget/News-detail
// "related" row's horizontal `NewsCard`, which Figma's Home annotation
// explicitly calls out as a plain vertical list rather than a grid. Requires
// `excerpt` (unlike `NewsCardRow`) since the card shows a preview line;
// `NewsItem`'s shape already satisfies this structurally.
interface NewsGridCardRow {
  id: number
  title: string
  excerpt: string
  imageUrl?: string | null
  publishedAt: string
}

interface NewsGridCardProps {
  news: NewsGridCardRow
  className?: string
}

function NewsGridCard({ news, className }: NewsGridCardProps) {
  return (
    <Link
      href={`/news/${news.id}`}
      className={cn("flex flex-col gap-2 rounded-lg bg-dark p-3", className)}
    >
      <div className="relative flex aspect-[302/113] w-full items-center justify-center overflow-hidden rounded-[4px] bg-dark-2">
        {news.imageUrl ? (
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="(min-width: 1024px) 326px, 100vw"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="size-8 text-brand-secondary" aria-hidden />
        )}
      </div>
      <span className="text-sm text-white/40">{formatDate(news.publishedAt)}</span>
      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{news.title}</h3>
        <p className="line-clamp-2 text-sm text-brand-secondary-low">{news.excerpt}</p>
      </div>
    </Link>
  )
}

export { NewsGridCard }
export type { NewsGridCardRow }
