"use client"

import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileBookCard } from "@/features/profile/view/profile-book-card"
import { ProfileCourseCard } from "@/features/profile/view/profile-course-card"
import { useSavedItems } from "@/features/profile/viewmodel/use-saved-items"

// "Saved items" tab. Per CLAUDE.md's terminology note, Figma's distinct
// "saved courses" / "saved products" labels map to two different backend
// lists (GET /courses/favourites vs. GET /favourites/read) but live under
// one nav item here, switched via an inner tab strip rather than two
// separate top-level nav entries.
function ProfileSavedItemsSection() {
  const t = useTranslations("Profile.saved")
  const { books, isBooksLoading, isBooksError, courses, isCoursesLoading, isCoursesError } =
    useSavedItems()

  return (
    <Tabs defaultValue="courses">
      <TabsList>
        <TabsTrigger value="courses">{t("tabs.courses")}</TabsTrigger>
        <TabsTrigger value="books">{t("tabs.books")}</TabsTrigger>
      </TabsList>

      <TabsContent value="courses" className="mt-4">
        {isCoursesLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : isCoursesError || courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
            {t("emptyCourses")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
              <ProfileCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="books" className="mt-4">
        {isBooksLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : isBooksError || books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
            {t("emptyBooks")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <ProfileBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export { ProfileSavedItemsSection }
