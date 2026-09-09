import { z } from "zod"

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

// Player titles as returned by GET /players/ranking (see /swagger/home).
// Duplicated from the Ranking feature's identical enum rather than
// imported — each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate (features may only be reached through their own
// route(s)).
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

// GET /players/ranking — GetPlayersRankingResponse. The *RatingChange /
// rankChange fields are nullable deltas since the previous ranking period
// (see ../backend/src/features/home/entities/player/player.entity.ts) —
// they back Figma's +/- rating chip.
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

const paginatedPlayersRankingSchema = paginatedSchema(playerRankingSchema)

type PlayerRanking = z.infer<typeof playerRankingSchema>

export { paginatedPlayersRankingSchema, playerRankingSchema }
export type { PlayerRanking }
