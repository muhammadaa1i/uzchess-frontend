import { useState } from "react"

import { useDeleteCourseMutation } from "@/features/admin/course-list/model/course-list-api"

interface UseDeleteCourseOptions {
  courseId: number
  onDeleted: () => void
}

// Backs each row's delete confirmation — DELETE /courses/delete/{id}. Same
// self-contained trigger+dialog shape as use-delete-book.ts: `open` is this
// one row's own ephemeral UI state, not Redux.
function useDeleteCourse({ courseId, onDeleted }: UseDeleteCourseOptions) {
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation()
  const [open, setOpen] = useState(false)

  async function confirmDelete() {
    try {
      await deleteCourse(courseId).unwrap()
      onDeleted()
    } finally {
      setOpen(false)
    }
  }

  return { open, setOpen, confirmDelete, isLoading }
}

export { useDeleteCourse }
