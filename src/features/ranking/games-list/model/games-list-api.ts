import type { z } from "zod"

import {
  type GameStatus,
  gamesFiltersSchema,
  paginatedGamesListSchema,
} from "@/features/ranking/games-list/model/games-list-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetGamesListParams {
  page?: number
  size?: number
  country?: string
  age?: number
  sortBy?: "date" | "moves" | "gameType"
  status?: GameStatus
}

// Games-list feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from completed-games' identically-shaped `getCompletedGames`
// endpoint, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route.
const gamesListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGamesList: builder.query<
      z.infer<typeof paginatedGamesListSchema>,
      GetGamesListParams | void
    >({
      query: (params) => ({ url: "/games/list", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedGamesListSchema.parse(response),
    }),
    getGamesFilters: builder.query<z.infer<typeof gamesFiltersSchema>, void>({
      query: () => ({ url: "/games/filters" }),
      transformResponse: (response: unknown) => gamesFiltersSchema.parse(response),
    }),
  }),
})

const { useGetGamesListQuery, useGetGamesFiltersQuery } = gamesListApi

export { gamesListApi, useGetGamesFiltersQuery, useGetGamesListQuery }
export type { GetGamesListParams }
