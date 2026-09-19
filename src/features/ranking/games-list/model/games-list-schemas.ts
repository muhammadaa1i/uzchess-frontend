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

// Duplicated from the completed-games/game-of-day features' identical enum
// rather than imported — each feature's model layer is self-contained per
// CLAUDE.md's code-splitting mandate.
const gameTypeSchema = z.enum(["rapid", "blitz", "bullet"])

// GameStatus enum (backend/src/core/enums/game-status/game-status.enum.ts):
// "ongoing" games have no result yet, "completed" games always have final
// whiteScore/blackScore.
const gameStatusSchema = z.enum(["ongoing", "completed"])

// GET /games/list — GetGamesListResponse / PaginatedGetGamesListResponse.
// Backs the Ranking page's "Tamomlangan o'yinlar" (completed games, status
// filtered to "completed") and "Barcha o'yinlar" (all games, no status
// filter) tabs — same query/table shape, only the `status` param differs.
const gameListItemSchema = z.object({
  id: z.number(),
  whitePlayerId: z.number(),
  whitePlayerName: z.string(),
  whitePlayerAvatarUrl: z.string().nullable().optional(),
  whitePlayerRating: z.number(),
  blackPlayerId: z.number(),
  blackPlayerName: z.string(),
  blackPlayerAvatarUrl: z.string().nullable().optional(),
  blackPlayerRating: z.number(),
  // Null while the game is still ongoing — no result yet.
  whiteScore: z.number().nullable(),
  blackScore: z.number().nullable(),
  status: gameStatusSchema,
  gameType: gameTypeSchema,
  movesCount: z.number(),
  playedAt: z.string(),
})

const paginatedGamesListSchema = paginatedSchema(gameListItemSchema)

// GET /games/filters — GetGamesFiltersResponse. `countries` backs the
// country filter (same ISO-code-only shape as the players ranking filters
// endpoint, see country-select.tsx's countryCodesToOptions); `ages` isn't
// used by this feature's UI yet, mirroring ranking-schemas.ts's unused
// `titles` field on its own filters response.
const gamesFiltersSchema = z.object({
  countries: z.array(z.string()),
  ages: z.array(z.number()),
})

type GameListItem = z.infer<typeof gameListItemSchema>
type GameStatus = z.infer<typeof gameStatusSchema>
type GamesFilters = z.infer<typeof gamesFiltersSchema>

export { gameListItemSchema, gameStatusSchema, gamesFiltersSchema, paginatedGamesListSchema }
export type { GameListItem, GameStatus, GamesFilters }
