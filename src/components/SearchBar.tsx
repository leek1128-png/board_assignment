'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

interface SearchBarProps {
  initialQuery: string
}

export function SearchBar({ initialQuery }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/posts?q=${encodeURIComponent(trimmed)}&page=1`)
    } else {
      router.push('/posts')
    }
  }

  return (
    <form className="search-wrap" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-field"
        placeholder="제목으로 검색해 보세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="제목 검색"
      />
      <button type="submit" className="btn btn--secondary btn--l">
        검색
      </button>
    </form>
  )
}
