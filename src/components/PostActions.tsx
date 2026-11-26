'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getEditToken, hasEditToken, removeEditToken } from '../lib/tokenStorage'
import { deletePost } from '../services/postApi'

interface PostActionsProps {
  postId: number
}

export function PostActions({ postId }: PostActionsProps) {
  const router = useRouter()
  const [isMine, setIsMine] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setIsMine(hasEditToken(postId))
  }, [postId])

  const handleDelete = async () => {
    if (isDeleting) return
    const token = getEditToken(postId)
    if (!token) {
      setErrorMessage('이 글의 삭제 권한을 찾을 수 없어요.')
      return
    }

    setIsDeleting(true)
    setErrorMessage(null)
    try {
      await deletePost(postId, token)
      removeEditToken(postId)
      setIsDialogOpen(false)
      router.push('/posts')
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '삭제하지 못했어요. 잠시 후 다시 시도해 주세요.'
      setErrorMessage(message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isMine) return null

  return (
    <>
      <div className="detail-actions">
        <Link href={`/posts/${postId}/edit`} className="btn btn--secondary btn--l" style={{ flex: 1 }}>
          수정하기
        </Link>
        <button
          type="button"
          className="btn btn--danger btn--l"
          style={{ flex: 1 }}
          onClick={() => setIsDialogOpen(true)}
        >
          삭제하기
        </button>
      </div>

      {isDialogOpen && (
        <div className="scrim" onClick={() => !isDeleting && setIsDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog__title">글을 삭제할까요?</h2>
            <p className="dialog__body">삭제한 글은 다시 되돌릴 수 없어요.</p>
            {errorMessage && (
              <div className="alert-box" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="dialog__actions">
              <button
                type="button"
                className="btn btn--danger btn--l"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? '삭제 중...' : '삭제하기'}
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--l"
                disabled={isDeleting}
                onClick={() => setIsDialogOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
