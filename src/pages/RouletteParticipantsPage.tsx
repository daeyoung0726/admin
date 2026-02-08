import { useEffect, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getPointRecordsByRouletteDate, reclaimPoint } from '@/apis/points'
import type { PointRecordPage } from '@/types/points'

const DEFAULT_SIZE = 10

type RouletteParticipantsProps = {
  rouletteDate: string
  onBack: () => void
}

export default function RouletteParticipantsPage({ rouletteDate, onBack }: RouletteParticipantsProps) {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<PointRecordPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reclaimingId, setReclaimingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getPointRecordsByRouletteDate(rouletteDate, page, DEFAULT_SIZE)
        setData(result)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('참여자 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [rouletteDate, page])

  const refresh = async () => {
    const result = await getPointRecordsByRouletteDate(rouletteDate, page, DEFAULT_SIZE)
    setData(result)
  }

  const handleReclaim = async (pointId: number) => {
    const confirmed = window.confirm('해당 포인트를 회수하시겠습니까?')
    if (!confirmed) return
    try {
      setReclaimingId(pointId)
      await reclaimPoint(pointId)
      await refresh()
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('포인트 회수에 실패했습니다.')
    } finally {
      setReclaimingId(null)
    }
  }

  const items = data?.content ?? []
  const pageInfo = data?.page

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="absolute left-0 top-0 h-10 rounded-xl border-black/10 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← 뒤로가기
        </Button>
        
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">참여 사용자</h1>
          <p className="text-sm text-slate-500">{rouletteDate}</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            참여자 데이터를 불러오는 중입니다...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="space-y-3">
          {items.map((record) => (
            <div
              key={record.id}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">
                  {record.nickname ? `닉네임: ${record.nickname}` : `User #${record.userId}`}
                </span>
                <Button
                  className="h-9 bg-[#4C9AFF] px-4 text-xs font-semibold text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
                  onClick={() => handleReclaim(record.id)}
                  disabled={reclaimingId === record.id}
                >
                  {reclaimingId === record.id ? '회수 중...' : '포인트 회수'}
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <p className="text-[10px] text-slate-400">지급 포인트</p>
                  <p className="font-semibold text-slate-900">
                    {record.grantedPoint.toLocaleString('ko-KR')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">잔여 포인트</p>
                  <p className="font-semibold text-slate-900">
                    {record.remainingPoint.toLocaleString('ko-KR')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">만료일</p>
                  <p className="font-semibold text-slate-900">{record.expiresAt}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">포인트 상태</p>
                  <p className="font-semibold text-slate-900">
                    {record.status === 'AVAILABLE'
                      ? '사용 중'
                      : record.status === 'USED'
                        ? '소진'
                        : record.status === 'EXPIRED'
                          ? '만료됨'
                          : record.status === 'CANCELED'
                            ? '취소됨'
                            : record.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pageInfo && pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#F7FAFF] px-4 py-3 text-sm text-slate-600">
            <span>
              {pageInfo.number + 1} / {pageInfo.totalPages} 페이지
            </span>
            <div className="flex gap-2">
              <Button
                className="h-10 bg-[#4C9AFF] px-4 text-sm font-semibold text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
                disabled={pageInfo.number <= 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                이전
              </Button>
              <Button
                className="h-10 bg-[#4C9AFF] px-4 text-sm font-semibold text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
                disabled={pageInfo.number + 1 >= pageInfo.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}

        <Button
          className="h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]"
          onClick={onBack}
        >
          룰렛 목록으로 돌아가기
        </Button>
      </div>
    </CenteredCardLayout>
  )
}
