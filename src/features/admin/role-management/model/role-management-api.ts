import type { z } from "zod"

import {
  type assignRoleRequestSchema,
  assignRoleResponseSchema,
} from "@/features/admin/role-management/model/role-management-schemas"
import { baseApi } from "@/lib/api/base-api"

// This feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). Same
// `{ id, body }` mutation-arg shape as course-detail-api.ts's
// `purchaseCourse` — the id is a URL param, the body is the JSON payload.
const roleManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignRole: builder.mutation<
      z.infer<typeof assignRoleResponseSchema>,
      { userId: number; body: z.infer<typeof assignRoleRequestSchema> }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/roles`,
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => assignRoleResponseSchema.parse(response),
    }),
  }),
})

const { useAssignRoleMutation } = roleManagementApi

export { roleManagementApi, useAssignRoleMutation }
