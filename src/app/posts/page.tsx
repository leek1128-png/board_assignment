import Link from 'next/link'
import { Pagination } from '../../components/Pagination'
import { PostList } from '../../components/PostList'
import { SearchBar } from '../../components/SearchBar'
import { getPosts } from '../../services/postApi'

const PAGE_SIZE = 10

interface PostsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q?.trim() ?? ''
  const parsedPage = Number(resolvedParams.page ?? '1')
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const data = await getPosts({ q, page, size: PAGE_SIZE })

  return (
    <section>
      <div className="section-header">
        <h1 className="section-title">자유 게시판</h1>
        <span className="section-count">총 {data.total.toLocaleString()}개</span>
      </div>

      <SearchBar initialQuery={q} />

      <PostList posts={data.posts} searchQuery={q} />

      <Pagination currentPage={data.page} total={data.total} size={data.size} query={q} />

      <div className="bottom-cta-wrap">
        <Link href="/posts/new" className="btn btn--primary btn--xl">
          글쓰기
        </Link>
      </div>
    </section>
  )
}
