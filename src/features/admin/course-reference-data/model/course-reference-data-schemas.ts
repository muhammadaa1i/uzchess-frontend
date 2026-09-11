import { z } from "zod"

// GET /courses/categories/read — GetCourseCategoriesResponse (plain array,
// not paginated, per the live /swagger/courses-json spec). Course-specific
// (not shared with Book categories, unlike difficulty/language/authors
// below) — duplicated here per CLAUDE.md's code-splitting mandate. This
// slice only feeds the course-editor create/edit form's read-only reference
// selects, not a categories sub-catalog CRUD (explicitly out of scope, see
// CLAUDE.md's admin-panel deferred backlog).
const courseCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

// GET /authors/read — GetAuthorsResponse (from the books swagger group; the
// live /swagger/courses-json spec has no course-specific authors list, and
// CreateCourseRequest/UpdateCourseRequest's `authorIds` field references the
// same Author entity as Book — confirmed against the live spec's shared
// numeric id shape).
const courseAuthorSchema = z.object({
  id: z.number(),
  fullName: z.string(),
})

// GET /difficulty/read — GetDifficultiesResponse (from the books swagger
// group — no course-specific difficulty list exists; CreateCourseRequest/
// UpdateCourseRequest's `difficultyId` references the same Difficulty
// entity as Book).
const courseDifficultySchema = z.object({
  id: z.number(),
  degree: z.string(),
  icon: z.string(),
})

// GET /languages/read — GetLanguagesResponse (from the books swagger
// group — no course-specific language list exists; CreateCourseRequest/
// UpdateCourseRequest's `languageId` references the same Language entity as
// Book).
const courseLanguageSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
})

type CourseCategory = z.infer<typeof courseCategorySchema>
type CourseAuthor = z.infer<typeof courseAuthorSchema>
type CourseDifficulty = z.infer<typeof courseDifficultySchema>
type CourseLanguage = z.infer<typeof courseLanguageSchema>

export { courseAuthorSchema, courseCategorySchema, courseDifficultySchema, courseLanguageSchema }
export type { CourseAuthor, CourseCategory, CourseDifficulty, CourseLanguage }
