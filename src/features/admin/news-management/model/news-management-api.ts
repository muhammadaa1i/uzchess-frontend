import type { z } from "zod"

import {
  deleteNewsResponseSchema,
  newsAdminDetailSchema,
  paginatedNewsAdminSchema,
} from "@/features/admin/news-management/model/news-management-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetAdminNewsParams {
  page?: number
  size?: number
}

// Shared by create/update — CreateNewsRequest/UpdateNewsRequest, sent as
// multipart/form-data (see the live /swagger/home-json spec: `image` is
// `format: binary`). All fields are optional here since UpdateNewsRequest
// makes every field optional on the backend; the form schema
// (news-management-form-schema.ts) is what actually enforces "required on
// create".
interface NewsMutationBody {
  title?: string
  excerpt?: string
  content?: string
  publishedAt?: string
  image?: File
}

function toFormData(body: NewsMutationBody): FormData {
  const formData = new FormData()
  if (body.title !== undefined) formData.append("title", body.title)
  if (body.excerpt !== undefined) formData.append("excerpt", body.excerpt)
  if (body.content !== undefined) formData.append("content", body.content)
  if (body.publishedAt !== undefined) formData.append("publishedAt", body.publishedAt)
  if (body.image) formData.append("image", body.image)
  return formData
}

// News admin CRUD's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from the public news feature's identically-shaped `getNews`
// endpoint (src/features/news/model/news-api.ts), since endpoints for one
// feature must not live in another feature's model file even against the
// same backend route. Mutations here are admin-only per CLAUDE.md's
// admin-panel note (backend-enforced via `@Roles(Role.Admin)` on
// NewsController — only the GET routes are `@Public()`). No RTK Query tag
// invalidation is used anywhere in this codebase yet — list refreshes are
// done via an explicit `refetch()` call after a mutation succeeds, same
// pattern as commerce/cart's use-cart.ts.
const newsManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNews: builder.query<
      z.infer<typeof paginatedNewsAdminSchema>,
      GetAdminNewsParams | void
    >({
      query: (params) => ({ url: "/news/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedNewsAdminSchema.parse(response),
    }),
    // Same public GET /news/read/{id} route the news feature's detail page
    // uses, but injected as this feature's own endpoint — only needed to
    // prefill the edit form's `content` field (absent from `getAdminNews`'s
    // list response above).
    getAdminNewsById: builder.query<z.infer<typeof newsAdminDetailSchema>, number>({
      query: (id) => ({ url: `/news/read/${id}` }),
      transformResponse: (response: unknown) => newsAdminDetailSchema.parse(response),
    }),
    createNews: builder.mutation<z.infer<typeof newsAdminDetailSchema>, NewsMutationBody>({
      query: (body) => ({ url: "/news/create", method: "POST", body: toFormData(body) }),
      transformResponse: (response: unknown) => newsAdminDetailSchema.parse(response),
    }),
    updateNews: builder.mutation<
      z.infer<typeof newsAdminDetailSchema>,
      { id: number; body: NewsMutationBody }
    >({
      query: ({ id, body }) => ({
        url: `/news/update/${id}`,
        method: "PATCH",
        body: toFormData(body),
      }),
      transformResponse: (response: unknown) => newsAdminDetailSchema.parse(response),
    }),
    deleteNews: builder.mutation<z.infer<typeof deleteNewsResponseSchema>, number>({
      query: (id) => ({ url: `/news/delete/${id}`, method: "DELETE" }),
      transformResponse: (response: unknown) => deleteNewsResponseSchema.parse(response),
    }),
  }),
})

const {
  useGetAdminNewsQuery,
  useGetAdminNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsManagementApi

export {
  newsManagementApi,
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetAdminNewsByIdQuery,
  useGetAdminNewsQuery,
  useUpdateNewsMutation,
}
export type { NewsMutationBody }
