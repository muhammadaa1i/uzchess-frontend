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

// GET /courses/read — GetCoursesResponse, paginated via
// PaginatedGetCoursesResponse (see /swagger/courses-json). POST
// /courses/create and PATCH /courses/update/{id} (course-editor's own
// endpoints) both return this same shape minus sectionsCount/lessonsCount/
// averageRating/ratingsCount (CreateCourseResponse/UpdateCourseResponse per
// the live spec), but those fields are optional here so one schema covers
// list rows and mutation responses alike, same "one schema, no separate
// detail shape" reasoning as book-list-schemas.ts. Duplicated from the
// public course-catalog feature's identical schema
// (src/features/courses/course-catalog/model/course-catalog-schemas.ts)
// rather than imported — admin needs its own RTK Query endpoint injection,
// and each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate. course-editor duplicates the fields it needs again
// in its own model (course-editor-schemas.ts's `courseEditorItemSchema`)
// rather than importing this one — sibling slices within the same domain
// reuse each other's View components directly (see course-list-row.tsx
// importing course-editor's dialog), but never each other's model layer,
// same "duplicate per feature, don't import" rule CLAUDE.md documents for
// course-detail vs. course-reviews/lessons.
const courseAdminItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  sectionsCount: z.number().optional(),
  lessonsCount: z.number().optional(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
})

const paginatedCoursesAdminSchema = paginatedSchema(courseAdminItemSchema)

// DELETE /courses/delete/{id} — DeleteCourseResponse.
const deleteCourseResponseSchema = z.object({ message: z.string() })

type CourseAdminItem = z.infer<typeof courseAdminItemSchema>

export { courseAdminItemSchema, deleteCourseResponseSchema, paginatedCoursesAdminSchema }
export type { CourseAdminItem }
