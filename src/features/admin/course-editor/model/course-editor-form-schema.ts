import { z } from "zod"

// The exact leaf keys under the "Admin.courseManagement.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// book-editor-form-schema.ts's ValidationKey, kept local to this feature per
// CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey =
  | "titleRequired"
  | "priceRequired"
  | "priceInvalid"
  | "discountPriceInvalid"
  | "descriptionRequired"
  | "categoryRequired"
  | "difficultyRequired"
  | "languageRequired"
  | "authorsRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema shared by both the create and edit forms (see
// use-course-editor-form.ts) — mirrors CreateCourseRequest/
// UpdateCourseRequest (see the live /swagger/courses-json spec):
// `title`/`price`/`description`/`categoryId`/`difficultyId`/`languageId`/
// `authorIds` are required on create (UpdateCourseRequest makes all of these
// optional, but this form always requires them — the edit form is prefilled
// from the row's own list item before the user can submit, same reasoning
// as book-editor-form-schema.ts). Unlike Book, Course has no
// `pageCount`/`publishedYear` fields (confirmed against the live spec — the
// Course entity has no such columns). Numeric fields come from native
// `<input type="number">`s, so they're validated here as digit strings
// (same "string in, converted only where it actually matters" pattern as
// book-editor-form-schema.ts) rather than `z.coerce.number()`, since the
// mutation body sends them straight into FormData as strings anyway (see
// course-editor-api.ts's `toFormData`). `discountPrice` is the one
// genuinely optional field (backend nullable, `Min(0)` when provided) —
// blank is valid and means "no discount"/"clear the discount" depending on
// create vs edit (see use-course-editor-form.ts). `authorIds` comes from a
// Controller-wrapped checkbox list (course-author-checkbox-list.tsx), not a
// native input, so it's plain `z.array(z.number())` requiring at least one
// selection (`ArrayNotEmpty` on the backend). `cover` holds the raw `File`
// from the file input; optional here in both modes since there's no
// existing "required on create only" zod pattern elsewhere in this
// codebase to reuse — use-course-editor-form.ts enforces "required on
// create" itself before calling the create mutation (the backend 400s with
// `BadRequestException` if `cover` is missing on `POST /courses/create`).
function createCourseEditorFormSchema(t: ValidationT) {
  return z.object({
    title: z.string().trim().min(1, t("titleRequired")).max(256),
    price: z
      .string()
      .trim()
      .min(1, t("priceRequired"))
      .regex(/^\d+$/, t("priceInvalid")),
    discountPrice: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^\d+$/.test(value), { message: t("discountPriceInvalid") }),
    description: z.string().trim().min(1, t("descriptionRequired")),
    categoryId: z.string().trim().min(1, t("categoryRequired")),
    difficultyId: z.string().trim().min(1, t("difficultyRequired")),
    languageId: z.string().trim().min(1, t("languageRequired")),
    authorIds: z.array(z.number()).min(1, t("authorsRequired")),
    cover: z.instanceof(File).optional(),
  })
}

type CourseEditorFormValues = z.infer<ReturnType<typeof createCourseEditorFormSchema>>

export { createCourseEditorFormSchema }
export type { CourseEditorFormValues }
