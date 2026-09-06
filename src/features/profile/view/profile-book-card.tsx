"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"

import type { ProfileBookItem } from "@/features/profile/model/profile-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface ProfileBookCardProps {
  book: ProfileBookItem
}

// Purely presentational grid card for the saved-products (books) list —
// feature-local for the same reason as ProfileCourseCard (see its comment).
function ProfileBookCard({ book }: ProfileBookCardProps) {
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
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{book.title}</h3>
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {book.averageRating.toFixed(1)} ({book.ratingsCount})
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1">
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
    </Link>
  )
}

export { ProfileBookCard }
