// Mirrors ../backend/src/core/enums/role/role.enum.ts. Never exposed on any
// REST response (not GetProfileResponse, not Login/RegisterResponse) — only
// exists as a `roles` claim inside the JWT access token, see jwt.ts.
type Role = "user" | "admin" | "superadmin"

export type { Role }
