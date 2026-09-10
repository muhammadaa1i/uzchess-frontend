import { z } from "zod"

// GET /courses/read/{id} — GetCoursesByIdResponse. Shares the same base
// fields as course-catalog's `courseListItemSchema` (both come from the
// same backend `Course` entity) — duplicated here rather than imported from
// course-catalog per CLAUDE.md's code-splitting mandate (each feature's
// model layer is self-contained, reachable only through its own route).
// `authorIds` is carried through for shape-fidelity with the live response
// but isn't rendered anywhere in this feature — no course-authors display
// was requested in CLAUDE.md's Education/Courses to-do, unlike Library's
// author byline.
const courseDetailBaseSchema = z.object({
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

// CourseLessonDto (the public, non-progress-aware lesson shape) always
// exposes `video`, unlike the auth'd/progress-aware CourseLessonProgressDto
// in lessons/model/course-progress-schemas.ts, which nulls it out for locked
// lessons — this detail page only ever renders titles/durations/isFree from
// this shape, never plays the video inline (that happens on the separate
// lesson-viewing route, driven by the progress-aware shape instead).
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

const courseDetailSchema = courseDetailBaseSchema.extend({
  sections: z.array(courseSectionSchema),
})

// GET /courses/purchased — GetCoursePurchasesResponse (see /swagger/account).
const coursePurchaseSchema = courseDetailBaseSchema

// GET /courses/categories/read — GetCourseCategoriesResponse. Own copy of
// course-catalog's identical schema, used here only to label the category
// badge on the detail page.
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

// GET /difficulty/read — GetDifficultiesResponse (see /swagger/books). Own
// copy of course-catalog's identical schema, used here only to label the
// difficulty badge on the detail page. `degree` is a free-text
// admin-entered label (e.g. "Beginner"), not a fixed enum, so it's rendered
// as-is rather than mapped through
// @/components/shared/chess/difficulty-badge's fixed
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

type CourseDetail = z.infer<typeof courseDetailSchema>
type CourseSection = z.infer<typeof courseSectionSchema>
type CourseLesson = z.infer<typeof courseLessonSchema>
type CoursePurchase = z.infer<typeof coursePurchaseSchema>
type CourseCategory = z.infer<typeof courseCategorySchema>
type CourseDifficulty = z.infer<typeof courseDifficultySchema>

export {
  courseCategorySchema,
  courseDetailSchema,
  courseDifficultySchema,
  courseLessonSchema,
  coursePurchaseSchema,
  courseSectionSchema,
  createPurchaseRequestSchema,
  createPurchaseResponseSchema,
  purchaseProviderSchema,
  purchaseStatusSchema,
  translateCategoryTitle,
  translateDifficultyDegree,
}
export type {
  CourseCategory,
  CourseDetail,
  CourseDifficulty,
  CourseLesson,
  CoursePurchase,
  CourseSection,
}
