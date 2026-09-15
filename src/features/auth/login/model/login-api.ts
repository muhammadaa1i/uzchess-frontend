import type { z } from "zod"

import {
  type loginRequestSchema,
  loginResponseSchema,
} from "@/features/auth/login/model/login-schemas"
import { baseApi } from "@/lib/api/base-api"

// Login's own RTK Query endpoint, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate). POST /auth/refresh is
// deliberately not exposed here — it's only ever called internally by
// base-api.ts's baseQueryWithReauth wrapper, never by a component directly.
const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      z.infer<typeof loginResponseSchema>,
      z.infer<typeof loginRequestSchema>
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: unknown) => loginResponseSchema.parse(response),
    }),
  }),
})

const { useLoginMutation } = loginApi

export { loginApi, useLoginMutation }
