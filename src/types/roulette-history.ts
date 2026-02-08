export type Pageable = {
  page?: number
  size?: number
  sort?: string[]
}

export type PageInfo = {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export type RouletteHistoryItem = {
  id: number
  rouletteDate: string
  totalBudget: number
  usedBudget: number
  participantCount: number
  deletedAt: string | null
}

export type RouletteHistoryPage = {
  content: RouletteHistoryItem[]
  page: PageInfo
}
