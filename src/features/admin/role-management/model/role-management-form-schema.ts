import { z } from "zod"

import { assignableRoleSchema } from "@/features/admin/role-management/model/role-management-schemas"

// The exact leaf keys under the "Admin.roleManagement.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// profile-form-schemas.ts's ValidationKey, kept local to this feature per
// CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey = "userIdRequired" | "userIdInvalid" | "roleRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the "assign role" form. `userId` comes in as a plain
// string from the numeric TextField (RHF/zod work on the field's string
// value; the viewmodel converts it to a number before calling the mutation)
// since there's no `GET /users` lookup/search endpoint to pick a user from —
// see CLAUDE.md's note on this backend gap.
function createAssignRoleFormSchema(t: ValidationT) {
  return z.object({
    userId: z
      .string()
      .trim()
      .min(1, t("userIdRequired"))
      .regex(/^\d+$/, t("userIdInvalid")),
    role: assignableRoleSchema,
  })
}

type AssignRoleFormValues = z.infer<ReturnType<typeof createAssignRoleFormSchema>>

export { createAssignRoleFormSchema }
export type { AssignRoleFormValues }
