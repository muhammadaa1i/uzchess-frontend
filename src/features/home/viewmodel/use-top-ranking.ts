import { useGetPlayersRankingQuery } from "@/features/home/model/home-api"

const TOP_RANKING_SIZE = 5

function useTopRanking() {
  const { data, isLoading, isError } = useGetPlayersRankingQuery({
    size: TOP_RANKING_SIZE,
  })

  return {
    players: data?.data.slice(0, TOP_RANKING_SIZE) ?? [],
    isLoading,
    isError,
  }
}

export { useTopRanking }
