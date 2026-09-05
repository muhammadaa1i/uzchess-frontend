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

// Shared by GetCoursesResponse / GetCoursesByIdResponse / GetCoursePurchasesResponse
// / GetCourseFavouritesResponse (see /swagger/courses and /swagger/account) — all
// four response shapes carry the same base course fields, only the detail
// response adds `sections`. `authorIds` is carried through for shape-fidelity
// with the live response but isn't rendered anywhere in this feature — no
// course-authors display was requested in CLAUDE.md's Education/Courses
// to-do, unlike Library's author byline.
const courseBaseSchema = z.object({
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

// GET /courses/read — GetCoursesResponse, paginated via PaginatedGetCoursesResponse.
const courseListItemSchema = courseBaseSchema
const paginatedCoursesSchema = paginatedSchema(courseListItemSchema)

// GET /courses/read/{id} — GetCoursesByIdResponse. CourseLessonDto (the
// public, non-progress-aware lesson shape) always exposes `video`, unlike
// the auth'd/progress-aware CourseLessonProgressDto in course-progress-schemas.ts,
// which nulls it out for locked lessons — the detail page only ever renders
// titles/durations/isFree from this shape, never plays the video inline.
const courseLessonSchema = z.object({
  id: z.number(),
  title: z.string(),
  video: z.string(),
  thumbnail: z.string().nullable().optional(),
  duration: z.number(),
  order: z.number(),
  isFree: z.boolean(),
})

const courseSectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(courseLessonSchema),
})

const courseDetailSchema = courseBaseSchema.extend({
  sections: z.array(courseSectionSchema),
})

// GET /courses/categories/read — GetCourseCategoriesResponse.
const courseCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

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

// GET /languages/read — GetLanguagesResponse (see /swagger/books), shared
// with courses via `languageId` the same way difficulty is.
const courseLanguageSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
})

// GET /courses/purchased — GetCoursePurchasesResponse (see /swagger/account).
const coursePurchaseSchema = courseBaseSchema

// POST /courses/{id}/purchase — CreatePurchaseRequest/CreatePurchaseResponse.
// The backend's CreatePurchaseHandler is a mocked/instant payment flow (sets
// the purchase straight to "success", no real gateway redirect), but the
// request still requires picking a `provider` — kept as a real field here
// rather than hardcoding one, since the backend validates it.
const purchaseProviderSchema = z.enum(["paylov", "payme", "click", "uzum"])
const createPurchaseRequestSchema = z.object({ provider: purchaseProviderSchema })
const purchaseStatusSchema = z.enum(["pending", "success", "failed"])
const createPurchaseResponseSchema = z.object({
  id: z.number(),
  courseId: z.number(),
  userId: z.number(),
  status: purchaseStatusSchema,
})

type CourseListItem = z.infer<typeof courseListItemSchema>
type CourseDetail = z.infer<typeof courseDetailSchema>
type CourseSection = z.infer<typeof courseSectionSchema>
type CourseLesson = z.infer<typeof courseLessonSchema>
type CourseCategory = z.infer<typeof courseCategorySchema>
type CourseDifficulty = z.infer<typeof courseDifficultySchema>
type CourseLanguage = z.infer<typeof courseLanguageSchema>
type CoursePurchase = z.infer<typeof coursePurchaseSchema>

export {
  courseCategorySchema,
  courseDetailSchema,
  courseDifficultySchema,
  courseLanguageSchema,
  courseLessonSchema,
  courseListItemSchema,
  coursePurchaseSchema,
  courseSectionSchema,
  createPurchaseRequestSchema,
  createPurchaseResponseSchema,
  paginatedCoursesSchema,
  paginatedSchema,
  purchaseProviderSchema,
  purchaseStatusSchema,
}
export type {
  CourseCategory,
  CourseDetail,
  CourseDifficulty,
  CourseLanguage,
  CourseLesson,
  CourseListItem,
  CoursePurchase,
  CourseSection,
}
