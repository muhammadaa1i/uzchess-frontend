import type { Role } from "@/features/auth/model/role"

// Decodes the JWT payload segment purely for UI gating (which admin nav
// items/routes to show) — this is never a security boundary, the backend's
// @Roles() guard is (see login.handler.ts: jwtPayload = { id, roles }).
// Malformed/expired tokens degrade to "no roles" rather than throwing.
function decodeAccessTokenRoles(accessToken: string | null): Role[] {
  if (!accessToken) {
    return []
  }

  try {
    const payloadSegment = accessToken.split(".")[1]
    const json = atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/"))
    const payload = JSON.parse(json) as { roles?: unknown }
    return Array.isArray(payload.roles) ? (payload.roles as Role[]) : []
  } catch {
    return []
  }
}

export { decodeAccessTokenRoles }
