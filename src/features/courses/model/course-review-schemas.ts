import { z } from "zod"

import { paginatedSchema } from "@/features/courses/model/course-schemas"

// GET /courses/reviews/{id} — GetCourseReviewsResponse, paginated via
// PaginatedGetCourseReviewsResponse. Public endpoint (no auth required to
// read reviews) — only *submitting* a review is gated, see CreateRatingHandler
// in the backend, which requires the caller to hold a Certificate for this
// course (i.e. have completed it). The UI reflects that gate in
// use-course-reviews.ts rather than re-deriving it from this response.
const courseReviewSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userFullName: z.string(),
  score: z.number(),
  comment: z.string().nullable().optional(),
  createdAt: z.string(),
})

const paginatedCourseReviewsSchema = paginatedSchema(courseReviewSchema)

// POST /courses/rate/{id} — CreateCourseRatingRequest/CreateCourseRatingResponse.
// Doubles as create-or-update (the backend upserts on the (courseId, userId)
// pair), so a single "submit" mutation covers both first-time review and
// editing an existing one.
const createCourseRatingRequestSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000).optional(),
})

const createCourseRatingResponseSchema = z.object({
  courseId: z.number(),
  score: z.number(),
  comment: z.string().nullable().optional(),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

type CourseReview = z.infer<typeof courseReviewSchema>

export {
  courseReviewSchema,
  createCourseRatingRequestSchema,
  createCourseRatingResponseSchema,
  paginatedCourseReviewsSchema,
}
export type { CourseReview }
