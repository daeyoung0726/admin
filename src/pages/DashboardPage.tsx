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
}

export default function DashboardPage({ session, onLogout }: DashboardPageProps) {
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
          <Button className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]">
            예산관리
          </Button>
          <Button className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]">
            상품관리
          </Button>
          <Button className="h-14 bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]">
            주문내역
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
          {[
            {
              label: '오늘 예산',
              value: today ? formatCurrency(today.totalBudget) : '-',
              editable: true,
            },
            {
              label: '참여자 수',
              value: today ? today.participantCount.toLocaleString('ko-KR') : '-',
            },
            {
              label: '지급 포인트',
              value: today ? today.usedBudget.toLocaleString('ko-KR') : '-',
            },
            {
              label: '사용 예산',
              value: today ? formatCurrency(today.usedBudget) : '-',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-black/10 bg-sky-50 px-3 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{stat.value}</p>
                </div>
                {stat.editable ? null : null}
              </div>
            </div>
          ))}
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
