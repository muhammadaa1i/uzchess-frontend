"use client"

import type { Profile } from "@/features/profile/model/profile-schemas"
import { ProfileEditForm } from "@/features/profile/view/profile-edit-form"
import { ProfileEmailForm } from "@/features/profile/view/profile-email-form"
import { ProfilePasswordForm } from "@/features/profile/view/profile-password-form"

interface ProfileGeneralSectionProps {
  profile: Profile
  onProfileChanged: () => void
}

// "General settings" tab — composes the three independent forms (edit
// profile / change password / change email), each owning its own
// viewmodel hook per CLAUDE.md's single-responsibility guidance.
function ProfileGeneralSection({ profile, onProfileChanged }: ProfileGeneralSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <ProfileEditForm profile={profile} onSaved={onProfileChanged} />
      <ProfilePasswordForm />
      <ProfileEmailForm profile={profile} onConfirmed={onProfileChanged} />
    </div>
  )
}

export { ProfileGeneralSection }
