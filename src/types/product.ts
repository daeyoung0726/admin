import type { PageInfo } from '@/types/roulette-history'

export type ProductItem = {
  id: number
  name: string
  stockQuantity: number
  price: number
}

export type ProductPage = {
  content: ProductItem[]
  page: PageInfo
}

export type CreateProductReq = {
  name: string
  price: number
  stockQuantity: number
}

export type ProductDetail = {
  id: number
  name: string
  stockQuantity: number
  price: number
  createdAt: string
}

export type UpdateProductReq = {
  name: string
  price: number
}

export type UpdateStockReq = {
  increaseStock: number
}
