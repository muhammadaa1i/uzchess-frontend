import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  useGetCartQuery,
  useGetCartSummaryQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "@/features/cart/model/cart-api"
import { getCartErrorMessage } from "@/features/cart/model/cart-error"
import { useAppSelector } from "@/lib/store/hooks"

function useCart() {
  const t = useTranslations("Cart")
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  // The coupon code the user has actually submitted (drives the
  // `GET /cart/summary?code=` query arg) — separate from whatever's
  // currently typed into the field, which is view-local state owned by the
  // form itself. `null` means "no code applied yet", not "code cleared" —
  // once a code has resolved to a discount, re-fetching without it would
  // silently drop the discount, so this only ever gets set, not unset,
  // short of removing the last cart item (see below).
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const {
    data: items,
    isLoading: isCartLoading,
    isError: isCartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated })

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetCartSummaryQuery(appliedCode ? { code: appliedCode } : undefined, {
    skip: !isAuthenticated,
  })

  const [updateQuantity, { isLoading: isUpdatingQuantity }] = useUpdateCartItemQuantityMutation()
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation()

  // The backend silently no-ops an unknown/expired coupon code instead of
  // erroring (see cart-schemas.ts) — a submitted code that didn't resolve to
  // a `couponCode` in the response is surfaced here as an invalid-code error
  // rather than pretending it "applied" with zero discount.
  const couponError =
    appliedCode && summary && !summary.couponCode ? t("coupon.invalid") : null

  async function changeQuantity(bookId: number, quantity: number) {
    setMutationError(null)
    try {
      await updateQuantity({ bookId, quantity }).unwrap()
      await Promise.all([refetchCart(), refetchSummary()])
    } catch (error) {
      setMutationError(getCartErrorMessage(error, t("errors.generic")))
    }
  }

  async function removeFromCart(bookId: number) {
    setMutationError(null)
    try {
      await removeItem(bookId).unwrap()
      await Promise.all([refetchCart(), refetchSummary()])
    } catch (error) {
      setMutationError(getCartErrorMessage(error, t("errors.generic")))
    }
  }

  function applyCoupon(code: string) {
    setAppliedCode(code.trim())
  }

  return {
    isAuthenticated,
    items: items ?? [],
    isLoading: isCartLoading,
    isError: isCartError,
    summary,
    isSummaryLoading,
    appliedCode,
    couponError,
    applyCoupon,
    changeQuantity,
    removeFromCart,
    isMutating: isUpdatingQuantity || isRemoving,
    mutationError,
  }
}

export { useCart }
