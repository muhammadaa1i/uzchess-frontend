import type { z } from "zod"

import { paginatedNewsSchema } from "@/features/home/latest-news/model/latest-news-schemas"
import { baseApi } from "@/lib/api/base-api"

// Latest-news feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from the News feature's identically-shaped `getNews` endpoint
// (see ../news/model/news-api.ts), since endpoints for one feature must not
// live in another feature's model file, even against the same backend
// route.
const latestNewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeNews: builder.query<z.infer<typeof paginatedNewsSchema>, { size?: number } | void>({
      query: (params) => ({ url: "/news/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedNewsSchema.parse(response),
    }),
  }),
})

const { useGetHomeNewsQuery } = latestNewsApi

export { latestNewsApi, useGetHomeNewsQuery }
