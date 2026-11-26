import type {
  ApiErrorResponse,
  CreatePostRequest,
  CreatePostResponse,
  PostDetail,
  PostListParams,
  PostListResponse,
  UpdatePostRequest,
} from '../types/post'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return (
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:3000'
    ).replace(/\/$/, '')
  }
  return (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null) {
    const record = data as ApiErrorResponse
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message
    }
    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error
    }
  }
  return fallback
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (res.status === 204) {
    return undefined as T
  }

  const data: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const message = extractErrorMessage(
      data,
      '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    )
    throw new ApiError(message, res.status)
  }

  if (data === null) {
    throw new ApiError('서버 응답을 읽지 못했어요.', res.status)
  }

  return data as T
}

export async function getPosts(params: PostListParams = {}): Promise<PostListResponse> {
  const sp = new URLSearchParams()
  if (params.q && params.q.trim()) {
    sp.set('q', params.q.trim())
  }
  sp.set('page', String(params.page ?? 1))
  sp.set('size', String(params.size ?? 10))

  const data = await request<PostListResponse>(`/api/posts?${sp.toString()}`)
  return {
    posts: Array.isArray(data.posts) ? data.posts : [],
    total: typeof data.total === 'number' ? data.total : 0,
    page: typeof data.page === 'number' ? data.page : params.page ?? 1,
    size: typeof data.size === 'number' ? data.size : params.size ?? 10,
  }
}

export async function getPostById(
  id: number,
  options: { incrementView?: boolean } = {},
): Promise<PostDetail> {
  const query = options.incrementView === false ? '?view=0' : ''
  return request<PostDetail>(`/api/posts/${id}${query}`)
}

export async function createPost(payload: CreatePostRequest): Promise<CreatePostResponse> {
  return request<CreatePostResponse>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updatePost(
  id: number,
  payload: UpdatePostRequest,
  editToken: string,
): Promise<PostDetail> {
  return request<PostDetail>(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${editToken}`,
      'X-Owner-Token': editToken,
    },
    body: JSON.stringify(payload),
  })
}

export async function deletePost(id: number, editToken: string): Promise<void> {
  await request<void>(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${editToken}`,
      'X-Owner-Token': editToken,
    },
  })
}
