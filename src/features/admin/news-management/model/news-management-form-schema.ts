import { z } from "zod"

// The exact leaf keys under the "Admin.newsManagement.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// role-management-form-schema.ts's ValidationKey, kept local to this feature
// per CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey =
  | "titleRequired"
  | "excerptRequired"
  | "contentRequired"
  | "publishedAtRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema shared by both the create and edit forms (see
// use-news-form.ts) — mirrors CreateNewsRequest/UpdateNewsRequest
// (title/excerpt/content/publishedAt required on create, all optional on
// update per the live /swagger/home-json spec), but this form always
// requires them: the edit form is prefilled from GET /news/read/{id} before
// the user can submit, so there's no "leave unchanged by omitting" case to
// support client-side. `publishedAt` comes from a native
// `<input type="date">` (a `YYYY-MM-DD` string), which satisfies the
// backend's `@IsDateString()` validator (see
// ../backend/src/features/home/news/commands/create-news/create-news.request.ts).
// `image` holds the raw `File` from the file input; optional in both modes
// since the backend's own `image` field is optional on both requests too —
// validated as `File` here (not by content) since the backend validates
// extension/size itself (multer `FileInterceptor`, 5MB limit, jpg/png/jpeg/svg).
function createNewsFormSchema(t: ValidationT) {
  return z.object({
    title: z.string().trim().min(1, t("titleRequired")).max(256),
    excerpt: z.string().trim().min(1, t("excerptRequired")),
    content: z.string().trim().min(1, t("contentRequired")),
    publishedAt: z.string().trim().min(1, t("publishedAtRequired")),
    image: z.instanceof(File).optional(),
  })
}

type NewsFormValues = z.infer<ReturnType<typeof createNewsFormSchema>>

export { createNewsFormSchema }
export type { NewsFormValues }
