import type { z } from "zod"

import {
  newsDetailSchema,
  paginatedNewsSchema,
} from "@/features/news/model/news-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetNewsParams {
  page?: number
  size?: number
  search?: string
}

// News feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getHomeNews` endpoint in
// home-api.ts, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route.
const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<z.infer<typeof paginatedNewsSchema>, GetNewsParams | void>({
      query: (params) => ({ url: "/news/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedNewsSchema.parse(response),
    }),
    getNewsById: builder.query<z.infer<typeof newsDetailSchema>, number>({
      query: (id) => ({ url: `/news/read/${id}` }),
      transformResponse: (response: unknown) => newsDetailSchema.parse(response),
    }),
  }),
})

const { useGetNewsQuery, useGetNewsByIdQuery } = newsApi

export { newsApi, useGetNewsByIdQuery, useGetNewsQuery }
export type { GetNewsParams }
