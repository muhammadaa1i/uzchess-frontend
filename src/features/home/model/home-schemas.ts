import { z } from "zod"

// Player titles as returned by the ranking/game-of-day endpoints
// (see GET /players/ranking, GET /game-of-day/active in /swagger/home).
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

const gameTypeSchema = z.enum(["rapid", "blitz", "bullet"])

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

// GET /news/read — GetNewsResponse / PaginatedGetNewsResponse
const newsItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
})

const paginatedNewsSchema = paginatedSchema(newsItemSchema)

// GET /banners/read — GetBannersResponse
const bannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  badgeText: z.string().nullable().optional(),
  isActive: z.boolean(),
})

const bannersResponseSchema = z.array(bannerSchema)

// GET /game-of-day/active — GetActiveGameOfDayResponse
const gameOfDaySchema = z.object({
  id: z.number(),
  videoUrl: z.string(),
  thumbnailUrl: z.string(),
  durationSeconds: z.number(),
  liveStartTime: z.string(),
  gameType: gameTypeSchema,
  whitePlayerId: z.number(),
  whitePlayerName: z.string(),
  whitePlayerAvatarUrl: z.string().nullable().optional(),
  whitePlayerRating: z.number(),
  blackPlayerId: z.number(),
  blackPlayerName: z.string(),
  blackPlayerAvatarUrl: z.string().nullable().optional(),
  blackPlayerRating: z.number(),
})

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

// GET /courses/top-rated — GetTopRatedCoursesResponse (see /swagger/courses)
const courseSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  sectionsCount: z.number(),
  lessonsCount: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
  purchasesCount: z.number(),
})

const coursesResponseSchema = z.array(courseSummarySchema)

// GET /books/top-rated — GetTopRatedBooksResponse (see /swagger/books)
const bookSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  pageCount: z.number(),
  publishedYear: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
  purchasesCount: z.number(),
})

const booksResponseSchema = z.array(bookSummarySchema)

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

// Seed/dev data (and the only shape confirmed against a real response) is a
// standard `youtube.com/watch?v=...` link, not a live-streaming protocol —
// rendered as a YouTube iframe embed so play/pause/fullscreen/settings come
// from YouTube's own native player chrome. Duplicated from the Live
// feature's identical helper rather than imported — each feature's model
// layer is self-contained per CLAUDE.md's code-splitting mandate.
function getYoutubeVideoId(videoUrl: string): string | undefined {
  try {
    const url = new URL(videoUrl)

    return url.hostname.includes("youtu.be")
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ?? undefined)
  } catch {
    return undefined
  }
}

// Falls back to the raw URL (unlikely to embed) for any other shape rather
// than throwing.
function toYoutubeEmbedUrl(videoUrl: string): string {
  const videoId = getYoutubeVideoId(videoUrl)

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : videoUrl
}

// The backend's own thumbnailUrl (real design/uploaded artwork) is the
// preferred poster image. YouTube serves a real static thumbnail for every
// video at a fixed URL shape too, so that's used as a fallback for the
// *same* video (not a stand-in/unrelated image) only when the backend
// hasn't set one.
function resolveGameOfDayThumbnail(thumbnailUrl: string, videoUrl: string): string {
  if (thumbnailUrl) return thumbnailUrl

  const videoId = getYoutubeVideoId(videoUrl)

  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : thumbnailUrl
}

type NewsItem = z.infer<typeof newsItemSchema>
type Banner = z.infer<typeof bannerSchema>
type GameOfDay = z.infer<typeof gameOfDaySchema>
type PlayerRanking = z.infer<typeof playerRankingSchema>
type CourseSummary = z.infer<typeof courseSummarySchema>
type BookSummary = z.infer<typeof bookSummarySchema>
type CompletedGame = z.infer<typeof completedGameSchema>

export {
  newsItemSchema,
  paginatedNewsSchema,
  bannerSchema,
  bannersResponseSchema,
  gameOfDaySchema,
  playerRankingSchema,
  paginatedPlayersRankingSchema,
  courseSummarySchema,
  coursesResponseSchema,
  bookSummarySchema,
  booksResponseSchema,
  completedGameSchema,
  paginatedCompletedGamesSchema,
  resolveGameOfDayThumbnail,
  toYoutubeEmbedUrl,
}
export type {
  NewsItem,
  Banner,
  GameOfDay,
  PlayerRanking,
  CourseSummary,
  BookSummary,
  CompletedGame,
}
