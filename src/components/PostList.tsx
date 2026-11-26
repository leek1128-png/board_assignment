import Link from 'next/link'
import type { PostSummary } from '../types/post'
import { MyPostBadge } from './MyPostBadge'

interface PostListProps {
  posts: PostSummary[]
  searchQuery: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

export function PostList({ posts, searchQuery }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="status-box">
        <p className="status-box__desc">
          {searchQuery
            ? `'${searchQuery}'에 해당하는 게시글이 없어요.`
            : '아직 등록된 글이 없어요. 첫 글을 남겨보세요.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="list-row">
          <div className="list-row__title">
            <span>{post.title}</span>
            <MyPostBadge postId={post.id} />
          </div>
          <div className="list-row__meta">
            <span>{post.author || '익명'}</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>조회 {post.views.toLocaleString()}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
