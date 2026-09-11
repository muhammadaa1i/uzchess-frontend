"use client"

import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignableRoleSchema } from "@/features/admin/role-management/model/role-management-schemas"
import { useAssignRole } from "@/features/admin/role-management/viewmodel/use-assign-role"

const ASSIGNABLE_ROLES = assignableRoleSchema.options

// "Assign role" card — POST /users/:id/roles. No user picker: there's no
// `GET /users` listing/search endpoint on this backend (see CLAUDE.md's
// backend-gap note), so the target user is entered by their numeric id.
function RoleManagementForm() {
  const t = useTranslations("Admin.roleManagement")
  const { form, onSubmit, isLoading, formError, assignedRoles } = useAssignRole()

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <h2 className="text-base font-medium text-brand-white">{t("title")}</h2>
      <p className="text-sm text-brand-secondary-low">{t("description")}</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label={t("userIdLabel")}
          description={t("userIdDescription")}
          placeholder={t("userIdPlaceholder")}
          inputMode="numeric"
          errors={[form.formState.errors.userId]}
          {...form.register("userId")}
        />
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <Field>
              <FieldLabel>{t("roleLabel")}</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`roleOptions.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.role]} />
            </Field>
          )}
        />
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {assignedRoles && (
          <p className="text-sm text-brand-green">
            {t("success", { roles: assignedRoles.join(", ") })}
          </p>
        )}
        <Button type="submit" disabled={isLoading} className="self-start">
          {t("submit")}
        </Button>
      </form>
    </div>
  )
}

export { RoleManagementForm }
