import { StarIcon } from "lucide-react"
import Image from "next/image"

import type { BookSummary } from "@/features/top-books/model/top-books-schemas"
import { formatPrice } from "@/lib/utils"

interface TopBookRowProps {
  book: BookSummary
}

function TopBookRow({ book }: TopBookRowProps) {
  return (
    <article className="flex items-center gap-4 py-3">
      <div className="relative h-20 w-[54px] shrink-0 overflow-hidden rounded-lg bg-dark-2">
        <Image src={book.cover} alt={book.title} fill sizes="54px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{book.title}</h3>
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {book.averageRating.toFixed(1)} ({book.ratingsCount})
        </div>
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
      </div>
    </article>
  )
}

export { TopBookRow }
