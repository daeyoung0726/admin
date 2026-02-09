import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import type { AdminSession } from '@/types/session'
import { getTodayRoulette } from '@/apis/roulette'
import { ApiError } from '@/apis/client'
import type { TodayRouletteRes } from '@/types/roulette'

type DashboardPageProps = {
  session: AdminSession
  onLogout: () => void
  onGoBudget: () => void
  onGoProducts: () => void
  onGoUsers: () => void
}

export default function DashboardPage({
  session,
  onLogout,
  onGoBudget,
  onGoProducts,
  onGoUsers,
}: DashboardPageProps) {
  const [today, setToday] = useState<TodayRouletteRes | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchToday = async () => {
      try {
        setLoading(true)
        const data = await getTodayRoulette()
        setToday(data)
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('대시보드 데이터를 불러오지 못했습니다.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchToday()
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)


  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs text-slate-400">
            Today · {today?.rouletteDate ?? 'loading'}
          </p>
          <h1 className="text-lg font-semibold text-slate-900">대시보드</h1>
          <p className="text-sm text-slate-500">{session.nickname}님, 오늘 현황입니다.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
            onClick={onGoBudget}
          >
            예산관리
          </Button>
          <Button
            className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
            onClick={onGoProducts}
          >
            상품관리
          </Button>
          <Button
            className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
            onClick={onGoUsers}
          >
            사용자관리
          </Button>
        </div>

        {loading && (
          <div className="rounded-lg border border-black/10 bg-sky-50 px-4 py-3 text-center text-sm text-slate-600">
            오늘 룰렛 데이터를 불러오는 중입니다...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="col-span-2 rounded-lg border border-black/10 bg-sky-50 px-3 py-3">
            <p className="text-xs text-slate-400">오늘 예산</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {today ? formatCurrency(today.totalBudget) : '-'}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-sky-50 px-3 py-3">
            <p className="text-xs text-slate-400">지급 포인트</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {today ? today.usedBudget.toLocaleString('ko-KR') : '-'}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-sky-50 px-3 py-3">
            <p className="text-xs text-slate-400">참여자 수</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {today ? today.participantCount.toLocaleString('ko-KR') : '-'}
            </p>
          </div>
        </div>

        <Button
          className="h-14 w-full bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>

    </CenteredCardLayout>
  )
}
