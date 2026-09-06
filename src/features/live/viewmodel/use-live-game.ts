import { useGetLiveActiveGameQuery } from "@/features/live/model/live-api"
import { toYoutubeEmbedUrl } from "@/features/live/model/live-schemas"

function useLiveGame() {
  const { data, isLoading, isError, error, refetch } = useGetLiveActiveGameQuery()

  // The backend throws a 404 (DoesNotExistException) when there's no active
  // game of the day right now — a legitimate empty state, not a fetch
  // failure, so it must not be surfaced as `isError` (which would show a
  // "something went wrong, retry" UI instead of "no live game right now").
  // Same pattern as courses' use-certificate.ts "not earned yet" 404.
  const status = (error as { status?: number } | undefined)?.status
  const noActiveGame = isError && status === 404

  return {
    game: data ?? null,
    embedUrl: data ? toYoutubeEmbedUrl(data.videoUrl) : null,
    isLoading,
    isError: isError && !noActiveGame,
    refetch,
  }
}

export { useLiveGame }
