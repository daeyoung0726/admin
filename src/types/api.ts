export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type ApiErrorResponse = {
  code: string | number
  message: string
  errors?: Record<string, string>
}
