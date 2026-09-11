import { z } from "zod"

// The exact leaf keys under the "Admin.bookManagement.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// news-management-form-schema.ts's ValidationKey, kept local to this feature
// per CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey =
  | "titleRequired"
  | "priceRequired"
  | "priceInvalid"
  | "discountPriceInvalid"
  | "descriptionRequired"
  | "pageCountRequired"
  | "pageCountInvalid"
  | "publishedYearRequired"
  | "publishedYearInvalid"
  | "categoryRequired"
  | "difficultyRequired"
  | "languageRequired"
  | "authorsRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema shared by both the create and edit forms (see
// use-book-editor-form.ts) — mirrors CreateBookRequest/UpdateBookRequest (see
// the live /swagger/books-json spec): `title`/`price`/`description`/
// `pageCount`/`publishedYear`/`categoryId`/`difficultyId`/`languageId`/
// `authorIds` are required on create (UpdateBookRequest makes all of these
// optional, but this form always requires them — the edit form is prefilled
// from the row's own list item before the user can submit, same reasoning as
// news-management-form-schema.ts). Numeric fields come from native
// `<input type="number">`s, so they're validated here as digit strings (same
// "string in, converted only where it actually matters" pattern as
// role-management-form-schema.ts's `userId`) rather than `z.coerce.number()`,
// since the mutation body sends them straight into FormData as strings
// anyway (see book-editor-api.ts's `toFormData`). `discountPrice` is the one
// genuinely optional field (backend nullable, `Min(0)` when provided) —
// blank is valid and means "no discount"/"clear the discount" depending on
// create vs edit (see use-book-editor-form.ts). `authorIds` comes from a
// Controller-wrapped checkbox list (book-author-checkbox-list.tsx), not a
// native input, so it's plain `z.array(z.number())` requiring at least one
// selection (`ArrayNotEmpty` on the backend). `cover` holds the raw `File`
// from the file input; optional here in both modes since there's no existing
// "required on create only" zod pattern elsewhere in this codebase to
// reuse — use-book-editor-form.ts enforces "required on create" itself
// before calling the create mutation (the backend 400s with
// `BadRequestException` if `cover` is missing on `POST /books/create`).
function createBookEditorFormSchema(t: ValidationT) {
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
    pageCount: z
      .string()
      .trim()
      .min(1, t("pageCountRequired"))
      .regex(/^\d+$/, t("pageCountInvalid")),
    publishedYear: z
      .string()
      .trim()
      .min(1, t("publishedYearRequired"))
      .regex(/^\d{4}$/, t("publishedYearInvalid")),
    categoryId: z.string().trim().min(1, t("categoryRequired")),
    difficultyId: z.string().trim().min(1, t("difficultyRequired")),
    languageId: z.string().trim().min(1, t("languageRequired")),
    authorIds: z.array(z.number()).min(1, t("authorsRequired")),
    cover: z.instanceof(File).optional(),
  })
}

type BookEditorFormValues = z.infer<ReturnType<typeof createBookEditorFormSchema>>

export { createBookEditorFormSchema }
export type { BookEditorFormValues }
