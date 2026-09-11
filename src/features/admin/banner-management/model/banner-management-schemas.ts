import { z } from "zod"

// GET /banners/read, GET /banners/read/{id}, POST /banners/create, and
// PATCH /banners/update/{id} all return this exact same shape
// (GetBannersResponse/GetBannersByIdResponse/CreateBannerResponse/
// UpdateBannerResponse per the live /swagger/home-json spec) — unlike news,
// there's no separate "detail" shape carrying extra fields the list response
// lacks, so one schema covers both the list and every mutation response, and
// (unlike news-management) the edit form doesn't need its own
// `getAdminBannerById` fetch to prefill itself — the row's own list item
// already has everything. Duplicated from the Home promo-banners feature's
// identical schema (src/features/home/promo-banners/model/promo-banners-schemas.ts)
// rather than imported — admin needs its own RTK Query endpoint injection,
// and each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate.
const bannerAdminItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  badgeText: z.string().nullable().optional(),
  isActive: z.boolean(),
})

// GET /banners/read — a plain array, not paginated (unlike GET /news/read,
// which returns `PaginatedGetNewsResponse`). Confirmed against the live
// /swagger/home-json spec.
const bannersAdminResponseSchema = z.array(bannerAdminItemSchema)

// DELETE /banners/delete/{id} — DeleteBannerResponse.
const deleteBannerResponseSchema = z.object({ message: z.string() })

type BannerAdminItem = z.infer<typeof bannerAdminItemSchema>

export { bannerAdminItemSchema, bannersAdminResponseSchema, deleteBannerResponseSchema }
export type { BannerAdminItem }
