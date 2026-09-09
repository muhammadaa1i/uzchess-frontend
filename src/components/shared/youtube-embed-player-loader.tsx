"use client"

import dynamic from "next/dynamic"

// The video player is genuinely heavy, browser-only chrome (a third-party
// iframe embed) — CLAUDE.md calls out "a video player (Live section)" by
// name as a next/dynamic(ssr:false) candidate, so it's excluded from SSR
// and the initial page bundle. `ssr: false` requires a Client Component
// boundary, so that lives here instead of in each consuming (Server
// Component) page.
const YoutubeEmbedPlayer = dynamic(
  () =>
    import("@/components/shared/youtube-embed-player").then((mod) => mod.YoutubeEmbedPlayer),
  { ssr: false }
)

interface YoutubeEmbedPlayerLoaderProps {
  embedUrl: string
  title: string
}

function YoutubeEmbedPlayerLoader({ embedUrl, title }: YoutubeEmbedPlayerLoaderProps) {
  return <YoutubeEmbedPlayer embedUrl={embedUrl} title={title} />
}

export { YoutubeEmbedPlayerLoader }
