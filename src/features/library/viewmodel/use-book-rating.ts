import { useTranslations } from "next-intl"
import { useState } from "react"

import { getBookErrorMessage } from "@/features/library/model/book-error"
import { useRateBookMutation, useRemoveBookRatingMutation } from "@/features/library/model/book-rating-api"

// There's no GET endpoint exposing the current user's own prior rating for
// a book (see book-schemas.ts's note on the missing reviews-list endpoint),
// so "selected score" is purely this session's ephemeral UI state — not
// something restorable from the server, hence plain useState rather than
// Redux (same "view-local state" exception CLAUDE.md carves out).
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
      setError(getBookErrorMessage(submitError, tErrors("generic")))
    }
  }

  async function clearRating() {
    setError(null)
    setJustRated(false)
    try {
      await removeRating(bookId).unwrap()
      setSelectedScore(0)
    } catch (removeError) {
      setError(getBookErrorMessage(removeError, tErrors("generic")))
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
