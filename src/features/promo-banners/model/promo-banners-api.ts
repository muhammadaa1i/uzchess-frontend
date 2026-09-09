import type { z } from "zod"

import { bannersResponseSchema } from "@/features/promo-banners/model/promo-banners-schemas"
import { baseApi } from "@/lib/api/base-api"

// Promo-banners feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — hits
// the same route as Live's `getLiveSidebarPromo` (see
// ../live/model/live-api.ts) but is declared independently under a distinct
// endpoint name.
const promoBannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<z.infer<typeof bannersResponseSchema>, void>({
      query: () => ({ url: "/banners/read" }),
      transformResponse: (response: unknown) => bannersResponseSchema.parse(response),
    }),
  }),
})

const { useGetBannersQuery } = promoBannersApi

export { promoBannersApi, useGetBannersQuery }
