import { useGetNewsQuery } from "@/features/home/model/home-api"

const NEWS_LIST_SIZE = 6

function useNewsList() {
  const { data, isLoading, isError } = useGetNewsQuery({ size: NEWS_LIST_SIZE })

  return {
    news: data?.data ?? [],
    isLoading,
    isError,
  }
}

export { useNewsList }
