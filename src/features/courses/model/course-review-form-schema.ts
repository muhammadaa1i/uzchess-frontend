import { z } from "zod"

// The exact leaf keys under the "Courses.reviews.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// auth-form-schemas.ts's ValidationKey, kept local to this feature per
// CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey = "scoreRequired" | "commentTooLong"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the course review submission form. Mirrors the
// backend's CreateCourseRatingRequest (score 1-5 required, comment optional,
// max 1000 chars — see create-rating.request.ts) exactly; `score: 0` is the
// form's "nothing selected yet" sentinel since a real HTML radio/star input
// can't have an empty numeric value.
function createReviewFormSchema(t: ValidationT) {
  return z.object({
    score: z.number().int().min(1, t("scoreRequired")).max(5),
    comment: z.string().trim().max(1000, t("commentTooLong")).optional(),
  })
}

type ReviewFormValues = z.infer<ReturnType<typeof createReviewFormSchema>>

export { createReviewFormSchema }
export type { ReviewFormValues }
