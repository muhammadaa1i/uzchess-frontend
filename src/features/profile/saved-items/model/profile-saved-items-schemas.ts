import { z } from "zod"

// GET /courses/favourites (GetCourseFavouritesResponse[]) — verified against
// the live /swagger/courses-json spec to return the exact same base course
// shape as Courses' own `courseBaseSchema`. Duplicated here rather than
// imported across the feature boundary, per CLAUDE.md's code-splitting
// mandate (same shape as purchased-courses' identical-looking copy, kept
// separate since each feature's model layer is self-contained).
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

// GET /favourites/read — GetFavouritesResponse[] (see /swagger/account), the
// "saved products" (books) list per CLAUDE.md's terminology note — same base
// shape as Library's `bookBaseSchema`, duplicated for the same reason.
const profileBookItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  pageCount: z.number(),
  publishedYear: z.number(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

type ProfileCourseItem = z.infer<typeof profileCourseItemSchema>
type ProfileBookItem = z.infer<typeof profileBookItemSchema>

export { profileBookItemSchema, profileCourseItemSchema }
export type { ProfileBookItem, ProfileCourseItem }
