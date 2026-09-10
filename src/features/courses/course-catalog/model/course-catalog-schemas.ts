import { z } from "zod"

function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    data: z.array(itemSchema),
  })
}

// GET /courses/read — GetCoursesResponse, paginated via PaginatedGetCoursesResponse.
// `authorIds` is carried through for shape-fidelity with the live response
// but isn't rendered anywhere in this feature — no course-authors display
// was requested in CLAUDE.md's Education/Courses to-do, unlike Library's
// author byline.
const courseListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  sectionsCount: z.number(),
  lessonsCount: z.number(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

const paginatedCoursesSchema = paginatedSchema(courseListItemSchema)

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
// (e.g. "Beginner"), not a fixed enum, so it's rendered as-is rather than
// mapped through @/components/shared/chess/difficulty-badge's fixed
// beginner/amateur/professional union.
const courseDifficultySchema = z.object({
  id: z.number(),
  degree: z.string(),
  icon: z.string(),
})

// `degree` is free text (see above), but in practice the admin-entered
// values are drawn from a small, stable set ("Beginner"/"Intermediate"/
// "Advanced") — translated via Courses.difficultyLevels in the message
// files. Falls back to the raw value for anything outside that set rather
// than guessing a translation.
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

type CourseListItem = z.infer<typeof courseListItemSchema>
type CourseCategory = z.infer<typeof courseCategorySchema>
type CourseDifficulty = z.infer<typeof courseDifficultySchema>
type CourseLanguage = z.infer<typeof courseLanguageSchema>

export {
  courseCategorySchema,
  courseDifficultySchema,
  courseLanguageSchema,
  courseListItemSchema,
  paginatedCoursesSchema,
  paginatedSchema,
  translateCategoryTitle,
  translateDifficultyDegree,
}
export type { CourseCategory, CourseDifficulty, CourseLanguage, CourseListItem }
