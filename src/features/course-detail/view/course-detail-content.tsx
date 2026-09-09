"use client"

import { useTranslations } from "next-intl"

import type { CourseDetail } from "@/features/course-detail/model/course-detail-schemas"
import { CourseSectionsList } from "@/features/course-detail/view/course-sections-list"
import type { DetailSectionRow } from "@/features/course-detail/viewmodel/use-course-detail"
import { CourseReviewsSection } from "@/features/course-reviews/view/course-reviews-section"

interface CourseDetailContentProps {
  course: CourseDetail
  sections: DetailSectionRow[]
  isCompleted: boolean
}

// The one deliberate cross-feature view import in this split: the detail
// page directly embeds course-reviews' section rather than just linking to
// it, so it has to render course-reviews' component here. Everything else
// about reviews (model/viewmodel/state) lives entirely in that feature.
function CourseDetailContent({ course, sections, isCompleted }: CourseDetailContentProps) {
  const t = useTranslations("Courses.detail")

  return (
    <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium text-brand-white">{t("sectionsTitle")}</h2>
        <p className="text-sm text-brand-secondary-low">
          {t("sectionsSummary", {
            sections: course.sectionsCount,
            lessons: course.lessonsCount,
          })}
        </p>
        <CourseSectionsList courseId={course.id} sections={sections} />
      </div>

      <CourseReviewsSection courseId={course.id} canReview={isCompleted} />
    </div>
  )
}

export { CourseDetailContent }
