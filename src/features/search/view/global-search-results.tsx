"use client"

import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { SearchResultItem } from "@/features/search/model/search-schemas"
import type { SearchResultGroup } from "@/features/search/viewmodel/use-global-search"
import { Link } from "@/lib/i18n/navigation"

interface GlobalSearchResultsProps {
  isSearchable: boolean
  isLoading: boolean
  isError: boolean
  groups: SearchResultGroup[]
  hasResults: boolean
  onNavigate: () => void
}

// Purely presentational — the four states (below min length / loading /
// error / results, with "no results" folded into the results branch) are
// all driven by props from useGlobalSearch, nothing fetched here.
function GlobalSearchResults({
  isSearchable,
  isLoading,
  isError,
  groups,
  hasResults,
  onNavigate,
}: GlobalSearchResultsProps) {
  const t = useTranslations("Search")

  if (!isSearchable) {
    return <p className="px-1 py-6 text-center text-sm text-brand-secondary-low">{t("hint")}</p>
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 py-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-1 py-2">
            <Skeleton className="size-12 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState className="border-none bg-transparent py-6" />
  }

  if (!hasResults) {
    return <p className="px-1 py-6 text-center text-sm text-brand-secondary-low">{t("empty")}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.type} className="flex flex-col gap-1">
          <h3 className="px-1 text-xs font-medium tracking-wide text-brand-secondary uppercase">
            {t(`groups.${group.type}`)}
          </h3>
          <div className="flex flex-col">
            {group.items.map((item) => (
              <SearchResultRow key={`${item.type}-${item.id}`} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchResultRow({
  item,
  onNavigate,
}: {
  item: SearchResultItem
  onNavigate: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-dark-2"
    >
      <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-dark-2">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill sizes="48px" className="object-cover" />
        ) : (
          <ImageIcon className="size-5 text-brand-secondary" aria-hidden />
        )}
      </div>
      <span className="line-clamp-2 text-sm text-brand-white">{item.title}</span>
    </Link>
  )
}

export { GlobalSearchResults }
