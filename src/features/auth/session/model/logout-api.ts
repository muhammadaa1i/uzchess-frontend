import type { z } from "zod"

import { logoutResponseSchema } from "@/features/auth/session/model/logout-schemas"
import { baseApi } from "@/lib/api/base-api"

// Logout's own RTK Query endpoint, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate). Lives in `session`
// rather than its own slice since it's a session-termination action
// consumed directly by cross-feature call sites (SiteHeader, Profile), same
// as the `loggedOut` action it's paired with — not a flow being split out.
const logoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<z.infer<typeof logoutResponseSchema>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response: unknown) => logoutResponseSchema.parse(response),
    }),
  }),
})

const { useLogoutMutation } = logoutApi

export { logoutApi, useLogoutMutation }
