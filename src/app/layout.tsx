import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: '익명 게시판',
  description: 'Next.js App Router 기반 익명 게시판',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <header className="top-bar">
            <Link href="/posts" className="top-bar__brand">
              익명 게시판
            </Link>
            <nav className="top-bar__nav" aria-label="메인 메뉴">
              <Link href="/posts" className="nav-link">
                목록
              </Link>
              <Link href="/posts/new" className="nav-link nav-link--primary">
                글쓰기
              </Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
