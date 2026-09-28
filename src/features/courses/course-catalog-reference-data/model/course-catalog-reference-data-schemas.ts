import { z } from "zod"

// GET /courses/categories/read — GetCourseCategoriesResponse.
const courseCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

// `title` is free-text admin-entered content, drawn in practice from a
// small, stable set (e.g. "Taktika") — translated via Courses.categoryLabels
// in the message files, same rationale/fallback as translateDifficultyDegree
// below.
function translateCategoryTitle(labels: Record<string, string>, title: string): string {
  return labels[title] ?? title
}

// GET /difficulty/read — GetDifficultiesResponse (see /swagger/books). Lives
// in the books swagger group but is shared with courses via `difficultyId`
// (confirmed against the live spec — courses has no difficulty-specific
// list endpoint of its own). `degree` is a free-text admin-entered label
// (e.g. "Boshlang'ich"), not a fixed enum, so it's rendered as-is rather
// than mapped through @/components/shared/chess/difficulty-badge's fixed
// beginner/amateur/professional union.
const courseDifficultySchema = z.object({
  id: z.number(),
  degree: z.string(),
  icon: z.string(),
})

// `degree` is free text (see above), but in practice the admin-entered
// values are drawn from a small, stable set — translated via
// Courses.difficultyLevels in the message files. Falls back to the raw
// value for anything outside that set rather than guessing a translation.
function translateDifficultyDegree(labels: Record<string, string>, degree: string): string {
  return labels[degree] ?? degree
}

// GET /languages/read — GetLanguagesResponse (see /swagger/books), shared
// with courses via `languageId` the same way difficulty is.
const courseLanguageSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
})

// `title` is a real language name, but the backend returns it as
// admin-entered free text in a single locale (e.g. "O'zbek") rather than a
// fixed ISO-derived label — translated via Courses.languageLabels the same
// way category/difficulty are, with a fallback to the raw value.
function translateLanguageTitle(labels: Record<string, string>, title: string): string {
  return labels[title] ?? title
}

type CourseCategory = z.infer<typeof courseCategorySchema>
type CourseDifficulty = z.infer<typeof courseDifficultySchema>
type CourseLanguage = z.infer<typeof courseLanguageSchema>

export {
  courseCategorySchema,
  courseDifficultySchema,
  courseLanguageSchema,
  translateCategoryTitle,
  translateDifficultyDegree,
  translateLanguageTitle,
}
export type { CourseCategory, CourseDifficulty, CourseLanguage }
