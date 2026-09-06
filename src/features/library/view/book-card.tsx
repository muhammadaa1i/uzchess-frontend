"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import type { BookAuthor, BookCategory, BookListItem } from "@/features/library/model/book-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface BookCardProps {
  book: BookListItem
  category?: BookCategory
  authors: BookAuthor[]
}

// Purely presentational catalog grid card — feature-local (not under
// @/components/shared) since it's only ever reached via the library
// feature's own /library route, matching CLAUDE.md's code-splitting mandate.
function BookCard({ book, category, authors }: BookCardProps) {
  const t = useTranslations("Library.card")

  return (
    <Link
      href={`/library/${book.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-[#1A1D1F] transition-colors hover:bg-[#202426]"
    >
      <div className="relative aspect-[3/4] w-full bg-dark-2">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {category && <span className="text-xs text-brand-secondary-low">{category.title}</span>}
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{book.title}</h3>
        {authors.length > 0 && (
          <p className="line-clamp-1 text-xs text-brand-secondary-low">
            {authors.map((author) => author.fullName).join(", ")}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {book.averageRating.toFixed(1)} ({book.ratingsCount})
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {book.discountPrice ? (
              <>
                <span className="text-sm font-semibold text-brand-white">
                  {formatPrice(book.discountPrice)}
                </span>
                <span className="text-xs text-brand-secondary-low line-through">
                  {formatPrice(book.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-brand-white">
                {formatPrice(book.price)}
              </span>
            )}
          </div>
          <span className="text-xs text-brand-secondary-low">
            {t("pages", { count: book.pageCount })}
          </span>
        </div>
      </div>
    </Link>
  )
}

export { BookCard }
