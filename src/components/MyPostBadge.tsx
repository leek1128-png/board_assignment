'use client'

import { useEffect, useState } from 'react'
import { hasEditToken } from '../lib/tokenStorage'

interface MyPostBadgeProps {
  postId: number
}

export function MyPostBadge({ postId }: MyPostBadgeProps) {
  const [isMine, setIsMine] = useState(false)

  useEffect(() => {
    setIsMine(hasEditToken(postId))
  }, [postId])

  if (!isMine) return null

  return <span className="badge-mine">내 글</span>
}
