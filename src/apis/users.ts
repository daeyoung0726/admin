import type { ApiResponse } from '@/types/api'
import type { UserPage } from '@/types/users'
import { apiFetch } from './client'

export async function getUsers(page = 0, size = 12): Promise<UserPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<UserPage>>(`/api/v1/admin/users?${query}`)
  return result.data
}
