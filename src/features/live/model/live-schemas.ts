import { z } from "zod"

// GET /game-of-day/active — GetActiveGameOfDayResponse (see /swagger/home).
// Duplicated from home's identical schema rather than imported — each
// feature's model layer is self-contained per CLAUDE.md's code-splitting
// mandate (features may only be reached through their own route(s)).
//
// Note: there is no `round` number or live viewer-count field anywhere on
// this response (or in /game-of-day/read, /game-of-day/read/{id}) — the
// Figma "Live" frame's game title/round header is built from what the API
// actually returns (player names/ratings + game type) rather than a
// fabricated round number or viewer count. Flagged as a backend gap, same
// pattern as the other documented gaps in CLAUDE.md.
const gameTypeSchema = z.enum(["rapid", "blitz", "bullet"])

const liveGameSchema = z.object({
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

// GET /courses/top-rated — GetTopRatedCoursesResponse (see /swagger/courses).
// Only the fields the "Live" page's sidebar course card needs are kept.
const liveSidebarCourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

const liveSidebarCoursesResponseSchema = z.array(liveSidebarCourseSchema)

// GET /banners/read — GetBannersResponse (see /swagger/home). Backs the
// sidebar promo slot, same widget shape as Home's `PromoBanners`.
const livePromoBannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
})

const livePromoBannersResponseSchema = z.array(livePromoBannerSchema)

type LiveGame = z.infer<typeof liveGameSchema>
type LiveSidebarCourse = z.infer<typeof liveSidebarCourseSchema>
type LivePromoBanner = z.infer<typeof livePromoBannerSchema>

// Seed/dev data (and the only shape confirmed against a real response) is a
// standard `youtube.com/watch?v=...` link, not a live-streaming protocol —
// rendered as a YouTube iframe embed so play/pause/fullscreen/settings come
// from YouTube's own native player chrome instead of a hand-rolled <video>
// control set. Falls back to the raw URL (unlikely to embed) for any other
// shape rather than throwing.
function toYoutubeEmbedUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl)
    const videoId =
      url.hostname.includes("youtu.be")
        ? url.pathname.slice(1)
        : (url.searchParams.get("v") ?? undefined)

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : videoUrl
  } catch {
    return videoUrl
  }
}

export {
  gameTypeSchema,
  liveGameSchema,
  livePromoBannerSchema,
  livePromoBannersResponseSchema,
  liveSidebarCourseSchema,
  liveSidebarCoursesResponseSchema,
  toYoutubeEmbedUrl,
}
export type { LiveGame, LivePromoBanner, LiveSidebarCourse }
