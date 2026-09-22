import { useTranslations } from "next-intl"

import {
  type BookCategory,
  type BookDifficulty,
  type BookLanguage,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"
import { useBookCatalogReferenceData } from "@/features/library/book-catalog-reference-data/viewmodel/use-book-catalog-reference-data"

interface UseCatalogFilterPanelOptions {
  anyCategory: string
  anyDifficulty: string
  anyLanguage: string
}

// Owns this slice's state/business logic per CLAUDE.md's MVVM mandate — the
// sibling book-catalog-reference-data fetch plus the id-to-label lookups the
// filter Selects need — so catalog-filter-panel.tsx (View) stays a dumb
// component that only renders. base-ui's Select.Value renders the raw
// `value` string (e.g. the "any" sentinel or a numeric id) unless told how
// to turn a value into a label — it does not read the matching SelectItem's
// children — hence the three label functions below.
function useCatalogFilterPanel({
  anyCategory,
  anyDifficulty,
  anyLanguage,
}: UseCatalogFilterPanelOptions) {
  const t = useTranslations("Library")
  const difficultyLabels = (t.raw as (key: string) => Record<string, string>)("difficultyLevels")
  const categoryLabels = (t.raw as (key: string) => Record<string, string>)("categoryLabels")
  const { categories, difficulties, languages } = useBookCatalogReferenceData()

  const categoryById = new Map<number, BookCategory>(
    categories.map((category) => [category.id, category])
  )
  const difficultyById = new Map<number, BookDifficulty>(
    difficulties.map((difficulty) => [difficulty.id, difficulty])
  )
  const languageById = new Map<number, BookLanguage>(
    languages.map((language) => [language.id, language])
  )

  function categoryLabel(value: string) {
    if (value === anyCategory) return t("filters.any")
    const title = categoryById.get(Number(value))?.title
    return title ? translateCategoryTitle(categoryLabels, title) : t("filters.category")
  }
  function difficultyLabel(value: string) {
    if (value === anyDifficulty) return t("filters.any")
    const degree = difficultyById.get(Number(value))?.degree
    return degree ? translateDifficultyDegree(difficultyLabels, degree) : t("filters.difficulty")
  }
  function languageLabel(value: string) {
    if (value === anyLanguage) return t("filters.any")
    return languageById.get(Number(value))?.title ?? t("filters.language")
  }

  return {
    categories,
    difficulties,
    languages,
    categoryLabel,
    difficultyLabel,
    languageLabel,
    difficultyLabels,
    categoryLabels,
  }
}

export { useCatalogFilterPanel }
