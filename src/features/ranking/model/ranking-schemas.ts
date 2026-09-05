import { z } from "zod"

// Player titles as returned by GET /players/ranking (see /swagger/home).
// Duplicated from home's identical enum rather than imported — each
// feature's model layer is self-contained per CLAUDE.md's code-splitting
// mandate (features may only be reached through their own route(s)).
const playerTitleSchema = z.enum([
  "none",
  "cm",
  "fm",
  "im",
  "gm",
  "wcm",
  "wfm",
  "wim",
  "wgm",
])

function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    data: z.array(itemSchema),
  })
}

// GET /players/ranking — GetPlayersRankingResponse. The *RatingChange /
// rankChange fields are nullable deltas since the previous ranking period —
// they back the +/- rating chip in the shared RankingTable.
const playerRankingSchema = z.object({
  id: z.number(),
  rank: z.number(),
  name: z.string(),
  avatarUrl: z.string().nullable().optional(),
  country: z.string(),
  title: playerTitleSchema,
  classicalRating: z.number(),
  classicalRatingChange: z.number().nullable().optional(),
  rapidRating: z.number(),
  rapidRatingChange: z.number().nullable().optional(),
  blitzRating: z.number(),
  blitzRatingChange: z.number().nullable().optional(),
  rankChange: z.number().nullable().optional(),
})

const paginatedPlayerRankingSchema = paginatedSchema(playerRankingSchema)

// GET /players/ranking/filters — GetRankingFiltersResponse. `countries` is a
// list of ISO country codes currently used by ranked players (see
// countryCodesToOptions in @/components/shared/country-select for the
// code -> display name/flag conversion; the backend doesn't return names).
const rankingFiltersSchema = z.object({
  countries: z.array(z.string()),
  titles: z.array(playerTitleSchema),
})

type PlayerRanking = z.infer<typeof playerRankingSchema>
type RankingFilters = z.infer<typeof rankingFiltersSchema>

export {
  paginatedPlayerRankingSchema,
  playerRankingSchema,
  playerTitleSchema,
  rankingFiltersSchema,
}
export type { PlayerRanking, RankingFilters }
