import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError, apiFetch } from '@/apis/client'
import { cancelOrder } from '@/apis/orders'
import type { ApiResponse } from '@/types/api'
import type { OrderDetail } from '@/types/orders'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

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

type OrderDetailProps = {
  orderId: number
  onBack: () => void
}

function statusText(status: string) {
  switch (status) {
    case 'USER_CANCELLED':
      return '사용자 주문 취소'
    case 'ADMIN_CANCELLED':
      return '관리자 주문 취소'
    case 'COMPLETED':
      return '주문 완료'
    default:
      return status
  }
}

export default function OrderDetailPage({ orderId, onBack }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await apiFetch<ApiResponse<OrderDetail>>(`/api/v1/admin/orders/${orderId}`)
        setOrder(result.data)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('주문 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [orderId])

  const handleCancel = async () => {
    const confirmed = window.confirm('이 주문을 취소하시겠습니까?')
    if (!confirmed) return
    try {
      setCanceling(true)
      await cancelOrder(orderId)
      const result = await apiFetch<ApiResponse<OrderDetail>>(`/api/v1/admin/orders/${orderId}`)
      setOrder(result.data)
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('주문 취소에 실패했습니다.')
    } finally {
      setCanceling(false)
    }
  }

  const createdAtText = useMemo(() => {
    if (!order?.createdAt) return '-'
    return formatDateTime(order.createdAt)
  }, [order?.createdAt])

  const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
  const card =
    'rounded-3xl border border-black/10 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]'
  const statBox = 'rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4'

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-10">
        {/* 헤더 */}
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold text-slate-900">주문 상세</h1>
          <p className="text-sm text-slate-500">주문 정보를 확인합니다.</p>
        </div>

        {/* 로딩/에러 */}
        {loading && (
          <div className="rounded-3xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            주문 정보를 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* 본문 */}
        {order && (
          <div className={`${card} p-7`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-slate-600">
                <span className="text-slate-400">주문 ID</span>
                <span className="font-semibold text-slate-900">#{order.id}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-slate-400">상품명</p>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {order.productName}
                </p>
              </div>

              <div className="w-full sm:w-auto sm:min-w-[260px]">
                <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                    결제 금액
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatCurrency(order.productPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  주문 상태
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {statusText(order.status)}
                  </span>

                  
                </div>
              </div>
            </div>

            <div className="my-7 h-px w-full bg-black/5" />

            {/* 상세 정보 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">수량</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {order.quantity.toLocaleString('ko-KR')}
                </p>
              </div>

              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  주문 생성일
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">{createdAtText}</p>
              </div>

              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  주문자
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {order.nickname ? `닉네임: ${order.nickname}` : `User #${order.userId}`}
                </p>
              </div>

              
            </div>
          </div>
        )}

        <div className="grid gap-3">
          <Button
            type="button"
            variant="destructive"
            className="h-12 w-full rounded-2xl text-sm font-semibold !text-white"
            style={{ color: '#fff' }}
            onClick={handleCancel}
            disabled={canceling}
          >
            {canceling ? '취소 중...' : '주문 취소'}
          </Button>
          <Button
            type="button"
            className={`h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm ${primaryBtn}`}
            onClick={onBack}
          >
            주문 내역으로 돌아가기
          </Button>
        </div>
      </div>
    </CenteredCardLayout>
  )
}
