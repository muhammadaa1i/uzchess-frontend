"use client"

interface YoutubeEmbedPlayerProps {
  embedUrl: string
  title: string
}

// Purely presentational YouTube iframe embed, shared between the Home page's
// game-of-day widget (src/features/game-of-day/view/game-of-day-section.tsx)
// and the Live page (src/features/live/view/live-view.tsx) — see CLAUDE.md's
// code-splitting mandate: since neither feature may import the other's
// view files, this embed is defined once here instead of duplicated. YouTube's
// own iframe chrome already provides play/pause, a settings gear
// (quality/speed), and native fullscreen, so no hand-rolled <video> control
// set is built — the only videoUrl shape confirmed against a real
// `/game-of-day/active` response is a youtube.com watch link, not a raw
// streamable file.
function YoutubeEmbedPlayer({ embedUrl, title }: YoutubeEmbedPlayerProps) {
  return (
    <iframe
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="size-full"
    />
  )
}

export { YoutubeEmbedPlayer }
