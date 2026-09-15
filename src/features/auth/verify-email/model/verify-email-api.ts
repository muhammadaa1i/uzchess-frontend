import type { z } from "zod"

import {
  type verifyEmailConfirmRequestSchema,
  verifyEmailConfirmResponseSchema,
  verifyEmailResendResponseSchema,
} from "@/features/auth/verify-email/model/verify-email-schemas"
import { baseApi } from "@/lib/api/base-api"

// Verify-email's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate).
const verifyEmailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmailResend: builder.mutation<
      z.infer<typeof verifyEmailResendResponseSchema>,
      void
    >({
      query: () => ({ url: "/profile/verify-email/resend", method: "POST" }),
      transformResponse: (response: unknown) => verifyEmailResendResponseSchema.parse(response),
    }),
    verifyEmailConfirm: builder.mutation<
      z.infer<typeof verifyEmailConfirmResponseSchema>,
      z.infer<typeof verifyEmailConfirmRequestSchema>
    >({
      query: (body) => ({ url: "/profile/verify-email/confirm", method: "POST", body }),
      transformResponse: (response: unknown) => verifyEmailConfirmResponseSchema.parse(response),
    }),
  }),
})

const { useVerifyEmailResendMutation, useVerifyEmailConfirmMutation } = verifyEmailApi

export { verifyEmailApi, useVerifyEmailResendMutation, useVerifyEmailConfirmMutation }
