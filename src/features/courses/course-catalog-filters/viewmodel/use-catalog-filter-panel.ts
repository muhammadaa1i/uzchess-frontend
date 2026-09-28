import { useTranslations } from "next-intl"

import {
  type CourseCategory,
  type CourseDifficulty,
  type CourseLanguage,
  translateCategoryTitle,
  translateDifficultyDegree,
  translateLanguageTitle,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-schemas"
import { useCourseCatalogReferenceData } from "@/features/courses/course-catalog-reference-data/viewmodel/use-course-catalog-reference-data"

interface UseCatalogFilterPanelOptions {
  anyCategory: string
  anyDifficulty: string
  anyLanguage: string
}

// Owns this slice's state/business logic per CLAUDE.md's MVVM mandate — the
// sibling course-catalog-reference-data fetch plus the id-to-label lookups
// the filter Selects need — so catalog-filter-panel.tsx (View) stays a dumb
// component that only renders. base-ui's Select.Value renders the raw
// `value` string (e.g. the "any" sentinel or a numeric id) unless told how
// to turn a value into a label — it does not read the matching SelectItem's
// children — hence the three label functions below. Mirrors Library's
// identical use-catalog-filter-panel.ts.
function useCatalogFilterPanel({
  anyCategory,
  anyDifficulty,
  anyLanguage,
}: UseCatalogFilterPanelOptions) {
  const t = useTranslations("Courses")
  const difficultyLabels = (t.raw as (key: string) => Record<string, string>)("difficultyLevels")
  const categoryLabels = (t.raw as (key: string) => Record<string, string>)("categoryLabels")
  const languageLabels = (t.raw as (key: string) => Record<string, string>)("languageLabels")
  const { categories, difficulties, languages } = useCourseCatalogReferenceData()

  const categoryById = new Map<number, CourseCategory>(
    categories.map((category) => [category.id, category])
  )
  const difficultyById = new Map<number, CourseDifficulty>(
    difficulties.map((difficulty) => [difficulty.id, difficulty])
  )
  const languageById = new Map<number, CourseLanguage>(
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
    const title = languageById.get(Number(value))?.title
    return title ? translateLanguageTitle(languageLabels, title) : t("filters.language")
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
    languageLabels,
  }
}

export { useCatalogFilterPanel }
