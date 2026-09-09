"use client"

import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { TextField } from "@/components/shared/form/text-field"
import { NewsGridCard } from "@/components/shared/news/news-grid-card"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsPagination } from "@/features/news/view/news-pagination"
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
    searchInput,
    updateSearch,
  } = useNewsList()

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

        <div className="relative flex h-[52px] w-full items-center rounded-lg border border-[#232627] bg-[#15181A] px-4 sm:w-[326px]">
          <SearchIcon aria-hidden className="pointer-events-none absolute left-4 size-5 text-brand-white/40" />
          <TextField
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={(event) => updateSearch(event.target.value)}
            className="h-full border-none bg-transparent pl-8 text-sm text-brand-white shadow-none placeholder:text-brand-white/40 focus-visible:ring-0"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: NEWS_PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-[251px] w-full rounded-lg" />
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsGridCard key={item.id} news={item} />
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

export { NewsListView }
