"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { EmptyState } from "@/components/shared/widget/empty-state"
import { SectionHeading } from "@/components/shared/widget/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { TopBookRow } from "@/features/top-books/view/top-book-row"
import { useTopBooks } from "@/features/top-books/viewmodel/use-top-books"

// "Barchasi" links to the Library catalog (Figma to-do section 6), which
// doesn't exist yet — see SectionHeading's placeholder CTA. Figma dims this
// particular "Barchasi" link (opacity-60) unlike the courses card's — kept
// faithfully even though it reads as a design inconsistency.
function TopBooksSection() {
  const t = useTranslations("Home.topBooks")
  const { books, isLoading, isError, refetch } = useTopBooks()

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
      ) : isError ? (
        <ErrorState className="mt-4" onRetry={refetch} />
      ) : books.length === 0 ? (
        <EmptyState className="mt-4" message={t("empty")} />
      ) : (
        <div className="mt-2 flex flex-col divide-y divide-[#272B30]">
          {books.map((book) => (
            <TopBookRow key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  )
}

export { TopBooksSection }
