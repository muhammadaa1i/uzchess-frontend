"use client"

import type { CatalogFilterValues } from "@/features/library/book-catalog-filters/model/catalog-filter-schemas"
import { CatalogMobileFilterDialog } from "@/features/library/book-catalog-filters/view/catalog-mobile-filter-dialog"
import { CatalogSidebarFilter } from "@/features/library/book-catalog-filters/view/catalog-sidebar-filter"
import { useCatalogFilterPanel } from "@/features/library/book-catalog-filters/viewmodel/use-catalog-filter-panel"

interface CatalogFilterPanelProps {
  hasActiveFilters: boolean
  onClear: () => void
  filters: CatalogFilterValues
  updateFilter: (key: keyof CatalogFilterValues, value: string) => void
  anyCategory: string
  anyDifficulty: string
  anyLanguage: string
  anyRating: string
}

// The whole filter concern (desktop sidebar + mobile dialog, both driven by
// the shared CatalogFilterFields field set) as one self-contained widget —
// a dumb View per CLAUDE.md's MVVM mandate, with all data-fetching and
// label-lookup logic delegated to use-catalog-filter-panel.ts. The parent
// catalog view only has to hand this the actual filter *state*
// (`filters`/`updateFilter`/`hasActiveFilters`/`onClear`, owned by
// use-book-catalog since it also drives the `getBooks` query) plus the
// `anyX` sentinel constants, rather than threading reference data and
// label-lookup functions through it itself.
function CatalogFilterPanel({
  hasActiveFilters,
  onClear,
  filters,
  updateFilter,
  anyCategory,
  anyDifficulty,
  anyLanguage,
  anyRating,
}: CatalogFilterPanelProps) {
  const {
    categories,
    difficulties,
    languages,
    categoryLabel,
    difficultyLabel,
    languageLabel,
    difficultyLabels,
    categoryLabels,
  } = useCatalogFilterPanel({ anyCategory, anyDifficulty, anyLanguage })

  const sharedProps = {
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
  }

  return (
    <>
      <CatalogSidebarFilter {...sharedProps} />
      <CatalogMobileFilterDialog {...sharedProps} />
    </>
  )
}

export { CatalogFilterPanel }
