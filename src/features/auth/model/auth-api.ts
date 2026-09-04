import type { z } from "zod"

import {
  type loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  type registerRequestSchema,
  registerResponseSchema,
  type verifyEmailConfirmRequestSchema,
  verifyEmailConfirmResponseSchema,
  verifyEmailResendResponseSchema,
} from "@/features/auth/model/auth-schemas"
import { baseApi } from "@/lib/api/base-api"

// Auth's own RTK Query endpoints, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate). POST /auth/refresh is
// deliberately not exposed here — it's only ever called internally by
// base-api.ts's baseQueryWithReauth wrapper, never by a component directly.
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      z.infer<typeof registerResponseSchema>,
      z.infer<typeof registerRequestSchema>
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: unknown) => registerResponseSchema.parse(response),
    }),
    login: builder.mutation<
      z.infer<typeof loginResponseSchema>,
      z.infer<typeof loginRequestSchema>
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: unknown) => loginResponseSchema.parse(response),
    }),
    logout: builder.mutation<z.infer<typeof logoutResponseSchema>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response: unknown) => logoutResponseSchema.parse(response),
    }),
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

const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailResendMutation,
  useVerifyEmailConfirmMutation,
} = authApi

export {
  authApi,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailResendMutation,
  useVerifyEmailConfirmMutation,
}
