"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import type { CourseAuthor } from "@/features/admin/course-reference-data/model/course-reference-data-schemas"

interface CourseAuthorCheckboxListProps {
  authors: CourseAuthor[]
  value: number[]
  onChange: (value: number[]) => void
}

// The `authorIds` picker — CreateCourseRequest/UpdateCourseRequest take an
// array of author ids (`ArrayNotEmpty`, at least one required), and there's
// no shadcn multi-select primitive installed (see components.json's
// currently installed set), so this is a plain scrollable checkbox list,
// same pattern as the sibling Books domain's book-author-checkbox-list.tsx.
// Lives in this reference-data slice (moved from course-editor) since it's
// driven entirely by the `authors` reference list this slice owns —
// course-editor-form.tsx wraps it in its own `Controller` the same way it
// wraps the sibling select fields.
function CourseAuthorCheckboxList({ authors, value, onChange }: CourseAuthorCheckboxListProps) {
  function toggle(authorId: number, checked: boolean) {
    onChange(checked ? [...value, authorId] : value.filter((id) => id !== authorId))
  }

  return (
    <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-lg border border-[#232627] bg-[#15181A] p-3">
      {authors.map((author) => (
        <FieldLabel key={author.id} htmlFor={`author-${author.id}`} className="font-normal">
          <Checkbox
            id={`author-${author.id}`}
            checked={value.includes(author.id)}
            onCheckedChange={(checked) => toggle(author.id, checked === true)}
          />
          {author.fullName}
        </FieldLabel>
      ))}
    </div>
  )
}

export { CourseAuthorCheckboxList }
