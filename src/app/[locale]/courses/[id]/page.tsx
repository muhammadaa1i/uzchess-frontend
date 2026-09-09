import { CourseDetailView } from "@/features/course-detail/view/course-detail-view"

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetail({ params }: CourseDetailPageProps) {
  const { id } = await params

  return <CourseDetailView courseId={Number(id)} />
}
