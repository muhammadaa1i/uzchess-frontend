import type { z } from "zod"

import {
  liveGameSchema,
  livePromoBannersResponseSchema,
  liveSidebarCoursesResponseSchema,
} from "@/features/live/model/live-schemas"
import { baseApi } from "@/lib/api/base-api"

// Live feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). These
// hit the exact same routes as home's `getActiveGameOfDay` /
// `getTopRatedCourses` / `getBanners` (see ../home/model/home-api.ts) but
// are declared independently under distinct endpoint names — RTK Query
// endpoint names must be unique across the whole baseApi reducer, and
// duplicating rather than importing home's model file keeps this feature
// reachable only through its own route, same pattern already used by the
// news/ranking features for their own duplicated schemas.
const liveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveActiveGame: builder.query<z.infer<typeof liveGameSchema>, void>({
      query: () => ({ url: "/game-of-day/active" }),
      transformResponse: (response: unknown) => liveGameSchema.parse(response),
    }),
    getLiveSidebarCourses: builder.query<
      z.infer<typeof liveSidebarCoursesResponseSchema>,
      void
    >({
      query: () => ({ url: "/courses/top-rated" }),
      transformResponse: (response: unknown) =>
        liveSidebarCoursesResponseSchema.parse(response),
    }),
    getLiveSidebarPromo: builder.query<z.infer<typeof livePromoBannersResponseSchema>, void>({
      query: () => ({ url: "/banners/read" }),
      transformResponse: (response: unknown) => livePromoBannersResponseSchema.parse(response),
    }),
  }),
})

const { useGetLiveActiveGameQuery, useGetLiveSidebarCoursesQuery, useGetLiveSidebarPromoQuery } =
  liveApi

export {
  liveApi,
  useGetLiveActiveGameQuery,
  useGetLiveSidebarCoursesQuery,
  useGetLiveSidebarPromoQuery,
}
