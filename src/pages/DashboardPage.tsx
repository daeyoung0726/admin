import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import type { AdminSession } from '@/types/session'

type DashboardPageProps = {
  session: AdminSession
  onLogout: () => void
}

export default function DashboardPage({ session, onLogout }: DashboardPageProps) {
  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-xs text-slate-400">Today · 2026-02-08</p>
          <h1 className="text-lg font-semibold text-slate-900">대시보드</h1>
          <p className="text-sm text-slate-500">{session.nickname}님, 오늘 현황입니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: '오늘 예산', value: '₩100,000' },
            { label: '참여자 수', value: '1' },
            { label: '지급 포인트', value: '775' },
            { label: '사용 예산', value: '₩775' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
          <span className="text-slate-500">상태</span>
          <Badge className="bg-[#1F5BFF]/10 text-[#1F5BFF]">운영중</Badge>
        </div>

        <Button
          variant="outline"
          className="h-11 w-full border-slate-200 text-slate-600"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>
    </CenteredCardLayout>
  )
}
