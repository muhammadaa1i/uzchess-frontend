import { z } from "zod"

// GET /game-of-day/active — GetActiveGameOfDayResponse (see /swagger/home).
// Duplicated from the Live feature's identical schema rather than imported —
// each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate (features may only be reached through their own
// route(s)).
const gameTypeSchema = z.enum(["rapid", "blitz", "bullet"])

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

type GameOfDay = z.infer<typeof gameOfDaySchema>

export { gameOfDaySchema, resolveGameOfDayThumbnail, toYoutubeEmbedUrl }
export type { GameOfDay }
