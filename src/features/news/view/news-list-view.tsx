"use client"

import { useTranslations } from "next-intl"
import type { MouseEvent } from "react"

import { ErrorState } from "@/components/shared/error-state"
import { NewsCard } from "@/components/shared/news-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useNewsList } from "@/features/news/viewmodel/use-news-list"

const NEWS_PAGE_SIZE = 12

function NewsListView() {
  const t = useTranslations("News")
  const {
    news,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
  } = useNewsList()

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      {isLoading ? (
        <div className="flex flex-col divide-y divide-[#272B30]">
          {Array.from({ length: NEWS_PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="my-3 h-[120px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : news.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-[#272B30]">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
          {totalPages > 1 && (
            <NewsPagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

interface NewsPaginationProps {
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function NewsPagination({
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: NewsPaginationProps) {
  const t = useTranslations("News.pagination")

  function goTo(nextPage: number) {
    return (event: MouseEvent) => {
      event.preventDefault()
      onPageChange(nextPage)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("previous")}
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page - 1)}
          />
        </PaginationItem>
        {getPageNumbers(page, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink href="#" isActive={entry === page} onClick={goTo(entry)}>
                {entry}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            text={t("next")}
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

// Windows the visible page numbers around the current page (first, last,
// current -1/current/current +1), collapsing long runs into an ellipsis —
// same helper as the Ranking page's pagination (src/features/ranking/view/ranking-view.tsx),
// duplicated rather than shared per CLAUDE.md's code-splitting mandate.
function getPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const keep = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...keep].filter((value) => value >= 1 && value <= total).sort((a, b) => a - b)

  const result: Array<number | "ellipsis"> = []
  let previous = 0
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push("ellipsis")
    result.push(value)
    previous = value
  }
  return result
}

export { NewsListView }
