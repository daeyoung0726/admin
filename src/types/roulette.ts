export type TodayRouletteRes = {
  id: number
  rouletteDate: string
  totalBudget: number
  usedBudget: number
  participantCount: number
  deletedAt: string | null
}

export type UpdateTodayBudgetReq = {
  newTotalBudget: number
}
