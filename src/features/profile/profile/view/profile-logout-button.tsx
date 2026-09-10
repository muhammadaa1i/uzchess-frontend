"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/profile/profile/viewmodel/use-logout"

// The Dialog's content (react-hook-form-free but still a Dialog, per
// CLAUDE.md's next/dynamic guidance for anything not visible on initial
// render) is loaded via next/dynamic(ssr:false) — only this trigger button
// stays in the always-loaded bundle, same split as course-detail-view.tsx's
// PurchaseModal/course-detail-price-panel.tsx pair.
const ProfileLogoutDialog = dynamic(
  () =>
    import("@/features/profile/profile/view/profile-logout-dialog").then((mod) => mod.ProfileLogoutDialog),
  { ssr: false }
)

// In-page logout entry point on the General settings card (Figma's third
// "Profile" frame) — a second, confirmation-gated logout path distinct from
// SiteHeader's immediate one-click logout in the avatar dropdown.
function ProfileLogoutButton() {
  const t = useTranslations("Profile.logout")
  const { open, setOpen, confirmLogout, isLoading } = useLogout()

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        {t("trigger")}
      </Button>
      <ProfileLogoutDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmLogout}
        isLoading={isLoading}
      />
    </>
  )
}

export { ProfileLogoutButton }
