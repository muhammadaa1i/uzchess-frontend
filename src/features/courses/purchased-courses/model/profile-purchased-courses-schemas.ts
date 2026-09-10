import { z } from "zod"

// GET /courses/purchased (GetCoursePurchasesResponse[]) — verified against
// the live /swagger/account-json and /swagger/courses-json specs to return
// the exact same base course shape as Courses' own `courseBaseSchema`.
// Duplicated here rather than imported across the feature boundary, per
// CLAUDE.md's code-splitting mandate.
const profileCourseItemSchema = z.object({
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

type ProfileCourseItem = z.infer<typeof profileCourseItemSchema>

export { profileCourseItemSchema }
export type { ProfileCourseItem }
