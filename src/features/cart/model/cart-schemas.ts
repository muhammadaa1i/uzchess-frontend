import { z } from "zod"

// GET /cart/read — GetCartItemsResponse[] (see /swagger/account, "Book Cart").
// Same base shape as Library's `bookBaseSchema` (see
// @/features/library/model/book-schemas.ts) plus `quantity`, but duplicated
// here rather than imported — each feature's model layer is self-contained
// per CLAUDE.md's code-splitting mandate (endpoints/types for one feature
// must not be reachable through another feature's file), same pattern
// Courses/Library already follow for their own duplicated error helpers.
const cartItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  pageCount: z.number(),
  publishedYear: z.number(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number(),
  ratingsCount: z.number(),
  quantity: z.number(),
})

// GET /cart/summary?code= — GetCartSummaryResponse. `couponCode` echoes back
// the resolved (case-normalized) code when it matched an active, unexpired
// coupon, and is `null` when the given code didn't resolve to a discount —
// the backend silently no-ops an unknown/expired code rather than erroring
// (confirmed against the live `resolveCoupon` handler), so the UI treats a
// `couponCode: null` response after submitting a code as "invalid code"
// rather than surfacing a distinct error from the server.
const cartSummarySchema = z.object({
  subtotal: z.number(),
  itemDiscount: z.number(),
  couponCode: z.string().nullable().optional(),
  couponDiscount: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
})

// PATCH /cart/update/{id} — UpdateCartItemQuantityRequest/Response. Backend
// enforces `quantity >= 1` (class-validator `@Min(1)`) — decrementing to 0
// isn't a valid update, removal is a separate call (`DELETE /cart/remove/{id}`).
const updateCartItemQuantityResponseSchema = z.object({
  bookId: z.number(),
  quantity: z.number(),
})

// DELETE /cart/remove/{id} — RemoveCartItemResponse.
const removeCartItemResponseSchema = z.object({ message: z.string() })

type CartItem = z.infer<typeof cartItemSchema>
type CartSummary = z.infer<typeof cartSummarySchema>

export {
  cartItemSchema,
  cartSummarySchema,
  removeCartItemResponseSchema,
  updateCartItemQuantityResponseSchema,
}
export type { CartItem, CartSummary }
