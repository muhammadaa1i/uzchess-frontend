import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  useGetBookAuthorsQuery,
  useGetBookCategoriesQuery,
  useGetBookDifficultiesQuery,
} from "@/features/library/model/book-catalog-api"
import {
  useAddToCartMutation,
  useGetBookByIdQuery,
  useGetOrdersQuery,
} from "@/features/library/model/book-detail-api"
import { getBookErrorMessage } from "@/features/library/model/book-error"
import { useAppSelector } from "@/lib/store/hooks"

// Orders whose status is "cancelled" never actually delivered the book, so
// they don't count toward "purchased" — matches the only distinction the
// live GetOrdersResponse shape actually exposes (see book-schemas.ts).
function orderCountsAsPurchase(status: string) {
  return status !== "cancelled"
}

function useBookDetail(bookId: number) {
  const tErrors = useTranslations("Library.detail.errors")
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)
  const [justAdded, setJustAdded] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)

  const {
    data: book,
    isLoading: isBookLoading,
    isError: isBookError,
    refetch,
  } = useGetBookByIdQuery(bookId, { skip: !Number.isFinite(bookId) })

  // GET /orders is authenticated — skipped when signed out, matching
  // useCourseDetail's identical treatment of GET /courses/purchased.
  const { data: orders } = useGetOrdersQuery(undefined, { skip: !isAuthenticated })
  const { data: categories } = useGetBookCategoriesQuery()
  const { data: difficulties } = useGetBookDifficultiesQuery()
  const { data: authors } = useGetBookAuthorsQuery()

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()

  const isPurchased =
    orders?.some(
      (order) =>
        orderCountsAsPurchase(order.status) &&
        order.items.some((item) => item.bookId === bookId)
    ) ?? false

  const category = categories?.find((item) => item.id === book?.categoryId)
  const difficulty = difficulties?.find((item) => item.id === book?.difficultyId)
  const bookAuthors = authors?.filter((author) => book?.authorIds.includes(author.id)) ?? []

  async function handleAddToCart() {
    setCartError(null)
    try {
      await addToCart(bookId).unwrap()
      setJustAdded(true)
    } catch (error) {
      setCartError(getBookErrorMessage(error, tErrors("generic")))
    }
  }

  return {
    book,
    category,
    difficulty,
    authors: bookAuthors,
    isLoading: isBookLoading,
    isError: isBookError,
    refetch,
    isAuthenticated,
    isPurchased,
    addToCart: handleAddToCart,
    isAddingToCart,
    justAdded,
    cartError,
  }
}

export { useBookDetail }
