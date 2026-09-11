"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import type { BookAuthor } from "@/features/admin/book-editor/model/book-editor-schemas"

interface BookAuthorCheckboxListProps {
  authors: BookAuthor[]
  value: number[]
  onChange: (value: number[]) => void
}

// The `authorIds` picker — CreateBookRequest/UpdateBookRequest take an array
// of author ids (`ArrayNotEmpty`, at least one required), and there's no
// shadcn multi-select primitive installed (see components.json's currently
// installed set), so this is a plain scrollable checkbox list, same
// Checkbox primitive as sign-up-form.tsx's `acceptTerms` field. One
// component per file per CLAUDE.md/feedback conventions rather than
// colocating this inline in book-editor-form.tsx.
function BookAuthorCheckboxList({ authors, value, onChange }: BookAuthorCheckboxListProps) {
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

export { BookAuthorCheckboxList }
