"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileCourseCard } from "@/features/profile/view/profile-course-card"
import { usePurchasedCourses } from "@/features/profile/viewmodel/use-purchased-courses"
import { Link } from "@/lib/i18n/navigation"

// "Purchased courses" tab — GET /courses/purchased.
function ProfilePurchasedCoursesSection() {
  const t = useTranslations("Profile.purchasedCourses")
  const { courses, isLoading, isError } = usePurchasedCourses()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError || courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("empty")}
        <Button size="sm" render={<Link href="/courses" />} nativeButton={false}>
          {t("browseCta")}
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <ProfileCourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export { ProfilePurchasedCoursesSection }
