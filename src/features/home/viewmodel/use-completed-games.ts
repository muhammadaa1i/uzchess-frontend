import { useGetCompletedGamesQuery } from "@/features/home/model/home-api"

const COMPLETED_GAMES_SIZE = 5

function useCompletedGames() {
  const { data, isLoading, isError } = useGetCompletedGamesQuery({
    size: COMPLETED_GAMES_SIZE,
  })

  return {
    games: data?.data.slice(0, COMPLETED_GAMES_SIZE) ?? [],
    isLoading,
    isError,
  }
}

export { useCompletedGames }
