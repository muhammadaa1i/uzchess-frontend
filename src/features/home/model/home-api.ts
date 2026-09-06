import type { z } from "zod"

import {
  bannersResponseSchema,
  booksResponseSchema,
  coursesResponseSchema,
  gameOfDaySchema,
  paginatedCompletedGamesSchema,
  paginatedNewsSchema,
  paginatedPlayersRankingSchema,
} from "@/features/home/model/home-schemas"
import { baseApi } from "@/lib/api/base-api"

// Home feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — every
// response is validated through the matching zod schema in home-schemas.ts.
const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Named distinctly from news feature's `getNews` — both inject into the
    // same baseApi reducer, and RTK Query endpoint names must be unique
    // across the whole slice, not just per feature file.
    getHomeNews: builder.query<
      z.infer<typeof paginatedNewsSchema>,
      { size?: number } | void
    >({
      query: (params) => ({ url: "/news/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedNewsSchema.parse(response),
    }),
    getBanners: builder.query<z.infer<typeof bannersResponseSchema>, void>({
      query: () => ({ url: "/banners/read" }),
      transformResponse: (response: unknown) => bannersResponseSchema.parse(response),
    }),
    getActiveGameOfDay: builder.query<z.infer<typeof gameOfDaySchema>, void>({
      query: () => ({ url: "/game-of-day/active" }),
      transformResponse: (response: unknown) => gameOfDaySchema.parse(response),
    }),
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
    getTopRatedCourses: builder.query<z.infer<typeof coursesResponseSchema>, void>({
      query: () => ({ url: "/courses/top-rated" }),
      transformResponse: (response: unknown) => coursesResponseSchema.parse(response),
    }),
    getTopRatedBooks: builder.query<z.infer<typeof booksResponseSchema>, void>({
      query: () => ({ url: "/books/top-rated" }),
      transformResponse: (response: unknown) => booksResponseSchema.parse(response),
    }),
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

const {
  useGetHomeNewsQuery,
  useGetBannersQuery,
  useGetActiveGameOfDayQuery,
  useGetPlayersRankingQuery,
  useGetTopRatedCoursesQuery,
  useGetTopRatedBooksQuery,
  useGetCompletedGamesQuery,
} = homeApi

export {
  homeApi,
  useGetHomeNewsQuery,
  useGetBannersQuery,
  useGetActiveGameOfDayQuery,
  useGetPlayersRankingQuery,
  useGetTopRatedCoursesQuery,
  useGetTopRatedBooksQuery,
  useGetCompletedGamesQuery,
}
