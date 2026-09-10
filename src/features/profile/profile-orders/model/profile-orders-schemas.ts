import { z } from "zod"

// GET /orders — GetOrdersResponse[] (see /swagger/account). Per CLAUDE.md's
// terminology note, this is the "purchased products" (books) list — books
// are bought via /cart -> /orders/checkout, not a separate "product" entity.
// Duplicated from Library's identical `orderSchema` (book-schemas.ts) and
// from Profile's own core schemas, per CLAUDE.md's code-splitting mandate
// (each feature's model layer is self-contained).
const orderItemSchema = z.object({
  bookId: z.number(),
  title: z.string(),
  cover: z.string(),
  price: z.number(),
})
const orderStatusSchema = z.enum(["processing", "delivered", "cancelled"])
const orderSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  totalPrice: z.number(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
})

type Order = z.infer<typeof orderSchema>
type OrderItem = z.infer<typeof orderItemSchema>

export { orderItemSchema, orderSchema, orderStatusSchema }
export type { Order, OrderItem }
