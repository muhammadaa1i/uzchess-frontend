"use client"

import { FilterIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type {
  BookCategory,
  BookDifficulty,
  BookLanguage,
} from "@/features/library/book-catalog/model/book-catalog-schemas"
import {
  CatalogFilterFields,
  type CatalogFilterValues,
} from "@/features/library/book-catalog/view/catalog-filter-fields"

interface CatalogMobileFilterDialogProps {
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

// Mirrors the Courses catalog's identical mobile filter treatment (see
// ../course-catalog/view/catalog-mobile-filter-dialog.tsx) for consistency
// between the two catalogs — below `lg` the same fields render here inside a
// Dialog instead of catalog-sidebar-filter.tsx's pushed-down inline panel.
function CatalogMobileFilterDialog({
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
}: CatalogMobileFilterDialogProps) {
  const t = useTranslations("Library")

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#232627] bg-[#15181A] px-4 py-3 text-sm font-medium text-brand-white lg:hidden"
          />
        }
      >
        <FilterIcon className="size-4" />
        {t("filters.heading")}
        {hasActiveFilters && <span aria-hidden className="size-1.5 rounded-full bg-brand-blue" />}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] gap-4 overflow-y-auto lg:hidden">
        <DialogHeader className="flex-row items-center justify-between pr-6">
          <DialogTitle>{t("filters.heading")}</DialogTitle>
          {hasActiveFilters && (
            <Button variant="link" size="sm" onClick={onClear} className="h-auto p-0 text-brand-blue">
              {t("filters.clear")}
            </Button>
          )}
        </DialogHeader>

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

        <DialogClose render={<Button className="w-full" />}>{t("filters.apply")}</DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export { CatalogMobileFilterDialog }
