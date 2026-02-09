import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'

type BudgetPageProps = {
  onBack: () => void
  onGoEdit: () => void
  onGoHistory: () => void
}

export default function BudgetPage({ onBack, onGoEdit, onGoHistory }: BudgetPageProps) {
  const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="relative space-y-8">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="absolute left-0 top-0 h-10 rounded-xl border-black/10 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← 뒤로가기
        </Button>

        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">예산 관리</h1>
          <p className="text-sm text-slate-500">예산 수정과 룰렛 관리를 선택하세요.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
            onClick={onGoEdit}
          >
            예산 수정
          </Button>
          <Button
            type="button"
            className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
            onClick={onGoHistory}
          >
            룰렛 관리
          </Button>
        </div>

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
