import { useTranslations } from "next-intl"
import { useState } from "react"

import { useRateBookMutation, useRemoveBookRatingMutation } from "@/features/book-rating/model/book-rating-api"
import { getBookRatingErrorMessage } from "@/features/book-rating/model/book-rating-error"

// There's no GET endpoint exposing the current user's own prior rating for
// a book (see book-rating-schemas.ts's note on the missing reviews-list
// endpoint), so "selected score" is purely this session's ephemeral UI
// state — not something restorable from the server, hence plain useState
// rather than Redux (same "view-local state" exception CLAUDE.md carves
// out).
function useBookRating(bookId: number) {
  const tErrors = useTranslations("Library.detail.rating.errors")
  const [selectedScore, setSelectedScore] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [justRated, setJustRated] = useState(false)

  const [rate, { isLoading: isRating }] = useRateBookMutation()
  const [removeRating, { isLoading: isRemoving }] = useRemoveBookRatingMutation()

  async function submitRating(score: number) {
    setError(null)
    setJustRated(false)
    try {
      await rate({ bookId, body: { score } }).unwrap()
      setSelectedScore(score)
      setJustRated(true)
    } catch (submitError) {
      setError(getBookRatingErrorMessage(submitError, tErrors("generic")))
    }
  }

  async function clearRating() {
    setError(null)
    setJustRated(false)
    try {
      await removeRating(bookId).unwrap()
      setSelectedScore(0)
    } catch (removeError) {
      setError(getBookRatingErrorMessage(removeError, tErrors("generic")))
    }
  }

  return {
    selectedScore,
    submitRating,
    clearRating,
    isSubmitting: isRating || isRemoving,
    error,
    justRated,
  }
}

export { useBookRating }
