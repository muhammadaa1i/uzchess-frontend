"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  BookAuthor,
  BookCategory,
  BookDifficulty,
  BookLanguage,
  BookListItem,
} from "@/features/book-catalog/model/book-catalog-schemas"
import { BookListCard } from "@/features/book-catalog/view/book-list-card"
import { CatalogPagination } from "@/features/book-catalog/view/catalog-pagination"

interface CatalogResultsProps {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  books: BookListItem[]
  categoryById: Map<number, BookCategory>
  difficultyById: Map<number, BookDifficulty>
  languageById: Map<number, BookLanguage>
  authorsById: Map<number, BookAuthor>
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function CatalogResults({
  isLoading,
  isError,
  onRetry,
  books,
  categoryById,
  difficultyById,
  languageById,
  authorsById,
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: CatalogResultsProps) {
  const t = useTranslations("Library")

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      {isLoading ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[141px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : books.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {books.map((book) => (
              <BookListCard
                key={book.id}
                book={book}
                category={categoryById.get(book.categoryId)}
                difficulty={difficultyById.get(book.difficultyId)}
                language={languageById.get(book.languageId)}
                authors={book.authorIds.flatMap((id) => {
                  const author = authorsById.get(id)
                  return author ? [author] : []
                })}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export { CatalogResults }
