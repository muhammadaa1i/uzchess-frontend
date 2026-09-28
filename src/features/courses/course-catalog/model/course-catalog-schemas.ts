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
// author byline. The category/difficulty/language *reference* schemas this
// list's ids resolve against live in the sibling
// course-catalog-reference-data slice, not here — see that slice's
// course-catalog-reference-data-schemas.ts.
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

type CourseListItem = z.infer<typeof courseListItemSchema>

export { courseListItemSchema, paginatedCoursesSchema, paginatedSchema }
export type { CourseListItem }
