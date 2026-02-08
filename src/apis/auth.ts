import type { ApiResponse } from '@/types/api'
import type { AdminSignInReq, AdminSignInRes } from '@/types/auth'
import { apiFetch } from './client'

export async function signInAdmin(payload: AdminSignInReq): Promise<AdminSignInRes> {
  const result = await apiFetch<ApiResponse<AdminSignInRes>>('/api/v1/admin/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return result.data
}
