import { z } from "zod"

// POST /orders/checkout — CreateOrderRequest. `phone` must match the
// backend's `^\+998\d{9}$` validator exactly (confirmed against the live
// class-validator DTO) — the request body always carries the full `+998...`
// string; the UI only collects the local 9 digits via TextField's `phone`
// variant (see checkout-form-schema.ts) and prefixes it before sending.
// `code` is the coupon code carried over from the Cart page's applied
// coupon, if any — optional, and silently ignored by the backend if it
// doesn't resolve to an active coupon (see @/features/cart/model/cart-schemas.ts).
const checkoutRequestSchema = z.object({
  fullName: z.string(),
  phone: z.string().regex(/^\+998\d{9}$/),
  email: z.string().email(),
  code: z.string().optional(),
})

// CreateOrderResponse.
const checkoutResponseSchema = z.object({
  id: z.number(),
  status: z.enum(["processing", "delivered", "cancelled"]),
  totalPrice: z.number(),
  orderNumber: z.string(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

// GET /cart/summary?code= — GetCartSummaryResponse, duplicated from
// @/features/cart/model/cart-schemas.ts rather than imported (each feature's
// model layer is self-contained per CLAUDE.md's code-splitting mandate, same
// pattern Library's book-detail-api.ts follows for /cart/add/{id}). Read
// here purely to render the order-summary sidebar on the checkout page — the
// coupon code itself was already resolved on the Cart page and is only
// carried forward (via the `code` query param on the /checkout link, see
// checkout-schemas.ts's checkoutRequestSchema comment), never re-entered here.
const cartSummarySchema = z.object({
  subtotal: z.number(),
  itemDiscount: z.number(),
  couponCode: z.string().nullable().optional(),
  couponDiscount: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
})

// NOTE: `GET /delivery-setting` (see /swagger/books, "Delivery Setting") is
// NOT used here despite CLAUDE.md's checkout to-do suggesting it as the
// shipping-fee source — confirmed against the live backend that its
// controller is gated `@Roles(Role.Admin)` entirely, so a real customer gets
// a 403 calling it. `GET /cart/summary`'s `deliveryFee`/`total` fields
// (below) are already computed server-side from the same `DeliverySetting`
// row and are what the checkout page actually reads — see use-checkout.ts.

type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
type CheckoutResponse = z.infer<typeof checkoutResponseSchema>
type CartSummary = z.infer<typeof cartSummarySchema>

export { cartSummarySchema, checkoutRequestSchema, checkoutResponseSchema }
export type { CartSummary, CheckoutRequest, CheckoutResponse }
