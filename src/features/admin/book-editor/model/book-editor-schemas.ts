import { z } from "zod"

// The editable-book shape the create/edit form prefills from — a duplicate of
// the sibling book-list slice's `bookAdminItemSchema` (see
// book-list-schemas.ts's comment on why: sibling slices within the same
// domain reuse each other's View components directly, but never each other's
// model layer, same rule CLAUDE.md documents for course-detail vs.
// course-reviews/lessons). book-list-row.tsx/book-edit-button.tsx pass a
// `BookAdminItem` in as this type's structurally-identical `book` prop. The
// category/author/difficulty/language reference-list shapes used to also
// live in this file but were split out into the sibling book-reference-data
// slice, which owns that read-only lookup data independently.
const bookEditorItemSchema = z.object({
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
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
})

type BookEditorItem = z.infer<typeof bookEditorItemSchema>

export { bookEditorItemSchema }
export type { BookEditorItem }
