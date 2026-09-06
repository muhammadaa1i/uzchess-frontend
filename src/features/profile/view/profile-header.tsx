"use client"

import { CheckIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/features/profile/model/profile-schemas"

interface ProfileHeaderProps {
  profile: Profile
}

// Purely presentational — read-only summary at the top of the dashboard
// shell, driven by GET /profile (see use-profile.ts). Editing happens in the
// General settings tab's forms, not here.
function ProfileHeader({ profile }: ProfileHeaderProps) {
  const t = useTranslations("Profile.header")
  const name = `${profile.firstName} ${profile.lastName}`

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <Avatar size="lg">
        <AvatarImage src={profile.avatar ?? undefined} alt={name} />
        <AvatarFallback>{profile.firstName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-brand-white">{name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-brand-secondary-low">{profile.email}</span>
          {profile.isEmailVerified ? (
            <Badge variant="secondary" className="gap-1">
              <CheckIcon className="text-brand-green" />
              {t("verified")}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XIcon className="text-brand-red" />
              {t("unverified")}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
