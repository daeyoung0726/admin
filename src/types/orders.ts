import type { PageInfo } from '@/types/roulette-history'

export type OrderItem = {
  id: number
  quantity: number
  productPrice: number
  productName: string
  status: string
  userId: number
  productId: number
  createdAt: string
  nickname?: string
}

export type OrderPage = {
  content: OrderItem[]
  page: PageInfo
}

export type OrderDetail = {
  id: number
  quantity: number
  productPrice: number
  productName: string
  status: string
  userId: number
  productId: number
  createdAt?: string | null
  nickname?: string | null
}
