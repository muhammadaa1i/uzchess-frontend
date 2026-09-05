import { LessonView } from "@/features/courses/view/lesson-view"

interface LessonPageProps {
  params: Promise<{ id: string; "lesson-id": string }>
}

export default async function Lesson({ params }: LessonPageProps) {
  const { id, "lesson-id": lessonId } = await params

  return <LessonView courseId={Number(id)} lessonId={Number(lessonId)} />
}
