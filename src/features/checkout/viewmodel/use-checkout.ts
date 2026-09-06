import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useCheckoutMutation, useGetCartSummaryQuery } from "@/features/checkout/model/checkout-api"
import { getCheckoutErrorMessage } from "@/features/checkout/model/checkout-error"
import {
  createCheckoutFormSchema,
  type CheckoutFormValues,
} from "@/features/checkout/model/checkout-form-schema"
import type { CheckoutResponse } from "@/features/checkout/model/checkout-schemas"
import { useAppSelector } from "@/lib/store/hooks"

type CheckoutStep = "form" | "success" | "fail"

// `code` is the coupon code carried over from the Cart page's applied
// coupon via the /checkout?code= query param (see checkout-schemas.ts) — this
// hook never lets the checkout page re-apply/edit it, it's read-only here.
function useCheckout(code?: string) {
  const t = useTranslations("Checkout")
  const tValidation = useTranslations("Checkout.validation")
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)
  const [step, setStep] = useState<CheckoutStep>("form")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [order, setOrder] = useState<CheckoutResponse | null>(null)

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetCartSummaryQuery(code ? { code } : undefined, { skip: !isAuthenticated })
  const [submitOrder, { isLoading: isSubmitting }] = useCheckoutMutation()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(createCheckoutFormSchema(tValidation)),
    defaultValues: { fullName: "", phone: "", email: "" },
  })

  // `GET /delivery-setting` is admin-only on the live backend (controller-wide
  // `@Roles(Role.Admin)`, confirmed against backend source — a regular
  // customer gets a 403), and redundant besides: `GET /cart/summary` already
  // returns the correctly-computed `deliveryFee`/`total` for the current cart
  // (see `GetCartSummaryHandler`, which reads the same `DeliverySetting` row
  // server-side). Read the fee/total straight off `summary` instead of
  // calling the admin endpoint and recomputing locally.
  const deliveryFee = summary?.deliveryFee ?? 0
  const total = summary?.total

  // The checkout page only fetches the aggregate `cart/summary`, not the
  // item list (that's Cart's own concern) — an empty cart's summary comes
  // back as all-zero (`subtotal: 0`, see GetCartSummaryHandler), which is a
  // reliable enough signal to gate the form: navigating to /checkout
  // directly with nothing in the cart otherwise renders a fully interactive
  // form for a request the backend rejects on submit with 404 "Cart is
  // empty" — showing this state up front instead avoids that dead-end.
  const isCartEmpty = !isSummaryLoading && !!summary && summary.subtotal === 0

  async function onSubmit(values: CheckoutFormValues) {
    setErrorMessage(null)
    try {
      const response = await submitOrder({
        fullName: values.fullName,
        phone: `+998${values.phone.replace(/\D/g, "")}`,
        email: values.email,
        code,
      }).unwrap()
      setOrder(response)
      setStep("success")
    } catch (error) {
      setErrorMessage(getCheckoutErrorMessage(error, t("errors.generic")))
      setStep("fail")
    }
  }

  return {
    isAuthenticated,
    summary,
    deliveryFee,
    total,
    isSummaryLoading,
    isSummaryError,
    isCartEmpty,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    step,
    order,
    errorMessage,
    retry: () => setStep("form"),
  }
}

export { useCheckout }
