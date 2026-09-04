import { useGetActiveGameOfDayQuery } from "@/features/home/model/home-api"

function useGameOfDay() {
  const { data, isLoading, isError } = useGetActiveGameOfDayQuery()

  return {
    gameOfDay: data ?? null,
    isLoading,
    isError,
  }
}

export { useGameOfDay }
