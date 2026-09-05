import type { z } from "zod"

import {
  paginatedPlayerRankingSchema,
  type playerTitleSchema,
  rankingFiltersSchema,
} from "@/features/ranking/model/ranking-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetRankingParams {
  page?: number
  size?: number
  country?: string
  title?: z.infer<typeof playerTitleSchema>
  sortBy?: "classical" | "rapid" | "blitz"
}

// Ranking feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getPlayersRanking` endpoint in
// home-api.ts, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route.
const rankingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRanking: builder.query<
      z.infer<typeof paginatedPlayerRankingSchema>,
      GetRankingParams | void
    >({
      query: (params) => ({ url: "/players/ranking", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedPlayerRankingSchema.parse(response),
    }),
    getRankingFilters: builder.query<z.infer<typeof rankingFiltersSchema>, void>({
      query: () => ({ url: "/players/ranking/filters" }),
      transformResponse: (response: unknown) => rankingFiltersSchema.parse(response),
    }),
  }),
})

const { useGetRankingQuery, useGetRankingFiltersQuery } = rankingApi

export { rankingApi, useGetRankingFiltersQuery, useGetRankingQuery }
export type { GetRankingParams }
