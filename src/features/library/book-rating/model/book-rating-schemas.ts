import { z } from "zod"

// POST /books/rate/{id} — CreateRatingRequest/CreateRatingResponse (see
// /swagger/books). No comment field (unlike Courses' rating, which also
// accepts one) and no GET /books/reviews/{id}-style list endpoint exists in
// the live spec — a book's rating widget can only submit/withdraw the
// current user's own score, it can't render a review feed. Flagged as a
// backend gap (see book-rating-widget.tsx's comment).
const createBookRatingRequestSchema = z.object({ score: z.number().min(1).max(5) })
const createBookRatingResponseSchema = z.object({
  bookId: z.number(),
  score: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
})
const deleteBookRatingResponseSchema = z.object({ message: z.string() })

export { createBookRatingRequestSchema, createBookRatingResponseSchema, deleteBookRatingResponseSchema }
