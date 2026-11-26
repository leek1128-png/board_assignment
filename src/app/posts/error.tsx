'use client'

interface PostsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PostsError({ error, reset }: PostsErrorProps) {
  return (
    <section className="status-box">
      <h2 className="status-box__title">게시글을 불러오지 못했어요</h2>
      <p className="status-box__desc">
        {error.message || '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'}
      </p>
      <button type="button" className="btn btn--primary btn--l" onClick={reset}>
        다시 시도하기
      </button>
    </section>
  )
}
