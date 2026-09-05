import { z } from "zod"

// GET /courses/{id}/lessons — GetCourseLessonsResponse (Lesson Progress
// group, see /swagger/courses). This is the authenticated,
// progress/purchase-aware counterpart to course-schemas.ts's plain
// `courseLessonSchema` (from the public GET /courses/read/{id}): `video` is
// nulled out server-side when `locked` is true, and `completed` reflects
// this specific user's LessonProgress rows.
const courseLessonProgressSchema = z.object({
  id: z.number(),
  title: z.string(),
  video: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  duration: z.number(),
  order: z.number(),
  locked: z.boolean(),
  completed: z.boolean(),
})

const courseSectionProgressSchema = z.object({
  id: z.number(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(courseLessonProgressSchema),
})

const courseLessonsProgressResponseSchema = z.object({
  sections: z.array(courseSectionProgressSchema),
})

// GET /courses/lessons/{id}/next — GetNextLessonResponse. `lessonId`/`locked`/
// `video` are all null when `hasNext` is false (last lesson in the course).
const nextLessonResponseSchema = z.object({
  hasNext: z.boolean(),
  lessonId: z.number().nullable().optional(),
  locked: z.boolean().nullable().optional(),
  video: z.string().nullable().optional(),
})

// POST /courses/lessons/{id}/complete — CreateLessonProgressResponse.
const completeLessonResponseSchema = z.object({
  id: z.number(),
  lessonId: z.number(),
  userId: z.number(),
})

type CourseLessonProgress = z.infer<typeof courseLessonProgressSchema>
type CourseSectionProgress = z.infer<typeof courseSectionProgressSchema>
type NextLessonResult = z.infer<typeof nextLessonResponseSchema>

export {
  completeLessonResponseSchema,
  courseLessonProgressSchema,
  courseLessonsProgressResponseSchema,
  courseSectionProgressSchema,
  nextLessonResponseSchema,
}
export type { CourseLessonProgress, CourseSectionProgress, NextLessonResult }
