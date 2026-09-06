"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { BookRatingWidget } from "@/features/library/view/book-rating-widget"
import { useBookDetail } from "@/features/library/viewmodel/use-book-detail"
import { useAppDispatch } from "@/lib/store/hooks"
import { formatPrice } from "@/lib/utils"

interface BookDetailViewProps {
  bookId: number
}

function BookDetailView({ bookId }: BookDetailViewProps) {
  const t = useTranslations("Library.detail")
  const tLibrary = useTranslations("Library")
  const dispatch = useAppDispatch()
  const {
    book,
    category,
    difficulty,
    authors,
    isLoading,
    isError,
    refetch,
    isAuthenticated,
    isPurchased,
    addToCart,
    isAddingToCart,
    justAdded,
    cartError,
  } = useBookDetail(bookId)

  if (isLoading) {
    return <BookDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {tLibrary("notFound")}
        </div>
      </div>
    )
  }

  function handleAddToCart() {
    if (!isAuthenticated) {
      dispatch(authModalOpened("sign-in"))
      return
    }
    addToCart()
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-dark-2">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && <Badge variant="secondary">{category.title}</Badge>}
            {difficulty && (
              <Badge variant="secondary" className="gap-1.5">
                <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
                {difficulty.degree}
              </Badge>
            )}
            {isPurchased && <Badge>{t("purchasedBadge")}</Badge>}
          </div>

          <h1 className="text-2xl font-medium text-brand-white">{book.title}</h1>

          {authors.length > 0 && (
            <p className="text-sm text-brand-secondary-low">
              {t("byAuthors", { authors: authors.map((author) => author.fullName).join(", ") })}
            </p>
          )}

          <div className="flex items-center gap-1 text-sm text-brand-secondary-low">
            <StarIcon className="size-4 fill-brand-yellow text-brand-yellow" />
            {book.averageRating.toFixed(1)} ({book.ratingsCount})
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-brand-secondary-low">
            <span>{t("pageCount", { count: book.pageCount })}</span>
            <span>{t("publishedYear", { year: book.publishedYear })}</span>
          </div>

          <p className="text-sm whitespace-pre-line text-brand-secondary-low">
            {book.description}
          </p>

          <div className="mt-2 flex flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4 sm:max-w-xs">
            <div className="flex items-center gap-2">
              {book.discountPrice ? (
                <>
                  <span className="text-2xl font-semibold text-brand-white">
                    {formatPrice(book.discountPrice)}
                  </span>
                  <span className="text-sm text-brand-secondary-low line-through">
                    {formatPrice(book.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-brand-white">
                  {formatPrice(book.price)}
                </span>
              )}
            </div>

            {isPurchased ? (
              <p className="text-sm text-brand-green">{t("purchasedNotice")}</p>
            ) : (
              <>
                <Button onClick={handleAddToCart} disabled={isAddingToCart}>
                  {t("addToCartCta")}
                </Button>
                {justAdded && <p className="text-sm text-brand-green">{t("addedToCart")}</p>}
                {cartError && <p className="text-sm text-destructive">{cartError}</p>}
              </>
            )}
          </div>

          <BookRatingWidget bookId={book.id} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full rounded" />
            ))}
          </div>
          <Skeleton className="h-32 w-full max-w-xs rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export { BookDetailView }
