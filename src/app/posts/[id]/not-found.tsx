import Link from 'next/link'

export default function PostDetailNotFound() {
  return (
    <section className="status-box">
      <h2 className="status-box__title">게시글을 찾을 수 없어요</h2>
      <p className="status-box__desc">이미 삭제되었거나 잘못된 주소예요.</p>
      <Link href="/posts" className="btn btn--primary btn--l">
        목록으로 돌아가기
      </Link>
    </section>
  )
}
