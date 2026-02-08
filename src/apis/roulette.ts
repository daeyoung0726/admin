import type { ApiResponse } from '@/types/api'
import type { TodayRouletteRes, UpdateTodayBudgetReq } from '@/types/roulette'
import { apiFetch } from './client'

export async function getTodayRoulette(): Promise<TodayRouletteRes> {
  const result = await apiFetch<ApiResponse<TodayRouletteRes>>('/api/v1/admin/roulettes/today')
  return result.data
}

export async function updateTodayBudget(payload: UpdateTodayBudgetReq): Promise<void> {
  await apiFetch<ApiResponse<null>>('/api/v1/admin/roulettes/today/budget', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
