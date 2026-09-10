import { useGetActiveGameOfDayQuery } from "@/features/home/game-of-day/model/game-of-day-api"

function useGameOfDay() {
  const { data, isLoading, isError } = useGetActiveGameOfDayQuery()

  return {
    gameOfDay: data ?? null,
    isLoading,
    isError,
  }
}

export { useGameOfDay }
