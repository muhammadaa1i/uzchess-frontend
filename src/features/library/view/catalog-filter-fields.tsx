"use client"

import { useTranslations } from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type BookCategory,
  type BookDifficulty,
  type BookLanguage,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/library/model/book-schemas"
import { CatalogFilterGroup } from "@/features/library/view/catalog-filter-group"
import { RatingStarFilter } from "@/features/library/view/catalog-rating-star-filter"

interface CatalogFilterValues {
  categoryId: string
  difficultyId: string
  languageId: string
  minRating: string
}

interface CatalogFilterFieldsProps {
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

// The field set shared by the desktop inline sidebar and the mobile Dialog
// (see the "filter(responsive)" Figma frame) — kept as one component so the
// two surfaces can never drift out of sync with each other.
function CatalogFilterFields({
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
}: CatalogFilterFieldsProps) {
  const t = useTranslations("Library")

  return (
    <>
      <CatalogFilterGroup label={t("filters.languageLabel")}>
        <Select
          value={filters.languageId}
          onValueChange={(value) => value && updateFilter("languageId", value)}
        >
          <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
            <SelectValue placeholder={t("filters.language")}>{languageLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={anyLanguage}>{t("filters.any")}</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language.id} value={String(language.id)}>
                {language.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CatalogFilterGroup>

      <CatalogFilterGroup label={t("filters.difficultyLabel")}>
        <Select
          value={filters.difficultyId}
          onValueChange={(value) => value && updateFilter("difficultyId", value)}
        >
          <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
            <SelectValue placeholder={t("filters.difficulty")}>{difficultyLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={anyDifficulty}>{t("filters.any")}</SelectItem>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.id} value={String(difficulty.id)}>
                {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CatalogFilterGroup>

      <CatalogFilterGroup label={t("filters.categoryLabel")}>
        <Select
          value={filters.categoryId}
          onValueChange={(value) => value && updateFilter("categoryId", value)}
        >
          <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
            <SelectValue placeholder={t("filters.category")}>{categoryLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={anyCategory}>{t("filters.any")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {translateCategoryTitle(categoryLabels, category.title)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CatalogFilterGroup>

      <CatalogFilterGroup label={t("filters.ratingLabel")}>
        <RatingStarFilter
          value={filters.minRating}
          anyRating={anyRating}
          onChange={(value) => updateFilter("minRating", value)}
        />
      </CatalogFilterGroup>
    </>
  )
}

export { CatalogFilterFields }
export type { CatalogFilterValues }
