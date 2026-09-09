import { useGetTopRatedBooksQuery } from "@/features/top-books/model/top-books-api"

const TOP_BOOKS_SIZE = 4

function useTopBooks() {
  const { data, isLoading, isError, refetch } = useGetTopRatedBooksQuery()

  return {
    books: (data ?? []).slice(0, TOP_BOOKS_SIZE),
    isLoading,
    isError,
    refetch,
  }
}

export { useTopBooks }
