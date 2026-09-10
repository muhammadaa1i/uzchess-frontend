import { z } from "zod"

// GET /courses/top-rated — GetTopRatedCoursesResponse (see /swagger/courses).
// Duplicated from the Live feature's identical schema rather than imported —
// each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate.
const courseSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  sectionsCount: z.number(),
  lessonsCount: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
  purchasesCount: z.number(),
})

const coursesResponseSchema = z.array(courseSummarySchema)

type CourseSummary = z.infer<typeof courseSummarySchema>

export { coursesResponseSchema, courseSummarySchema }
export type { CourseSummary }
