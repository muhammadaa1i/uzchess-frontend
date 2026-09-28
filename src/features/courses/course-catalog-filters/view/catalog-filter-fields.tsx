"use client"

import { useTranslations } from "next-intl"

import type { CatalogFilterValues } from "@/features/courses/course-catalog-filters/model/catalog-filter-schemas"
import { CatalogFilterGroup } from "@/features/courses/course-catalog-filters/view/catalog-filter-group"
import { RatingStarFilter } from "@/features/courses/course-catalog-filters/view/catalog-rating-star-filter"
import type {
  CourseCategory,
  CourseDifficulty,
  CourseLanguage,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-schemas"
import { CatalogCategorySelect } from "@/features/courses/course-catalog-reference-data/view/catalog-category-select"
import { CatalogDifficultySelect } from "@/features/courses/course-catalog-reference-data/view/catalog-difficulty-select"
import { CatalogLanguageSelect } from "@/features/courses/course-catalog-reference-data/view/catalog-language-select"

interface CatalogFilterFieldsProps {
  filters: CatalogFilterValues
  updateFilter: (key: keyof CatalogFilterValues, value: string) => void
  difficulties: CourseDifficulty[]
  categories: CourseCategory[]
  languages: CourseLanguage[]
  anyDifficulty: string
  anyCategory: string
  anyLanguage: string
  anyRating: string
  difficultyLabel: (value: string) => string
  categoryLabel: (value: string) => string
  languageLabel: (value: string) => string
  difficultyLabels: Record<string, string>
  categoryLabels: Record<string, string>
  languageLabels: Record<string, string>
}

// The field set shared by the desktop inline sidebar and the mobile Dialog
// (see the "filter(responsive)" Figma frame) — kept as one component so the
// two surfaces can never drift out of sync with each other. Composes the
// sibling course-catalog-reference-data slice's own picker widgets (View
// reuse across sibling slices, same pattern as Library's
// book-catalog-filters/catalog-filter-fields.tsx composing
// book-catalog-reference-data's field components) rather than rendering
// Select markup inline.
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
  languageLabels,
}: CatalogFilterFieldsProps) {
  const t = useTranslations("Courses")

  return (
    <>
      <CatalogFilterGroup label={t("filters.difficultyLabel")}>
        <CatalogDifficultySelect
          difficulties={difficulties}
          value={filters.difficultyId}
          onValueChange={(value) => updateFilter("difficultyId", value)}
          anyValue={anyDifficulty}
          anyLabel={t("filters.any")}
          placeholder={t("filters.difficulty")}
          currentLabel={difficultyLabel}
          difficultyLabels={difficultyLabels}
        />
      </CatalogFilterGroup>

      <CatalogFilterGroup label={t("filters.categoryLabel")}>
        <CatalogCategorySelect
          categories={categories}
          value={filters.categoryId}
          onValueChange={(value) => updateFilter("categoryId", value)}
          anyValue={anyCategory}
          anyLabel={t("filters.any")}
          placeholder={t("filters.category")}
          currentLabel={categoryLabel}
          categoryLabels={categoryLabels}
        />
      </CatalogFilterGroup>

      <CatalogFilterGroup label={t("filters.languageLabel")}>
        <CatalogLanguageSelect
          languages={languages}
          value={filters.languageId}
          onValueChange={(value) => updateFilter("languageId", value)}
          anyValue={anyLanguage}
          anyLabel={t("filters.any")}
          placeholder={t("filters.language")}
          currentLabel={languageLabel}
          languageLabels={languageLabels}
        />
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
