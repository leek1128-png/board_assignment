import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostActions } from '../../../components/PostActions'
import { ApiError, getPostById } from '../../../services/postApi'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  let post
  try {
    post = await getPostById(id, { incrementView: true })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return (
    <article className="detail-article">
      <Link href="/posts" className="detail-back">
        ← 목록으로
      </Link>

      <h1 className="detail-title">{post.title}</h1>
      <div className="list-row__meta detail-meta">
        <span>{post.author || '익명'}</span>
        <span>{formatDate(post.createdAt)}</span>
        <span>조회 {post.views.toLocaleString()}</span>
      </div>

      <p className="detail-content">{post.content}</p>

      <PostActions postId={post.id} />
    </article>
  )
}
