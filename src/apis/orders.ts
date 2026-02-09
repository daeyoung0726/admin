import type { ApiResponse } from '@/types/api'
import type { OrderDetail, OrderPage } from '@/types/orders'
import { apiFetch } from './client'

export async function getOrdersByProductId(
  productId: number,
  page = 0,
  size = 10,
): Promise<OrderPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<OrderPage>>(
    `/api/v1/admin/products/${productId}/orders?${query}`,
  )
  return result.data
}

export async function getOrdersByUserId(
  userId: number,
  page = 0,
  size = 10,
): Promise<OrderPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<OrderPage>>(
    `/api/v1/admin/users/${userId}/orders?${query}`,
  )
  return result.data
}

export async function getOrderById(orderId: number): Promise<OrderDetail> {
  const result = await apiFetch<ApiResponse<OrderDetail>>(`/api/v1/admin/orders/${orderId}`)
  return result.data
}

export async function cancelOrder(orderId: number): Promise<void> {
  await apiFetch<ApiResponse<null>>(`/api/v1/admin/orders/${orderId}/cancel`, {
    method: 'PATCH',
  })
}
