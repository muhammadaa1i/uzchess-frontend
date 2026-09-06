import type { z } from "zod"

import {
  type createContactRequestSchema,
  createContactResponseSchema,
} from "@/features/contact/model/contact-schemas"
import { baseApi } from "@/lib/api/base-api"

// Contact feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). Public
// endpoint — no auth header required, matches the live backend accepting
// the request with no `Authorization` header.
const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<
      z.infer<typeof createContactResponseSchema>,
      z.infer<typeof createContactRequestSchema>
    >({
      query: (body) => ({ url: "/contact/create", method: "POST", body }),
      transformResponse: (response: unknown) => createContactResponseSchema.parse(response),
    }),
  }),
})

const { useCreateContactMutation } = contactApi

export { contactApi, useCreateContactMutation }
