import { z } from "zod"

// POST /courses/{id}/purchase — CreatePurchaseRequest/CreatePurchaseResponse.
// The backend's CreatePurchaseHandler is a mocked/instant payment flow (sets
// the purchase straight to "success", no real gateway redirect), but the
// request still requires picking a `provider` — kept as a real field here
// rather than hardcoding one, since the backend validates it.
const purchaseProviderSchema = z.enum(["paylov", "payme", "click", "uzum"])
const createPurchaseRequestSchema = z.object({ provider: purchaseProviderSchema })
const purchaseStatusSchema = z.enum(["pending", "success", "failed"])
const createPurchaseResponseSchema = z.object({
  id: z.number(),
  courseId: z.number(),
  userId: z.number(),
  status: purchaseStatusSchema,
})

export {
  createPurchaseRequestSchema,
  createPurchaseResponseSchema,
  purchaseProviderSchema,
  purchaseStatusSchema,
}
