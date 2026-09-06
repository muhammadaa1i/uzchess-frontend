import type { CourseListItem } from "@/features/courses/model/course-schemas"
import type { BookListItem } from "@/features/library/model/book-schemas"
import type { NewsItem } from "@/features/news/model/news-schemas"
import type { SearchResultItem } from "@/features/search/model/search-schemas"

// GET /news/read, /courses/read and /books/read each accept a `search`
// query param (matched on title only, per CLAUDE.md's Home to-do) but there
// is no unified/global search endpoint on the backend — the viewmodel fans
// out to all three list endpoints and these mappers reshape each feature's
// own list-item type into the shared `SearchResultItem` row so the view can
// render one row component regardless of source. Detail route paths mirror
// each feature's own routing (news -> /news/[id], courses -> /courses/[id],
// library -> /library/[book-id]).
function toNewsSearchResults(items: NewsItem[]): SearchResultItem[] {
  return items.map((item) => ({
    id: item.id,
    type: "news",
    title: item.title,
    imageUrl: item.imageUrl ?? null,
    href: `/news/${item.id}`,
  }))
}

function toCourseSearchResults(items: CourseListItem[]): SearchResultItem[] {
  return items.map((item) => ({
    id: item.id,
    type: "course",
    title: item.title,
    imageUrl: item.cover,
    href: `/courses/${item.id}`,
  }))
}

function toBookSearchResults(items: BookListItem[]): SearchResultItem[] {
  return items.map((item) => ({
    id: item.id,
    type: "book",
    title: item.title,
    imageUrl: item.cover,
    href: `/library/${item.id}`,
  }))
}

export { toBookSearchResults, toCourseSearchResults, toNewsSearchResults }
