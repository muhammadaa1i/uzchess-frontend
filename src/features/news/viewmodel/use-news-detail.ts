import { useGetNewsByIdQuery } from "@/features/news/model/news-api"

function useNewsDetail(newsId: number) {
  const { data, isLoading, isError, refetch } = useGetNewsByIdQuery(newsId, {
    skip: !Number.isFinite(newsId),
  })

  return {
    news: data,
    relatedNews: data?.relatedNews ?? [],
    isLoading,
    isError,
    refetch,
  }
}

export { useNewsDetail }
