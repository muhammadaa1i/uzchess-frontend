"use client"

import { HeartIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import {
  type BookAuthor,
  type BookCategory,
  type BookDifficulty,
  type BookLanguage,
  type BookListItem,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/library/model/book-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface BookListCardProps {
  book: BookListItem
  category?: BookCategory
  difficulty?: BookDifficulty
  language?: BookLanguage
  authors: BookAuthor[]
}

// Figma's catalog row-card layout (horizontal thumbnail + metadata), sibling
// to the grid BookCard rather than a replacement — BookCard stays the
// poster shape used by Home's top-books widget. Feature-local like BookCard,
// per CLAUDE.md's code-splitting mandate.
function BookListCard({ book, category, difficulty, language, authors }: BookListCardProps) {
  const t = useTranslations("Library.card")
  const tLibrary = useTranslations("Library")
  const difficultyLabels = (tLibrary.raw as (key: string) => Record<string, string>)(
    "difficultyLevels"
  )
  const categoryLabels = (tLibrary.raw as (key: string) => Record<string, string>)(
    "categoryLabels"
  )
  const isFree = book.price === 0

  return (
    <Link
      href={`/library/${book.id}`}
      className="flex gap-4 rounded-lg bg-dark p-3 transition-colors hover:bg-[#202426] sm:gap-5 sm:p-4"
    >
      <div className="relative h-[141px] w-[130px] shrink-0 overflow-hidden rounded-md bg-dark-2 sm:w-[185px]">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          sizes="185px"
          className="object-cover"
        />
        {language && (
          <span className="absolute top-2 left-2 rounded border border-[#232627] bg-dark/80 px-1.5 py-0.5 text-[10px] font-medium text-brand-white backdrop-blur-sm">
            {language.code.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          {isFree ? (
            <span className="text-lg font-semibold text-brand-green">{t("free")}</span>
          ) : book.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-brand-green">
                {formatPrice(book.discountPrice)}
              </span>
              <span className="text-sm text-brand-secondary-low line-through">
                {formatPrice(book.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-brand-green">
              {formatPrice(book.price)}
            </span>
          )}
          <HeartIcon aria-hidden className="size-5 shrink-0 text-brand-secondary-low" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-secondary-low">
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
            {book.averageRating.toFixed(1)} ({book.ratingsCount})
          </span>
          {difficulty && (
            <Badge variant="secondary" className="gap-1.5">
              <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
              {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
            </Badge>
          )}
          <span aria-hidden className="h-3 w-px bg-brand-secondary/60" />
          <span>{t("pages", { count: book.pageCount })}</span>
          {category && (
            <>
              <span aria-hidden className="h-3 w-px bg-brand-secondary/60" />
              <Badge variant="outline">{translateCategoryTitle(categoryLabels, category.title)}</Badge>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 text-xl font-bold text-brand-white">{book.title}</h3>
        {authors.length > 0 && (
          <p className="mt-auto line-clamp-1 text-sm text-brand-secondary-low">
            {authors.map((author) => author.fullName).join(", ")}
          </p>
        )}
      </div>
    </Link>
  )
}

export { BookListCard }
