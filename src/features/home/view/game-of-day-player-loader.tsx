"use client"

import dynamic from "next/dynamic"

// The video player is genuinely heavy, browser-only chrome (a third-party
// iframe embed) — CLAUDE.md calls out "a video player (Live section)" as a
// next/dynamic(ssr:false) candidate, and this home widget embeds the same
// kind of player, only rendered after the user opts in by clicking play
// (see game-of-day-section.tsx), so it's never in the initial page bundle.
// `ssr: false` requires a Client Component boundary, so that lives here
// instead of in the (Server Component) page.
const GameOfDayPlayer = dynamic(
  () => import("@/features/home/view/game-of-day-player").then((mod) => mod.GameOfDayPlayer),
  { ssr: false }
)

interface GameOfDayPlayerLoaderProps {
  embedUrl: string
  title: string
}

function GameOfDayPlayerLoader({ embedUrl, title }: GameOfDayPlayerLoaderProps) {
  return <GameOfDayPlayer embedUrl={embedUrl} title={title} />
}

export { GameOfDayPlayerLoader }
