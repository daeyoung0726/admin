import type { ApiResponse } from '@/types/api'
import type { UserDetail } from '@/types/user-detail'
import { apiFetch } from './client'

export async function getUserById(userId: number): Promise<UserDetail> {
  const result = await apiFetch<ApiResponse<UserDetail>>(`/api/v1/admin/users/${userId}`)
  return result.data
}
