import { z } from "zod"

// The exact leaf key under the "Admin.bannerManagement.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// news-management-form-schema.ts's ValidationKey, kept local to this feature
// per CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey = "titleRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema shared by both the create and edit forms (see
// use-banner-form.ts) — mirrors CreateBannerRequest/UpdateBannerRequest: only
// `title` is required (on create; UpdateBannerRequest makes even that
// optional, but this form always requires it since the edit form is
// prefilled before the user can submit — same reasoning as
// news-management-form-schema.ts). Max lengths mirror the backend's own
// `@MaxLength()` decorators
// (`../backend/src/features/home/banner/commands/create-banner/create-banner.request.ts`):
// title 128, subtitle/linkUrl 256, badgeText 32. `image` holds the raw
// `File` from the file input; optional in both modes since the backend's own
// `image` field is optional on both requests too — validated as `File` here
// (not by content) since the backend validates extension/size itself (multer
// `FileInterceptor`, 5MB limit, jpg/png/jpeg/svg).
function createBannerFormSchema(t: ValidationT) {
  return z.object({
    title: z.string().trim().min(1, t("titleRequired")).max(128),
    subtitle: z.string().trim().max(256).optional(),
    linkUrl: z.string().trim().max(256).optional(),
    badgeText: z.string().trim().max(32).optional(),
    isActive: z.boolean(),
    image: z.instanceof(File).optional(),
  })
}

type BannerFormValues = z.infer<ReturnType<typeof createBannerFormSchema>>

export { createBannerFormSchema }
export type { BannerFormValues }
