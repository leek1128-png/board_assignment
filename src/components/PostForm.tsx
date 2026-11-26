'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { getEditToken, saveEditToken } from '../lib/tokenStorage'
import { createPost, updatePost } from '../services/postApi'
import type { PostDetail } from '../types/post'

interface PostFormProps {
  mode: 'create' | 'edit'
  initialPost?: PostDetail
}

const MAX_TITLE_LENGTH = 100
const MAX_CONTENT_LENGTH = 5000

export function PostForm({ mode, initialPost }: PostFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [content, setContent] = useState(initialPost?.content ?? '')
  const [manualToken, setManualToken] = useState('')
  const [hasStoredToken, setHasStoredToken] = useState(false)

  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initialPost) {
      const stored = getEditToken(initialPost.id)
      setHasStoredToken(Boolean(stored))
    }
  }, [mode, initialPost])

  const validate = (): boolean => {
    let valid = true
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle) {
      setTitleError('제목을 입력해 주세요.')
      valid = false
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`제목은 ${MAX_TITLE_LENGTH}자 이하로 입력해 주세요.`)
      valid = false
    } else {
      setTitleError(null)
    }

    if (!trimmedContent) {
      setContentError('내용을 입력해 주세요.')
      valid = false
    } else if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setContentError(`내용은 ${MAX_CONTENT_LENGTH.toLocaleString()}자 이하로 입력해 주세요.`)
      valid = false
    } else {
      setContentError(null)
    }

    return valid
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setSubmitError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
      }

      if (mode === 'create') {
        const res = await createPost(payload)
        if (res.editToken) {
          saveEditToken(res.post.id, res.editToken)
        }
        router.push(`/posts/${res.post.id}`)
        router.refresh()
        return
      }

      if (!initialPost) {
        setSubmitError('수정할 게시글 정보를 찾을 수 없어요.')
        return
      }

      const token = getEditToken(initialPost.id) ?? manualToken.trim()
      if (!token) {
        setSubmitError('이 글의 수정 권한 토큰을 찾을 수 없어요.')
        return
      }

      await updatePost(initialPost.id, payload, token)
      saveEditToken(initialPost.id, token)
      router.push(`/posts/${initialPost.id}`)
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="alert-box" role="alert">
          {submitError}
        </div>
      )}

      <div className="field-group">
        <div className="field-header">
          <label className="field-label" htmlFor="post-title">
            제목
          </label>
          <span className="field-counter">
            {title.length} / {MAX_TITLE_LENGTH}
          </span>
        </div>
        <input
          id="post-title"
          type="text"
          className="text-field"
          maxLength={MAX_TITLE_LENGTH}
          placeholder="제목을 입력해 주세요"
          value={title}
          disabled={isSubmitting}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError(null)
          }}
        />
        {titleError && <span className="field-error">{titleError}</span>}
      </div>

      <div className="field-group">
        <div className="field-header">
          <label className="field-label" htmlFor="post-content">
            내용
          </label>
          <span className="field-counter">
            {content.length} / {MAX_CONTENT_LENGTH.toLocaleString()}
          </span>
        </div>
        <textarea
          id="post-content"
          className="text-area"
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="내용을 입력해 주세요"
          value={content}
          disabled={isSubmitting}
          onChange={(e) => {
            setContent(e.target.value)
            if (contentError) setContentError(null)
          }}
        />
        {contentError && <span className="field-error">{contentError}</span>}
      </div>

      {mode === 'edit' && !hasStoredToken && (
        <div className="field-group">
          <label className="field-label" htmlFor="edit-token">
            작성자 관리 토큰
          </label>
          <input
            id="edit-token"
            type="password"
            className="text-field"
            placeholder="저장된 토큰이 없어 직접 입력이 필요해요"
            value={manualToken}
            disabled={isSubmitting}
            onChange={(e) => setManualToken(e.target.value)}
          />
        </div>
      )}

      <div className="bottom-cta-wrap">
        <button type="submit" className="btn btn--primary btn--xl" disabled={isSubmitting}>
          {isSubmitting
            ? mode === 'edit'
              ? '수정 중...'
              : '등록 중...'
            : mode === 'edit'
              ? '수정 완료'
              : '등록하기'}
        </button>
      </div>
    </form>
  )
}
