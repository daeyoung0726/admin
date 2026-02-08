import type { PageInfo } from '@/types/roulette-history'

export type PointRecord = {
  id: number
  grantedPoint: number
  remainingPoint: number
  status: string
  expiresAt: string
  userId: number
  nickname?: string
  rouletteDate: string
  deletedAt: string | null
}

export type PointRecordPage = {
  content: PointRecord[]
  page: PageInfo
}
