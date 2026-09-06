import { BookDetailView } from "@/features/library/view/book-detail-view"

interface BookDetailPageProps {
  params: Promise<{ "book-id": string }>
}

export default async function BookDetail({ params }: BookDetailPageProps) {
  const { "book-id": bookId } = await params

  return <BookDetailView bookId={Number(bookId)} />
}
