import type { z } from "zod"

import {
  bannerAdminItemSchema,
  bannersAdminResponseSchema,
  deleteBannerResponseSchema,
} from "@/features/admin/banner-management/model/banner-management-schemas"
import { baseApi } from "@/lib/api/base-api"

// Shared by create/update — CreateBannerRequest/UpdateBannerRequest, sent as
// multipart/form-data (see the live /swagger/home-json spec: `image` is
// `format: binary`). All fields are optional here since UpdateBannerRequest
// makes every field optional on the backend (only `title` is required on
// CreateBannerRequest); the form schema (banner-management-form-schema.ts)
// is what actually enforces "required on create".
interface BannerMutationBody {
  title?: string
  subtitle?: string
  linkUrl?: string
  badgeText?: string
  isActive?: boolean
  image?: File
}

// `isActive` is sent as the string "true"/"false" — confirmed against the
// backend's own `CreateBannerRequest`/`UpdateBannerRequest`
// (`../backend/src/features/home/banner/commands/{create,update}-banner/{create,update}-banner.request.ts`),
// whose `@Transform` explicitly accepts `value === "true"` alongside the
// native boolean, i.e. it's built to parse a multipart form field.
function toFormData(body: BannerMutationBody): FormData {
  const formData = new FormData()
  if (body.title !== undefined) formData.append("title", body.title)
  if (body.subtitle !== undefined) formData.append("subtitle", body.subtitle)
  if (body.linkUrl !== undefined) formData.append("linkUrl", body.linkUrl)
  if (body.badgeText !== undefined) formData.append("badgeText", body.badgeText)
  if (body.isActive !== undefined) formData.append("isActive", String(body.isActive))
  if (body.image) formData.append("image", body.image)
  return formData
}

// Banner admin CRUD's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from the Home promo-banners feature's identically-shaped
// `getBanners` endpoint (src/features/home/promo-banners/model/promo-banners-api.ts),
// since endpoints for one feature must not live in another feature's model
// file even against the same backend route. Mutations here are admin-only
// per CLAUDE.md's admin-panel note (backend-enforced via
// `@Roles(Role.Admin)` on BannerController — only the GET routes are
// `@Public()`). No RTK Query tag invalidation is used anywhere in this
// codebase yet — list refreshes are done via an explicit `refetch()` call
// after a mutation succeeds, same pattern as news-management-api.ts.
const bannerManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBanners: builder.query<z.infer<typeof bannersAdminResponseSchema>, void>({
      query: () => ({ url: "/banners/read" }),
      transformResponse: (response: unknown) => bannersAdminResponseSchema.parse(response),
    }),
    createBanner: builder.mutation<z.infer<typeof bannerAdminItemSchema>, BannerMutationBody>({
      query: (body) => ({ url: "/banners/create", method: "POST", body: toFormData(body) }),
      transformResponse: (response: unknown) => bannerAdminItemSchema.parse(response),
    }),
    updateBanner: builder.mutation<
      z.infer<typeof bannerAdminItemSchema>,
      { id: number; body: BannerMutationBody }
    >({
      query: ({ id, body }) => ({
        url: `/banners/update/${id}`,
        method: "PATCH",
        body: toFormData(body),
      }),
      transformResponse: (response: unknown) => bannerAdminItemSchema.parse(response),
    }),
    deleteBanner: builder.mutation<z.infer<typeof deleteBannerResponseSchema>, number>({
      query: (id) => ({ url: `/banners/delete/${id}`, method: "DELETE" }),
      transformResponse: (response: unknown) => deleteBannerResponseSchema.parse(response),
    }),
  }),
})

const {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerManagementApi

export {
  bannerManagementApi,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAdminBannersQuery,
  useUpdateBannerMutation,
}
export type { BannerMutationBody }
