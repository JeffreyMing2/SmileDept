export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  nickname: string
  avatar: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
