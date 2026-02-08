import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getRouletteHistory } from '@/apis/roulette'
import type { RouletteHistoryItem, RouletteHistoryPage } from '@/types/roulette-history'

const DEFAULT_SIZE = 12
const COLS = 3
const ROWS = 4
const MAX_PAGE_BUTTONS = 5

type RouletteHistoryProps = {
  onBack: () => void
}

export default function RouletteHistoryPage({ onBack }: RouletteHistoryProps) {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<RouletteHistoryPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getRouletteHistory(page, DEFAULT_SIZE)
        setData(result)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('룰렛 이력을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])

  const items = data?.content ?? []
  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 0
  const currentPage = pageInfo?.number ?? page // 0-based

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

  const gridItems = useMemo(() => {
    const need = COLS * ROWS
    const padded: Array<RouletteHistoryItem | null> = items.slice(0, need)
    while (padded.length < need) padded.push(null)
    return padded
  }, [items])

  const pageNumbers = useMemo(() => {
    if (!pageInfo || totalPages <= 0) return []
    const half = Math.floor(MAX_PAGE_BUTTONS / 2)
    let start = Math.max(0, currentPage - half)
    let end = Math.min(totalPages - 1, start + (MAX_PAGE_BUTTONS - 1))
    start = Math.max(0, end - (MAX_PAGE_BUTTONS - 1))
    const arr: number[] = []
    for (let i = start; i <= end; i += 1) arr.push(i)
    return arr
  }, [pageInfo, totalPages, currentPage])

  const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
  const outlineBtn = 'border border-black/10 bg-white text-slate-700 hover:bg-slate-50'

  const card =
    'rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
  const statBox =
    'rounded-xl border border-black/10 bg-[#F7FAFF] px-4 py-3.5'

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-10">
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
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold text-slate-900">역대 룰렛</h1>
          <p className="text-sm text-slate-500">전체 룰렛 내역을 확인합니다.</p>
        </div>

        {/* 로딩/에러 */}
        {loading && (
          <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            룰렛 데이터를 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* 카드 간격/칸 간격 늘림 */}
        <div className="grid grid-cols-3 gap-x-5 gap-y-5">
          {gridItems.map((item, idx) => {
            if (!item) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-[200px] rounded-2xl border border-transparent"
                />
              )
            }

            return (
              <div key={item.id} className={`${card} p-6`}>
                {/* 상단 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-slate-400">{item.rouletteDate}</p>
                  </div>

                  {item.deletedAt ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
                      삭제됨
                    </span>
                  ) : null}
                </div>

                {/*  섹션 간 세로 간격 증가 */}
                <div className="mt-6 space-y-5">
                  {/* 총 예산 */}
                  <div className={`${statBox}`}>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                      총 예산
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatCurrency(item.totalBudget)}
                    </p>
                  </div>

                  {/*  하단 2칸: gap 증가 */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className={`${statBox}`}>
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                        사용 예산
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatCurrency(item.usedBudget)}
                      </p>
                    </div>

                    <div className={`${statBox}`}>
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                        참여자 수
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {item.participantCount.toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 페이지네이션 */}
        {pageInfo && totalPages > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-600">
              {currentPage + 1} / {totalPages} 페이지
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                className={`h-10 rounded-xl px-4 text-sm font-semibold shadow-sm ${outlineBtn}`}
                disabled={currentPage <= 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                이전
              </Button>

              {pageNumbers.length > 0 && pageNumbers[0] > 0 && (
                <>
                  <Button
                    type="button"
                    className={`h-10 w-10 rounded-xl px-0 text-sm font-semibold shadow-sm ${outlineBtn}`}
                    onClick={() => setPage(0)}
                  >
                    1
                  </Button>
                  <span className="px-1 text-slate-400">…</span>
                </>
              )}

              {pageNumbers.map((p) => {
                const active = p === currentPage
                return (
                  <Button
                    key={p}
                    type="button"
                    className={`h-10 w-10 rounded-xl px-0 text-sm font-semibold shadow-sm ${
                      active ? primaryBtn : outlineBtn
                    }`}
                    onClick={() => setPage(p)}
                    disabled={active}
                  >
                    {p + 1}
                  </Button>
                )
              })}

              {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <>
                  <span className="px-1 text-slate-400">…</span>
                  <Button
                    type="button"
                    className={`h-10 w-10 rounded-xl px-0 text-sm font-semibold shadow-sm ${outlineBtn}`}
                    onClick={() => setPage(totalPages - 1)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                type="button"
                className={`h-10 rounded-xl px-4 text-sm font-semibold shadow-sm ${outlineBtn}`}
                disabled={currentPage + 1 >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}

        <Button
          type="button"
          className={`h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm ${primaryBtn}`}
          onClick={onBack}
        >
          대시보드로 돌아가기
        </Button>
      </div>
    </CenteredCardLayout>
  )
}