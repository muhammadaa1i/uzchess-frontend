import type { z } from "zod"

import { bookEditorItemSchema } from "@/features/admin/book-editor/model/book-editor-schemas"
import { baseApi } from "@/lib/api/base-api"

// Shared by create/update — CreateBookRequest/UpdateBookRequest, sent as
// multipart/form-data (see the live /swagger/books-json spec: `cover` is
// `format: binary`, not `image` like news/banners). Numeric fields are kept
// as strings here (the form's own numeric-as-string-then-append convention,
// same as role-management-form-schema.ts's `userId`) since they're headed
// straight into a FormData value anyway — no intermediate Number() round
// trip needed. `authorIds` is the one array field on either request
// (`ArrayNotEmpty`, `@Type(() => Number, { each: true })` on the backend) —
// appended as repeated `authorIds` form fields, which Nest's multer parsing
// collects back into an array server-side. All fields are optional here
// since UpdateBookRequest makes every field optional on the backend (only
// `cover` is required on CreateBookRequest, enforced separately in
// use-book-editor-form.ts since there's no existing "required on create,
// optional on edit" zod pattern in this codebase to reuse); the form schema
// (book-editor-form-schema.ts) is what actually enforces "required on create"
// for the text fields.
interface BookMutationBody {
  title?: string
  price?: string
  discountPrice?: string
  description?: string
  pageCount?: string
  publishedYear?: string
  categoryId?: string
  difficultyId?: string
  languageId?: string
  authorIds?: number[]
  cover?: File
}

function toFormData(body: BookMutationBody): FormData {
  const formData = new FormData()
  if (body.title !== undefined) formData.append("title", body.title)
  if (body.price !== undefined) formData.append("price", body.price)
  // UpdateBookRequest's own `@Transform` treats an empty string as "clear the
  // discount price" (see ../backend/src/features/library/book/commands/update-book/update-book.request.ts)
  // — appended whenever the edit form provides a value (even ""), but never
  // appended on create when left blank (see use-book-editor-form.ts's onSubmit).
  if (body.discountPrice !== undefined) formData.append("discountPrice", body.discountPrice)
  if (body.description !== undefined) formData.append("description", body.description)
  if (body.pageCount !== undefined) formData.append("pageCount", body.pageCount)
  if (body.publishedYear !== undefined) formData.append("publishedYear", body.publishedYear)
  if (body.categoryId !== undefined) formData.append("categoryId", body.categoryId)
  if (body.difficultyId !== undefined) formData.append("difficultyId", body.difficultyId)
  if (body.languageId !== undefined) formData.append("languageId", body.languageId)
  if (body.authorIds !== undefined) {
    for (const authorId of body.authorIds) formData.append("authorIds", String(authorId))
  }
  if (body.cover) formData.append("cover", body.cover)
  return formData
}

// Book editor's own RTK Query endpoints (create/update only — the sibling
// book-list slice owns `getAdminBooks`/`deleteBook`, and the sibling
// book-reference-data slice owns the read-only category/author/difficulty/
// language lookups), injected into the shared endpoint-less `baseApi` (see
// CLAUDE.md's code-splitting mandate). Mutations are admin-only per
// CLAUDE.md's admin-panel note (backend-enforced via `@Roles(Role.Admin)` on
// BookController). No RTK Query tag invalidation is used anywhere in this
// codebase yet — the list refreshes via an explicit `refetch()` call (owned
// by book-list) after a mutation succeeds here, same pattern as
// news-management-api.ts.
const bookEditorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation<z.infer<typeof bookEditorItemSchema>, BookMutationBody>({
      query: (body) => ({ url: "/books/create", method: "POST", body: toFormData(body) }),
      transformResponse: (response: unknown) => bookEditorItemSchema.parse(response),
    }),
    updateBook: builder.mutation<
      z.infer<typeof bookEditorItemSchema>,
      { id: number; body: BookMutationBody }
    >({
      query: ({ id, body }) => ({
        url: `/books/update/${id}`,
        method: "PATCH",
        body: toFormData(body),
      }),
      transformResponse: (response: unknown) => bookEditorItemSchema.parse(response),
    }),
  }),
})

const { useCreateBookMutation, useUpdateBookMutation } = bookEditorApi

export { bookEditorApi, useCreateBookMutation, useUpdateBookMutation }
export type { BookMutationBody }
