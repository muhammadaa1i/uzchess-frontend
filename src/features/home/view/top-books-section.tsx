"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import type { BookSummary } from "@/features/home/model/home-schemas"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useTopBooks } from "@/features/home/viewmodel/use-top-books"
import { formatPrice } from "@/lib/utils"

// "Barchasi" links to the Library catalog (Figma to-do section 6), which
// doesn't exist yet — see SectionHeading's placeholder CTA. Figma dims this
// particular "Barchasi" link (opacity-60) unlike the courses card's — kept
// faithfully even though it reads as a design inconsistency.
function TopBooksSection() {
  const t = useTranslations("Home.topBooks")
  const { books, isLoading, isError } = useTopBooks()

  return (
    <section className="flex flex-col rounded-lg bg-[#1A1D1F] p-4">
      <SectionHeading
        title={t("title")}
        actionLabel={t("seeAll")}
        actionClassName="opacity-60"
        size="sm"
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError || books.length === 0 ? (
        <EmptyState className="mt-4" message={t("empty")} />
      ) : (
        <div className="mt-2 flex flex-col divide-y divide-[#272B30]">
          {books.map((book) => (
            <BookRow key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  )
}

function BookRow({ book }: { book: BookSummary }) {
  return (
    <article className="flex items-center gap-4 py-3">
      <div className="relative h-20 w-[54px] shrink-0 overflow-hidden rounded-lg bg-dark-2">
        <Image src={book.cover} alt={book.title} fill className="object-cover" />
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

export { TopBooksSection }
