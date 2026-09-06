import type { z } from "zod"

import {
  type changeEmailRequestSchema,
  changeEmailResponseSchema,
  type changePasswordRequestSchema,
  changePasswordResponseSchema,
  type confirmEmailRequestSchema,
  confirmEmailResponseSchema,
  profileSchema,
} from "@/features/profile/model/profile-schemas"
import { baseApi } from "@/lib/api/base-api"

// PATCH /profile — UpdateProfileRequest, sent as multipart/form-data (see
// the live /swagger/account-json spec: `avatar` is `format: binary`). All
// fields are optional on the backend — only the ones the caller actually
// changed need to be present.
interface UpdateProfileBody {
  firstName?: string
  lastName?: string
  birthDate?: string
  avatar?: File
}

function toFormData(body: UpdateProfileBody): FormData {
  const formData = new FormData()
  if (body.firstName !== undefined) formData.append("firstName", body.firstName)
  if (body.lastName !== undefined) formData.append("lastName", body.lastName)
  if (body.birthDate !== undefined) formData.append("birthDate", body.birthDate)
  if (body.avatar) formData.append("avatar", body.avatar)
  return formData
}

// Profile's core RTK Query endpoints, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate). Split from
// profile-orders-api.ts/profile-favourites-api.ts by concern, same pattern
// as Courses splitting course-detail-api.ts/course-progress-api.ts/etc.
const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<z.infer<typeof profileSchema>, void>({
      query: () => ({ url: "/profile" }),
      transformResponse: (response: unknown) => profileSchema.parse(response),
    }),
    updateProfile: builder.mutation<z.infer<typeof profileSchema>, UpdateProfileBody>({
      // fetchBaseQuery leaves a FormData body untouched (no JSON.stringify,
      // no Content-Type override) — the browser sets the multipart boundary
      // header itself, matching what PATCH /profile expects.
      query: (body) => ({ url: "/profile", method: "PATCH", body: toFormData(body) }),
      transformResponse: (response: unknown) => profileSchema.parse(response),
    }),
    changePassword: builder.mutation<
      z.infer<typeof changePasswordResponseSchema>,
      z.infer<typeof changePasswordRequestSchema>
    >({
      query: (body) => ({ url: "/profile/password", method: "PATCH", body }),
      transformResponse: (response: unknown) => changePasswordResponseSchema.parse(response),
    }),
    changeEmail: builder.mutation<
      z.infer<typeof changeEmailResponseSchema>,
      z.infer<typeof changeEmailRequestSchema>
    >({
      query: (body) => ({ url: "/profile/email", method: "PATCH", body }),
      transformResponse: (response: unknown) => changeEmailResponseSchema.parse(response),
    }),
    confirmEmail: builder.mutation<
      z.infer<typeof confirmEmailResponseSchema>,
      z.infer<typeof confirmEmailRequestSchema>
    >({
      query: (body) => ({ url: "/profile/email/confirm", method: "POST", body }),
      transformResponse: (response: unknown) => confirmEmailResponseSchema.parse(response),
    }),
  }),
})

const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useConfirmEmailMutation,
} = profileApi

export {
  profileApi,
  useChangeEmailMutation,
  useChangePasswordMutation,
  useConfirmEmailMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
}
export type { UpdateProfileBody }
