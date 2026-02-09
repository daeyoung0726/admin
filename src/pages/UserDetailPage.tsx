import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getUserById } from '@/apis/user-detail'
import type { UserDetail } from '@/types/user-detail'

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

type UserDetailProps = {
  userId: number
  onBack: () => void
  onOrders: () => void
  onPoints: () => void
}

export default function UserDetailPage({ userId, onBack, onOrders, onPoints }: UserDetailProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getUserById(userId)
        setUser(result)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('사용자 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
  const card =
    'rounded-3xl border border-black/10 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]'
  const statBox = 'rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4'

  const createdAtText = useMemo(() => {
    if (!user?.createdAt) return '-'
    return formatDateTime(user.createdAt)
  }, [user?.createdAt])

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold text-slate-900">사용자 상세</h1>
          <p className="text-sm text-slate-500">사용자 정보를 확인합니다.</p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            사용자 정보를 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {user && (
          <div className={`${card} p-7`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-slate-600">
                <span className="text-slate-400">ID</span>
                <span className="font-semibold text-slate-900">#{user.id}</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-400">닉네임</p>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {user.nickname}
                </p>
              </div>

              <div className="w-full sm:w-auto sm:min-w-[240px]">
                <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                    권한
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="my-7 h-px w-full bg-black/5" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  포인트 부채
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {user.pointDebt.toLocaleString('ko-KR')}
                </p>
              </div>
              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  생성일
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">{createdAtText}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              onClick={onOrders}
            >
              주문 내역 보기
            </Button>
            <Button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              onClick={onPoints}
            >
              획득 포인트 보기
            </Button>
          </div>

          <Button
            type="button"
            className={`h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm ${primaryBtn}`}
            onClick={onBack}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </CenteredCardLayout>
  )
}
