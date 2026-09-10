import type { z } from "zod"

import { gameOfDaySchema } from "@/features/home/game-of-day/model/game-of-day-schemas"
import { baseApi } from "@/lib/api/base-api"

// Game-of-day feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — hits
// the exact same route as Live's `getLiveActiveGame` (see
// ../live/model/live-api.ts) but is declared independently under a distinct
// endpoint name, since RTK Query endpoint names must be unique across the
// whole baseApi reducer and each feature's model file is self-contained.
const gameOfDayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveGameOfDay: builder.query<z.infer<typeof gameOfDaySchema>, void>({
      query: () => ({ url: "/game-of-day/active" }),
      transformResponse: (response: unknown) => gameOfDaySchema.parse(response),
    }),
  }),
})

const { useGetActiveGameOfDayQuery } = gameOfDayApi

export { gameOfDayApi, useGetActiveGameOfDayQuery }
