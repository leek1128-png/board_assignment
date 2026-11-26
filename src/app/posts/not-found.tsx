import Link from 'next/link'

export default function PostsNotFound() {
  return (
    <section className="status-box">
      <h2 className="status-box__title">게시글을 찾을 수 없어요</h2>
      <p className="status-box__desc">삭제되었거나 존재하지 않는 게시글이에요.</p>
      <Link href="/posts" className="btn btn--primary btn--l">
        목록으로 돌아가기
      </Link>
    </section>
  )
}
