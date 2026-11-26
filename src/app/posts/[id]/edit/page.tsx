import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostForm } from '../../../../components/PostForm'
import { ApiError, getPostById } from '../../../../services/postApi'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  let post
  try {
    // ?view=0으로 조회수 증가 방지
    post = await getPostById(id, { incrementView: false })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return (
    <section className="form-section">
      <Link href={`/posts/${post.id}`} className="detail-back">
        ← 게시글로 돌아가기
      </Link>
      <h1 className="detail-title" style={{ marginBottom: 20 }}>
        글 수정하기
      </h1>
      <PostForm mode="edit" initialPost={post} />
    </section>
  )
}
