import type { z } from "zod"

import {
  type forgotPasswordRequestSchema,
  forgotPasswordResponseSchema,
  type resetPasswordRequestSchema,
  resetPasswordResponseSchema,
} from "@/features/auth/forgot-password/model/forgot-password-schemas"
import { baseApi } from "@/lib/api/base-api"

// Forgot/reset-password's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). Both
// endpoints are `@Public()` on the backend — no bearer token is required,
// though base-api.ts attaches one harmlessly if a stale one happens to be
// present.
const forgotPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      z.infer<typeof forgotPasswordResponseSchema>,
      z.infer<typeof forgotPasswordRequestSchema>
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: (response: unknown) => forgotPasswordResponseSchema.parse(response),
    }),
    resetPassword: builder.mutation<
      z.infer<typeof resetPasswordResponseSchema>,
      z.infer<typeof resetPasswordRequestSchema>
    >({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: (response: unknown) => resetPasswordResponseSchema.parse(response),
    }),
  }),
})

const { useForgotPasswordMutation, useResetPasswordMutation } = forgotPasswordApi

export { forgotPasswordApi, useForgotPasswordMutation, useResetPasswordMutation }
