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

export type FutureBudgetItem = {
  id: number
  settingDate: string
  totalBudget: number
  createdAt: string
  modifiedAt: string
}

export type UpdateFutureBudgetReq = {
  targetDate: string
  newTotalBudget: number
}
