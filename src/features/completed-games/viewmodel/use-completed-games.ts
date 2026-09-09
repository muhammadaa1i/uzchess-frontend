import { useGetCompletedGamesQuery } from "@/features/completed-games/model/completed-games-api"

const COMPLETED_GAMES_SIZE = 5

function useCompletedGames() {
  const { data, isLoading, isError, refetch } = useGetCompletedGamesQuery({
    size: COMPLETED_GAMES_SIZE,
  })

  return {
    games: data?.data.slice(0, COMPLETED_GAMES_SIZE) ?? [],
    isLoading,
    isError,
    refetch,
  }
}

export { useCompletedGames }
