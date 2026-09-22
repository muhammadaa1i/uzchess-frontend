"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type {
  BookCategory,
  BookDifficulty,
  BookLanguage,
} from "@/features/library/book-catalog/model/book-catalog-schemas"
import {
  CatalogFilterFields,
  type CatalogFilterValues,
} from "@/features/library/book-catalog/view/catalog-filter-fields"

interface CatalogSidebarFilterProps {
  hasActiveFilters: boolean
  onClear: () => void
  filters: CatalogFilterValues
  updateFilter: (key: keyof CatalogFilterValues, value: string) => void
  difficulties: BookDifficulty[]
  categories: BookCategory[]
  languages: BookLanguage[]
  anyDifficulty: string
  anyCategory: string
  anyLanguage: string
  anyRating: string
  difficultyLabel: (value: string) => string
  categoryLabel: (value: string) => string
  languageLabel: (value: string) => string
  difficultyLabels: Record<string, string>
  categoryLabels: Record<string, string>
}

// Desktop/tablet sidebar — inline, always visible from `lg` up. See
// catalog-mobile-filter-dialog.tsx for the below-`lg` equivalent, which
// renders the same CatalogFilterFields inside a Dialog instead.
function CatalogSidebarFilter({
  hasActiveFilters,
  onClear,
  filters,
  updateFilter,
  difficulties,
  categories,
  languages,
  anyDifficulty,
  anyCategory,
  anyLanguage,
  anyRating,
  difficultyLabel,
  categoryLabel,
  languageLabel,
  difficultyLabels,
  categoryLabels,
}: CatalogSidebarFilterProps) {
  const t = useTranslations("Library")

  return (
    <aside className="hidden w-full shrink-0 flex-col gap-6 rounded-lg border border-[#1F272A] bg-dark p-5 lg:flex lg:w-[326px]">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-brand-white">{t("filters.heading")}</span>
        {hasActiveFilters && (
          <Button variant="link" size="sm" onClick={onClear} className="h-auto p-0 text-brand-blue">
            {t("filters.clear")}
          </Button>
        )}
      </div>

      <CatalogFilterFields
        filters={filters}
        updateFilter={updateFilter}
        difficulties={difficulties}
        categories={categories}
        languages={languages}
        anyDifficulty={anyDifficulty}
        anyCategory={anyCategory}
        anyLanguage={anyLanguage}
        anyRating={anyRating}
        difficultyLabel={difficultyLabel}
        categoryLabel={categoryLabel}
        languageLabel={languageLabel}
        difficultyLabels={difficultyLabels}
        categoryLabels={categoryLabels}
      />
    </aside>
  )
}

export { CatalogSidebarFilter }
