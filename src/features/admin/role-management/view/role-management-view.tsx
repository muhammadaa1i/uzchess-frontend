"use client"

import { useTranslations } from "next-intl"

import { RoleManagementForm } from "@/features/admin/role-management/view/role-management-form"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"

// /admin/roles — this specific screen is superadmin-only (assigning
// admin/superadmin is a stricter operation than the rest of /admin, which
// only requires plain admin), even though /admin/layout.tsx's gate already
// let a plain admin this far. Same "plain in-page fallback instead of a
// redirect" pattern as profile-view.tsx's signed-out state — the layout
// already decided this visitor gets a chrome, we just decide what renders
// inside it.
function RoleManagementView() {
  const t = useTranslations("Admin.roleManagement")
  const { isSuperAdmin } = useAdminAccess()

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("notAuthorized")}</p>
      </div>
    )
  }

  return <RoleManagementForm />
}

export { RoleManagementView }
