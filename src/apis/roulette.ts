import type { ApiResponse } from '@/types/api'
import type {
  FutureBudgetItem,
  TodayRouletteRes,
  UpdateFutureBudgetReq,
  UpdateTodayBudgetReq,
} from '@/types/roulette'
import { apiFetch } from './client'
import type { RouletteHistoryPage } from '@/types/roulette-history'

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

export async function getFutureBudgetSettings(): Promise<FutureBudgetItem[]> {
  const result = await apiFetch<ApiResponse<FutureBudgetItem[]>>(
    '/api/v1/admin/roulettes/future/budget',
  )
  return result.data
}

export async function updateFutureBudget(payload: UpdateFutureBudgetReq): Promise<void> {
  await apiFetch<ApiResponse<null>>('/api/v1/admin/roulettes/future/budget', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function getRouletteHistory(page = 0, size = 12): Promise<RouletteHistoryPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<RouletteHistoryPage>>(`/api/v1/admin/roulettes?${query}`)
  return result.data
}
