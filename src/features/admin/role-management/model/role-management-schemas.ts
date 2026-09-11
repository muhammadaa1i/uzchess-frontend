import { z } from "zod"

// POST /users/:id/roles — AssignRoleRequest/AssignRoleResponse
// (../backend/src/features/auth/user/commands/assign-role/*). The backend's
// `Role` enum also has `"user"`, but this screen is only for *promoting* an
// account, not demoting it back to the base role — see role.ts's comment on
// why "user" is intentionally excluded from what this screen can send.
const assignableRoleSchema = z.enum(["admin", "superadmin"])

const assignRoleRequestSchema = z.object({ role: assignableRoleSchema })

// AssignRoleResponse — `{ userId, roles }`, where `roles` is every role
// title the target user now holds (not just the one just assigned), per the
// handler's `assign-role.handler.ts` (`roles: [...existing, role.title]`).
const assignRoleResponseSchema = z.object({
  userId: z.number(),
  roles: z.array(z.string()),
})

type AssignableRole = z.infer<typeof assignableRoleSchema>

export { assignableRoleSchema, assignRoleRequestSchema, assignRoleResponseSchema }
export type { AssignableRole }
