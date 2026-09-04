import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { credentialsSet, loggedOut } from "@/features/auth/model/auth-slice"
import type { RootState } from "@/lib/store/store"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }
    return headers
  },
})

interface TokenPair {
  accessToken: string
  refreshToken: string
}

// Shared across concurrent requests that all 401 around the same time, so
// only one POST /auth/refresh goes out at once instead of one per failed
// request (the standard RTK Query "baseQueryWithReauth" pattern — see
// CLAUDE.md's Auth section, which calls this out explicitly).
let refreshPromise: Promise<TokenPair | null> | null = null

async function refreshTokens(
  api: BaseQueryApi,
  extraOptions: object
): Promise<TokenPair | null> {
  const { refreshToken } = (api.getState() as RootState).auth
  if (!refreshToken) return null

  const result = await rawBaseQuery(
    { url: "/auth/refresh", method: "POST", body: { refreshToken } },
    api,
    extraOptions
  )

  const data = result.data as Partial<TokenPair> | undefined
  if (!data?.accessToken || !data.refreshToken) return null

  return { accessToken: data.accessToken, refreshToken: data.refreshToken }
}

// Silent re-auth on a 401: try `/auth/refresh` once, retry the original
// request with the new access token, and log out (clearing persisted state)
// if the refresh itself fails.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    refreshPromise ??= refreshTokens(api, extraOptions).finally(() => {
      refreshPromise = null
    })
    const refreshed = await refreshPromise

    if (refreshed) {
      api.dispatch(credentialsSet(refreshed))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(loggedOut())
    }
  }

  return result
}

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})

export { baseApi }
