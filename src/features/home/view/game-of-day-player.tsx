"use client"

interface GameOfDayPlayerProps {
  embedUrl: string
  title: string
}

// Same rationale as ../../live/view/live-video-player.tsx: the only
// videoUrl shape confirmed against a real /game-of-day/active response is a
// youtube.com watch link, so this renders YouTube's own iframe chrome
// rather than a hand-rolled <video> control set.
function GameOfDayPlayer({ embedUrl, title }: GameOfDayPlayerProps) {
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

export { GameOfDayPlayer }
