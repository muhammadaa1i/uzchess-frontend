import type { z } from "zod"

import { paginatedPlayersRankingSchema } from "@/features/top-ranking/model/top-ranking-schemas"
import { baseApi } from "@/lib/api/base-api"

// Top-ranking feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from the Ranking feature's identically-shaped `getRanking`
// endpoint (see ../ranking/model/ranking-api.ts), since endpoints for one
// feature must not live in another feature's model file, even against the
// same backend route.
const topRankingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlayersRanking: builder.query<
      z.infer<typeof paginatedPlayersRankingSchema>,
      { size?: number } | void
    >({
      query: (params) => ({
        url: "/players/ranking",
        params: params ?? undefined,
      }),
      transformResponse: (response: unknown) =>
        paginatedPlayersRankingSchema.parse(response),
    }),
  }),
})

const { useGetPlayersRankingQuery } = topRankingApi

export { topRankingApi, useGetPlayersRankingQuery }
