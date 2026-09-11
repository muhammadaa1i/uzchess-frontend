import { z } from "zod"

// The editable-course shape the create/edit form prefills from — a duplicate
// of the sibling course-list slice's `courseAdminItemSchema` (see
// course-list-schemas.ts's comment on why: sibling slices within the same
// domain reuse each other's View components directly, but never each
// other's model layer, same rule CLAUDE.md documents for course-detail vs.
// course-reviews/lessons). course-list-row.tsx/course-edit-button.tsx pass a
// `CourseAdminItem` in as this type's structurally-identical `course` prop.
// The category/author/difficulty/language reference-list shapes used to
// also live in this file but were split out into the sibling
// course-reference-data slice, which owns that read-only lookup data
// independently.
const courseEditorItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
})

type CourseEditorItem = z.infer<typeof courseEditorItemSchema>

export { courseEditorItemSchema }
export type { CourseEditorItem }
