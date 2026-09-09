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

// Duplicated from the game-of-day feature's identical enum rather than
// imported — each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate.
const gameTypeSchema = z.enum(["rapid", "blitz", "bullet"])

// GET /games/list — GetGamesListResponse / PaginatedGetGamesListResponse.
// Every item here already has whiteScore/blackScore/movesCount, i.e. it's
// finished-game data — that's what backs the "Yakunlangan o'yinlar"
// (completed games) home section.
const completedGameSchema = z.object({
  id: z.number(),
  whitePlayerId: z.number(),
  whitePlayerName: z.string(),
  whitePlayerAvatarUrl: z.string().nullable().optional(),
  whitePlayerRating: z.number(),
  blackPlayerId: z.number(),
  blackPlayerName: z.string(),
  blackPlayerAvatarUrl: z.string().nullable().optional(),
  blackPlayerRating: z.number(),
  whiteScore: z.number(),
  blackScore: z.number(),
  gameType: gameTypeSchema,
  movesCount: z.number(),
  playedAt: z.string(),
})

const paginatedCompletedGamesSchema = paginatedSchema(completedGameSchema)

type CompletedGame = z.infer<typeof completedGameSchema>

export { completedGameSchema, paginatedCompletedGamesSchema }
export type { CompletedGame }
