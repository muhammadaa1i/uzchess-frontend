import type { z } from "zod"

import { paginatedCompletedGamesSchema } from "@/features/completed-games/model/completed-games-schemas"
import { baseApi } from "@/lib/api/base-api"

// Completed-games feature's own RTK Query endpoint, injected into the
// shared endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate).
const completedGamesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Finished games (whiteScore/blackScore/movesCount are always present),
    // most recent first — backs the "Yakunlangan o'yinlar" home section.
    getCompletedGames: builder.query<
      z.infer<typeof paginatedCompletedGamesSchema>,
      { size?: number } | void
    >({
      query: (params) => ({
        url: "/games/list",
        params: { sortBy: "date", size: params?.size },
      }),
      transformResponse: (response: unknown) => paginatedCompletedGamesSchema.parse(response),
    }),
  }),
})

const { useGetCompletedGamesQuery } = completedGamesApi

export { completedGamesApi, useGetCompletedGamesQuery }
