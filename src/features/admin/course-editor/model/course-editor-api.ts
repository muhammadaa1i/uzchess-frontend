import type { z } from "zod"

import { courseEditorItemSchema } from "@/features/admin/course-editor/model/course-editor-schemas"
import { baseApi } from "@/lib/api/base-api"

// Shared by create/update — CreateCourseRequest/UpdateCourseRequest, sent as
// multipart/form-data (see the live /swagger/courses-json spec: `cover` is
// `format: binary`, same field name as the sibling Books domain's Book
// `cover`). Numeric fields are kept as strings here (the form's own
// numeric-as-string-then-append convention, same as
// role-management-form-schema.ts's `userId`) since they're headed straight
// into a FormData value anyway — no intermediate Number() round trip
// needed. `authorIds` is the one array field on either request
// (`ArrayNotEmpty`, `@Type(() => Number, { each: true })` on the backend,
// confirmed against ../backend/src/features/common/courses/commands/create-course/create-course.request.ts) —
// appended as repeated `authorIds` form fields, which Nest's multer parsing
// collects back into an array server-side, same encoding as Book's. All
// fields are optional here since UpdateCourseRequest makes every field
// optional on the backend (only `cover` is required on CreateCourseRequest,
// enforced separately in use-course-editor-form.ts since there's no
// existing "required on create, optional on edit" zod pattern in this
// codebase to reuse); the form schema (course-editor-form-schema.ts) is
// what actually enforces "required on create" for the text fields.
interface CourseMutationBody {
  title?: string
  price?: string
  discountPrice?: string
  description?: string
  categoryId?: string
  difficultyId?: string
  languageId?: string
  authorIds?: number[]
  cover?: File
}

function toFormData(body: CourseMutationBody): FormData {
  const formData = new FormData()
  if (body.title !== undefined) formData.append("title", body.title)
  if (body.price !== undefined) formData.append("price", body.price)
  // UpdateCourseRequest's own `@Transform` treats an empty string as "clear
  // the discount price" (see ../backend/src/features/common/courses/commands/update-course/update-course.request.ts)
  // — appended whenever the edit form provides a value (even ""), but never
  // appended on create when left blank (see use-course-editor-form.ts's
  // onSubmit).
  if (body.discountPrice !== undefined) formData.append("discountPrice", body.discountPrice)
  if (body.description !== undefined) formData.append("description", body.description)
  if (body.categoryId !== undefined) formData.append("categoryId", body.categoryId)
  if (body.difficultyId !== undefined) formData.append("difficultyId", body.difficultyId)
  if (body.languageId !== undefined) formData.append("languageId", body.languageId)
  if (body.authorIds !== undefined) {
    for (const authorId of body.authorIds) formData.append("authorIds", String(authorId))
  }
  if (body.cover) formData.append("cover", body.cover)
  return formData
}

// Course editor's own RTK Query endpoints (create/update only — the sibling
// course-list slice owns `getAdminCourses`/`deleteCourse`, and the sibling
// course-reference-data slice owns the read-only category/author/
// difficulty/language lookups), injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate). Mutations are
// admin-only per CLAUDE.md's admin-panel note (backend-enforced via
// `@Roles(Role.Admin)` on CourseController). No RTK Query tag invalidation
// is used anywhere in this codebase yet — the list refreshes via an
// explicit `refetch()` call (owned by course-list) after a mutation
// succeeds here, same pattern as book-editor-api.ts.
const courseEditorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<z.infer<typeof courseEditorItemSchema>, CourseMutationBody>({
      query: (body) => ({ url: "/courses/create", method: "POST", body: toFormData(body) }),
      transformResponse: (response: unknown) => courseEditorItemSchema.parse(response),
    }),
    updateCourse: builder.mutation<
      z.infer<typeof courseEditorItemSchema>,
      { id: number; body: CourseMutationBody }
    >({
      query: ({ id, body }) => ({
        url: `/courses/update/${id}`,
        method: "PATCH",
        body: toFormData(body),
      }),
      transformResponse: (response: unknown) => courseEditorItemSchema.parse(response),
    }),
  }),
})

const { useCreateCourseMutation, useUpdateCourseMutation } = courseEditorApi

export { courseEditorApi, useCreateCourseMutation, useUpdateCourseMutation }
export type { CourseMutationBody }
