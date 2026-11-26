const TOKEN_STORAGE_KEY = 'week13_board_edit_tokens'

function readTokens(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {}
    }
    const result: Record<string, string> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string') {
        result[k] = v
      }
    }
    return result
  } catch {
    return {}
  }
}

export function saveEditToken(postId: number, editToken: string): void {
  if (typeof window === 'undefined' || !editToken) return
  const tokens = readTokens()
  tokens[String(postId)] = editToken
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
}

export function getEditToken(postId: number): string | null {
  return readTokens()[String(postId)] ?? null
}

export function removeEditToken(postId: number): void {
  if (typeof window === 'undefined') return
  const tokens = readTokens()
  delete tokens[String(postId)]
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
}

export function hasEditToken(postId: number): boolean {
  return Boolean(getEditToken(postId))
}
