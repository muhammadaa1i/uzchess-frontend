"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { ProfileGeneralSection } from "@/features/profile/view/profile-general-section"
import { ProfileHeader } from "@/features/profile/view/profile-header"
import { ProfileOrdersSection } from "@/features/profile/view/profile-orders-section"
import { ProfilePurchasedCoursesSection } from "@/features/profile/view/profile-purchased-courses-section"
import { ProfileSavedItemsSection } from "@/features/profile/view/profile-saved-items-section"
import { useProfile } from "@/features/profile/viewmodel/use-profile"
import { useAppDispatch } from "@/lib/store/hooks"

// Dashboard shell — left-nav Tabs (general settings / purchased courses /
// orders / saved items) per CLAUDE.md's Profile section. Same
// sign-in-required guard as Courses' lesson screen
// (@/features/courses/view/lesson-view.tsx): the whole page is gated behind
// auth, so an unauthenticated visit opens the sign-in modal and renders a
// plain fallback instead of any dashboard chrome.
function ProfileView() {
  const t = useTranslations("Profile")
  const tNav = useTranslations("Profile.nav")
  const dispatch = useAppDispatch()
  const { isAuthenticated, profile, isLoading, isError, refetch } = useProfile()

  useEffect(() => {
    if (!isAuthenticated) dispatch(authModalOpened("sign-in"))
  }, [isAuthenticated, dispatch])

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
      </div>
    )
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("notFound")}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <ProfileHeader profile={profile} />

      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="flex-col items-start gap-6 lg:flex-row"
      >
        <TabsList className="h-auto w-full shrink-0 lg:w-64">
          <TabsTrigger value="general">{tNav("general")}</TabsTrigger>
          <TabsTrigger value="purchasedCourses">{tNav("purchasedCourses")}</TabsTrigger>
          <TabsTrigger value="orders">{tNav("orders")}</TabsTrigger>
          <TabsTrigger value="saved">{tNav("saved")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="w-full">
          <ProfileGeneralSection profile={profile} onProfileChanged={refetch} />
        </TabsContent>
        <TabsContent value="purchasedCourses" className="w-full">
          <ProfilePurchasedCoursesSection />
        </TabsContent>
        <TabsContent value="orders" className="w-full">
          <ProfileOrdersSection />
        </TabsContent>
        <TabsContent value="saved" className="w-full">
          <ProfileSavedItemsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[256px_1fr]">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  )
}

export { ProfileView }
