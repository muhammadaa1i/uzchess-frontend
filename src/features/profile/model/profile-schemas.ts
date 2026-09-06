import { z } from "zod"

// GET /profile — GetProfileResponse (same shape as PATCH /profile's
// UpdateProfileResponse). The live OpenAPI doc marks avatar/email/birthDate
// as `type: object, nullable: true` (a Swagger-decorator quirk on the
// backend's DTO), but a real registered test account on the deployed
// backend returns plain strings — `email` always a string, `avatar`/
// `birthDate` nullable strings (`birthDate` as a full ISO datetime, e.g.
// "2000-01-15T00:00:00.000Z") — verified directly against the live API
// rather than trusting the OpenAPI shape as-is.
const profileSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  isEmailVerified: z.boolean(),
  birthDate: z.string().nullable(),
})

// PATCH /profile/password — ChangePasswordRequest/ChangePasswordResponse.
// This is the only "password reset" surface that exists on the backend —
// see CLAUDE.md's Auth section note on the missing forgot-password endpoint.
const changePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
})
const changePasswordResponseSchema = z.object({ message: z.string() })

// PATCH /profile/email — ChangeEmailRequest/ChangeEmailResponse. Sends a
// 6-digit code to `newEmail`; the change isn't finalized until
// POST /profile/email/confirm below. No dedicated "resend" endpoint exists
// for this flow (unlike signup's /profile/verify-email/resend) — re-calling
// this same mutation with the same body is how the viewmodel resends.
const changeEmailRequestSchema = z.object({
  currentPassword: z.string(),
  newEmail: z.string(),
})
const changeEmailResponseSchema = z.object({ message: z.string(), email: z.string() })

// POST /profile/email/confirm — ConfirmEmailRequest/ConfirmEmailResponse.
// Same 6-digit-code shape as signup's verify-email confirm
// (see @/features/auth/model/auth-schemas.ts) but a separate endpoint/cache
// — this one finalizes an in-flight email *change*, not initial signup
// verification. Codes expire (backend throws a GoneException on confirm,
// same as the signup flow).
const confirmEmailRequestSchema = z.object({ code: z.string().length(6) })
const confirmEmailResponseSchema = z.object({ message: z.string(), email: z.string() })

// GET /orders — GetOrdersResponse[] (see /swagger/account). Per CLAUDE.md's
// terminology note, this is the "purchased products" (books) list — books
// are bought via /cart -> /orders/checkout, not a separate "product" entity.
// Duplicated from Library's identical `orderSchema` (book-schemas.ts) rather
// than imported, per CLAUDE.md's code-splitting mandate (each feature's
// model layer is self-contained).
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

// GET /courses/purchased (GetCoursePurchasesResponse[]) and
// GET /courses/favourites (GetCourseFavouritesResponse[]) — both verified
// against the live /swagger/account-json and /swagger/courses-json specs to
// return the exact same base course shape as Courses' own
// `courseBaseSchema`. Duplicated here rather than imported across the
// feature boundary (same reasoning as orderSchema above).
const profileCourseItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  sectionsCount: z.number(),
  lessonsCount: z.number(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

// GET /favourites/read — GetFavouritesResponse[] (see /swagger/account), the
// "saved products" (books) list per the terminology note — same base shape
// as Library's `bookBaseSchema`, duplicated for the same reason.
const profileBookItemSchema = z.object({
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
})

type Profile = z.infer<typeof profileSchema>
type Order = z.infer<typeof orderSchema>
type OrderItem = z.infer<typeof orderItemSchema>
type ProfileCourseItem = z.infer<typeof profileCourseItemSchema>
type ProfileBookItem = z.infer<typeof profileBookItemSchema>

export {
  changeEmailRequestSchema,
  changeEmailResponseSchema,
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  confirmEmailRequestSchema,
  confirmEmailResponseSchema,
  orderItemSchema,
  orderSchema,
  orderStatusSchema,
  profileBookItemSchema,
  profileCourseItemSchema,
  profileSchema,
}
export type { Order, OrderItem, Profile, ProfileBookItem, ProfileCourseItem }
