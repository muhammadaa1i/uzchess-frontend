"use client"

interface LiveVideoPlayerProps {
  embedUrl: string
  title: string
}

// YouTube's own iframe player chrome already provides play/pause, a
// settings gear (quality/speed), and native fullscreen — see
// ../model/live-schemas.ts's `toYoutubeEmbedUrl` for why a hand-rolled
// <video> control set isn't built here: the only videoUrl shape confirmed
// against a real `/game-of-day/active` response is a youtube.com watch
// link, not a raw streamable file.
function LiveVideoPlayer({ embedUrl, title }: LiveVideoPlayerProps) {
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

export { LiveVideoPlayer }
