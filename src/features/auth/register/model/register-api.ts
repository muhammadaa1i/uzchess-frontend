import type { z } from "zod"

import {
  type registerRequestSchema,
  registerResponseSchema,
} from "@/features/auth/register/model/register-schemas"
import { baseApi } from "@/lib/api/base-api"

// Register's own RTK Query endpoint, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate).
const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      z.infer<typeof registerResponseSchema>,
      z.infer<typeof registerRequestSchema>
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: unknown) => registerResponseSchema.parse(response),
    }),
  }),
})

const { useRegisterMutation } = registerApi

export { registerApi, useRegisterMutation }
