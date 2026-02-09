import type { ApiResponse } from '@/types/api'
import type {
  CreateProductReq,
  ProductDetail,
  ProductPage,
  UpdateProductReq,
  UpdateStockReq,
} from '@/types/product'
import { apiFetch } from './client'

export async function getProducts(page = 0, size = 12): Promise<ProductPage> {
  const query = new URLSearchParams({ page: String(page), size: String(size) }).toString()
  const result = await apiFetch<ApiResponse<ProductPage>>(`/api/v1/admin/products?${query}`)
  return result.data
}

export async function createProduct(payload: CreateProductReq): Promise<void> {
  await apiFetch<ApiResponse<null>>('/api/v1/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getProductById(productId: number): Promise<ProductDetail> {
  const result = await apiFetch<ApiResponse<ProductDetail>>(`/api/v1/admin/products/${productId}`)
  return result.data
}

export async function updateProductInfo(
  productId: number,
  payload: UpdateProductReq,
): Promise<void> {
  await apiFetch<ApiResponse<null>>(`/api/v1/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function updateProductStock(
  productId: number,
  payload: UpdateStockReq,
): Promise<void> {
  await apiFetch<ApiResponse<null>>(`/api/v1/admin/products/${productId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteProduct(productId: number): Promise<void> {
  await apiFetch<ApiResponse<null>>(`/api/v1/admin/products/${productId}`, {
    method: 'DELETE',
  })
}
