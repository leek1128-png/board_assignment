import Link from 'next/link'
import { PostForm } from '../../../components/PostForm'

export default function NewPostPage() {
  return (
    <section className="form-section">
      <Link href="/posts" className="detail-back">
        ← 목록으로
      </Link>
      <h1 className="detail-title" style={{ marginBottom: 20 }}>
        새 글 쓰기
      </h1>
      <PostForm mode="create" />
    </section>
  )
}
