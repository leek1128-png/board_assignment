import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  total: number
  size: number
  query: string
}

function buildHref(page: number, query: string): string {
  const sp = new URLSearchParams()
  if (query) sp.set('q', query)
  sp.set('page', String(page))
  return `/posts?${sp.toString()}`
}

export function Pagination({ currentPage, total, size, query }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / size))
  if (totalPages <= 1) return null

  const prevPage = Math.max(1, currentPage - 1)
  const nextPage = Math.min(totalPages, currentPage + 1)

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <Link
        href={buildHref(prevPage, query)}
        className="btn btn--secondary btn--s"
        aria-disabled={currentPage <= 1}
      >
        이전
      </Link>
      <span className="pagination__info">
        {currentPage} / {totalPages}
      </span>
      <Link
        href={buildHref(nextPage, query)}
        className="btn btn--secondary btn--s"
        aria-disabled={currentPage >= totalPages}
      >
        다음
      </Link>
    </nav>
  )
}
