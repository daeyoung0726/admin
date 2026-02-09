import type { PageInfo } from '@/types/roulette-history'

export type UserItem = {
  id: number
  nickname: string
}

export type UserPage = {
  content: UserItem[]
  page: PageInfo
}
