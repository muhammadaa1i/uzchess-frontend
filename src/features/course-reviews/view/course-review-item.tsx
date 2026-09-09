import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { CourseReview } from "@/features/course-reviews/model/course-review-schemas"
import { cn, formatDate } from "@/lib/utils"

interface CourseReviewItemProps {
  review: CourseReview
}

function CourseReviewItem({ review }: CourseReviewItemProps) {
  return (
    <li className="flex gap-3 py-4">
      <Avatar size="sm">
        <AvatarFallback>{review.userFullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-white">{review.userFullName}</span>
          <span className="text-xs text-brand-secondary-low">{formatDate(review.createdAt)}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarIcon
              key={value}
              className={cn(
                "size-3.5 text-brand-secondary-low",
                review.score >= value && "fill-brand-yellow text-brand-yellow"
              )}
            />
          ))}
        </div>
        {review.comment && <p className="text-sm text-brand-secondary-low">{review.comment}</p>}
      </div>
    </li>
  )
}

export { CourseReviewItem }
