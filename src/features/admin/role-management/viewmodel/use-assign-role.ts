import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useAssignRoleMutation } from "@/features/admin/role-management/model/role-management-api"
import { getRoleManagementErrorMessage } from "@/features/admin/role-management/model/role-management-error"
import {
  type AssignRoleFormValues,
  createAssignRoleFormSchema,
} from "@/features/admin/role-management/model/role-management-form-schema"

// Drives the "Assign role" form — POST /users/:id/roles. Same
// try/unwrap/catch + local success/error message shape as
// use-change-password.ts; no dedicated Redux slice, since all state here is
// this one form's own submission status (per CLAUDE.md, ephemeral view-local
// state doesn't need to go through Redux).
function useAssignRole() {
  const t = useTranslations("Admin.roleManagement")
  const tValidation = useTranslations("Admin.roleManagement.validation")
  const [assignRole, { isLoading }] = useAssignRoleMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [assignedRoles, setAssignedRoles] = useState<string[] | null>(null)

  const form = useForm<AssignRoleFormValues>({
    resolver: zodResolver(createAssignRoleFormSchema(tValidation)),
    defaultValues: { userId: "", role: "admin" },
  })

  async function onSubmit(values: AssignRoleFormValues) {
    setFormError(null)
    setAssignedRoles(null)
    try {
      const result = await assignRole({
        userId: Number(values.userId),
        body: { role: values.role },
      }).unwrap()
      setAssignedRoles(result.roles)
      form.reset({ userId: "", role: "admin" })
    } catch (error) {
      setFormError(getRoleManagementErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    formError,
    assignedRoles,
  }
}

export { useAssignRole }
