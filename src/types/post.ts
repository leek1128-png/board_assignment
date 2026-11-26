export interface PostSummary {
  id: number
  title: string
  author: string
  createdAt: string
  views: number
}

export interface PostDetail extends PostSummary {
  content: string
}

export interface PostListParams {
  q?: string
  page?: number
  size?: number
}

export interface PostListResponse {
  posts: PostSummary[]
  total: number
  page: number
  size: number
}

export interface CreatePostRequest {
  title: string
  content: string
}

export interface CreatePostResponse {
  post: PostDetail
  editToken: string
}

export interface UpdatePostRequest {
  title: string
  content: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
}
