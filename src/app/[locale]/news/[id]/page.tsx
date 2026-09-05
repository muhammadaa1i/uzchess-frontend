import { NewsDetailView } from "@/features/news/view/news-detail-view"

interface NewsDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetail({ params }: NewsDetailPageProps) {
  const { id } = await params

  return <NewsDetailView newsId={Number(id)} />
}
