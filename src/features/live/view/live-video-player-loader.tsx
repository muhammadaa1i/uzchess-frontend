"use client"

import dynamic from "next/dynamic"

// The video player is genuinely heavy, browser-only chrome (a third-party
// iframe embed) — CLAUDE.md calls out "a video player (Live section)" by
// name as a next/dynamic(ssr:false) candidate, so it's excluded from SSR
// and the initial page bundle. `ssr: false` requires a Client Component
// boundary, so that lives here instead of in the (Server Component) page.
const LiveVideoPlayer = dynamic(
  () => import("@/features/live/view/live-video-player").then((mod) => mod.LiveVideoPlayer),
  { ssr: false }
)

interface LiveVideoPlayerLoaderProps {
  embedUrl: string
  title: string
}

function LiveVideoPlayerLoader({ embedUrl, title }: LiveVideoPlayerLoaderProps) {
  return <LiveVideoPlayer embedUrl={embedUrl} title={title} />
}

export { LiveVideoPlayerLoader }
