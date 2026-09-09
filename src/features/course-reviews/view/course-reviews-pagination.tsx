"use client"

import type { MouseEvent } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CourseReviewsPaginationProps {
  page: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function CourseReviewsPagination({
  page,
  hasNext,
  hasPrevious,
  onPageChange,
}: CourseReviewsPaginationProps) {
  function goTo(nextPage: number) {
    return (event: MouseEvent) => {
      event.preventDefault()
      onPageChange(nextPage)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page - 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { CourseReviewsPagination }
