import { z } from "zod"

// The exact leaf keys under the "Checkout.validation" message namespace (see
// messages/*.json) — same "translator function typed as an exhaustive key
// union" trick used by Contact/Auth's form schemas, so RHF+zod messages can
// react to the active next-intl locale.
type ValidationKey =
  | "fullNameRequired"
  | "phoneRequired"
  | "phoneInvalid"
  | "emailRequired"
  | "emailInvalid"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the checkout shipping/contact form — POST
// /orders/checkout's `CreateOrderRequest` (see checkout-schemas.ts). The
// `phone` field only collects the local 9 digits (TextField's `phone`
// variant renders the "+998" prefix visually, matching Auth/Contact's
// convention) — kept as a plain validated string here rather than a zod
// `.transform()` (no other form schema in this codebase reshapes its output
// type), the "+998" prefix + digit-stripping happens in
// use-checkout.ts's submit handler right before the request is sent.
function createCheckoutFormSchema(t: ValidationT) {
  return z.object({
    fullName: z.string().trim().min(1, t("fullNameRequired")).max(128),
    phone: z
      .string()
      .trim()
      .min(1, t("phoneRequired"))
      .refine((value) => value.replace(/\D/g, "").length === 9, t("phoneInvalid")),
    email: z.string().trim().min(1, t("emailRequired")).max(128).email(t("emailInvalid")),
  })
}

type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutFormSchema>>

export { createCheckoutFormSchema }
export type { CheckoutFormValues }
