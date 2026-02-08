import type { ApiErrorResponse } from '@/types/api'

export class ApiError extends Error {
  status: number
  code?: string | number
  errors?: Record<string, string>

  constructor(status: number, message: string, code?: string | number, errors?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not set')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  const text = await response.text()
  const data = text ? (JSON.parse(text) as ApiErrorResponse | T) : null

  if (!response.ok) {
    const errorPayload = data as ApiErrorResponse | null
    throw new ApiError(
      response.status,
      errorPayload?.message ?? response.statusText,
      errorPayload?.code,
      errorPayload?.errors,
    )
  }

  return data as T
}
