import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import {
  getFutureBudgetSettings,
  getTodayRoulette,
  updateFutureBudget,
  updateTodayBudget,
} from '@/apis/roulette'
import type { FutureBudgetItem, TodayRouletteRes } from '@/types/roulette'

const DEFAULT_BUDGET = 100_000
const MAX_DAYS = 7

type BudgetRow = {
  date: string
  totalBudget: number
}

type BudgetPageProps = {
  onBack: () => void
}

export default function BudgetPage({ onBack }: BudgetPageProps) {
  const [today, setToday] = useState<TodayRouletteRes | null>(null)
  const [futureItems, setFutureItems] = useState<FutureBudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [todayBudgetInput, setTodayBudgetInput] = useState('')
  const [updatingToday, setUpdatingToday] = useState(false)
  const [savingDates, setSavingDates] = useState<Record<string, boolean>>({})
  const [futureInputs, setFutureInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [todayData, futureData] = await Promise.all([
          getTodayRoulette(),
          getFutureBudgetSettings(),
        ])
        setToday(todayData)
        setFutureItems(futureData)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('예산 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

  const futureMap = useMemo(() => {
    return futureItems.reduce<Record<string, FutureBudgetItem>>((acc, item) => {
      acc[item.settingDate] = item
      return acc
    }, {})
  }, [futureItems])

  const toLocalDateKey = (value: Date) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const futureRows = useMemo<BudgetRow[]>(() => {
    const rows: BudgetRow[] = []
    const baseDate = today?.rouletteDate
      ? new Date(`${today.rouletteDate}T00:00:00`)
      : new Date()
    for (let offset = 1; offset <= MAX_DAYS; offset += 1) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + offset)
      const dateKey = toLocalDateKey(date)
      rows.push({
        date: dateKey,
        totalBudget: futureMap[dateKey]?.totalBudget ?? DEFAULT_BUDGET,
      })
    }
    return rows
  }, [futureMap, today?.rouletteDate])

  useEffect(() => {
    const nextInputs = futureRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.date] = String(row.totalBudget)
      return acc
    }, {})
    setFutureInputs(nextInputs)
  }, [futureRows])

  const handleUpdateToday = async () => {
    const value = Number(todayBudgetInput)
    if (!Number.isFinite(value) || value < 1) {
      setErrorMessage('오늘 예산은 1 이상이어야 합니다.')
      return
    }
    try {
      setUpdatingToday(true)
      setErrorMessage(null)
      await updateTodayBudget({ newTotalBudget: value })
      const refreshed = await getTodayRoulette()
      setToday(refreshed)
      setTodayBudgetInput('')
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('금일 예산 수정에 실패했습니다.')
    } finally {
      setUpdatingToday(false)
    }
  }

  const handleUpdateFuture = async (row: BudgetRow) => {
    const raw = futureInputs[row.date]
    const value = Number(raw)
    if (!Number.isFinite(value) || value < 1) {
      setErrorMessage('예산은 1 이상이어야 합니다.')
      return
    }
    try {
      setSavingDates((prev) => ({ ...prev, [row.date]: true }))
      setErrorMessage(null)
      await updateFutureBudget({ targetDate: row.date, newTotalBudget: value })
      const refreshed = await getFutureBudgetSettings()
      setFutureItems(refreshed)
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('이후 예산 수정에 실패했습니다.')
    } finally {
      setSavingDates((prev) => ({ ...prev, [row.date]: false }))
    }
  }

  const primaryBtn =
    'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
  const softCard =
    'rounded-2xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
  const softRow =
    'rounded-2xl border border-black/10 bg-[#F7FAFF] shadow-[0_4px_14px_rgba(15,23,42,0.05)]'

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="relative space-y-8">
        {/* 좌측 상단 뒤로가기 */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="absolute left-0 top-0 h-10 rounded-xl border-black/10 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← 뒤로가기
        </Button>

        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">예산 설정</h1>
          <p className="text-sm text-slate-500">
            {today?.rouletteDate ?? ''} 기준 예산을 관리합니다.
          </p>
        </div>

        {/* 로딩/에러 */}
        {loading && (
          <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4 text-center text-sm text-slate-600">
            예산 데이터를 불러오는 중입니다...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* 금일 예산 카드 */}
        <section className={`${softCard} px-6 py-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">금일 예산</p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">
                {today ? formatCurrency(today.totalBudget) : '-'}
              </p>
              <p className="text-xs text-slate-400">오늘 예산을 즉시 변경합니다.</p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[360px]">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={todayBudgetInput}
                  onChange={(event) => setTodayBudgetInput(event.target.value)}
                  placeholder="예: 100000"
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <Button
                  className={`h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold shadow-sm ${primaryBtn}`}
                  onClick={handleUpdateToday}
                  disabled={updatingToday}
                  type="button"
                >
                  {updatingToday ? '저장 중...' : '설정'}
                </Button>
              </div>
              <p className="text-[12px] text-slate-400">금일 예산은 증가만 가능합니다.</p>
            </div>
          </div>
        </section>

        {/* 이후 예산 */}
        <section className="space-y-3">
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">오늘 이후 예산</p>
            <p className="text-xs text-slate-400">최대 7일 이후까지만 설정 가능합니다.</p>
          </div>

          <div className="space-y-3">
            {futureRows.map((row) => {
              const saving = !!savingDates[row.date]
              return (
                <div key={row.date} className={`${softRow} px-5 py-5`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">{row.date}</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatCurrency(row.totalBudget)}
                      </p>
                      <p className="text-xs text-slate-400">해당 날짜의 총 예산을 변경합니다.</p>
                    </div>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                      <input
                        type="number"
                        min={1}
                        value={futureInputs[row.date] ?? ''}
                        onChange={(event) =>
                          setFutureInputs((prev) => ({
                            ...prev,
                            [row.date]: event.target.value,
                          }))
                        }
                        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 sm:w-[180px]"
                      />
                      <Button
                        className={`h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold shadow-sm ${primaryBtn}`}
                        onClick={() => handleUpdateFuture(row)}
                        disabled={saving}
                        type="button"
                      >
                        {saving ? '저장 중...' : '저장'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 하단 버튼 (원하면 유지, 아니면 삭제 가능) */}
        <div className="pt-1">
          <Button
            className={`h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm ${primaryBtn}`}
            onClick={onBack}
            type="button"
          >
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    </CenteredCardLayout>
  )
}