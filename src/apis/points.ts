import type { ApiResponse } from '@/types/api'
import type { PointRecordPage } from '@/types/points'
import { apiFetch } from './client'

export async function getPointRecordsByRouletteDate(
  rouletteDate: string,
  page = 0,
  size = 10,
): Promise<PointRecordPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<PointRecordPage>>(
    `/api/v1/admin/points/roulettes/${rouletteDate}?${query}`,
  )
  return result.data
}

export async function getPointRecordsByUserId(
  userId: number,
  page = 0,
  size = 10,
): Promise<PointRecordPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<PointRecordPage>>(
    `/api/v1/admin/points/users/${userId}?${query}`,
  )
  return result.data
}

export async function reclaimPoint(pointId: number): Promise<void> {
  await apiFetch<ApiResponse<null>>(`/api/v1/admin/points/${pointId}/reclaim`, {
    method: 'PATCH',
  })
}
