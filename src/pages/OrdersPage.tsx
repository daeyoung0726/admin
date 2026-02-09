import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getOrdersByProductId } from '@/apis/orders'
import type { OrderItem, OrderPage } from '@/types/orders'

const DEFAULT_SIZE = 12
const COLS = 3
const ROWS = 4
const MAX_PAGE_BUTTONS = 5

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

const formatOrderStatus = (status: string) => {
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

type OrdersPageProps = {
  productId: number
  onBack: () => void
  onSelectOrder: (orderId: number) => void
}

export default function OrdersPage({ productId, onBack, onSelectOrder }: OrdersPageProps) {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<OrderPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getOrdersByProductId(productId, page, DEFAULT_SIZE)
        setData(result)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('주문 내역을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId, page])

  const items = data?.content ?? []
  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 0
  const currentPage = pageInfo?.number ?? page // 0-based

  const gridItems = useMemo(() => {
    const need = COLS * ROWS
    const padded: Array<OrderItem | null> = items.slice(0, need)
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
  const statBox = 'rounded-xl border border-black/10 bg-[#F7FAFF] px-4 py-3.5'

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="absolute left-0 top-0 h-10 rounded-xl border-black/10 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        ← 뒤로가기
      </Button>
      
      <div className="space-y-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <div />
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-semibold text-slate-900">상품 주문 내역</h1>
            <p className="text-sm text-slate-500">상품 주문 기록을 확인합니다.</p>
          </div>
          <div />
        </div>

        {loading && (
          <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            주문 내역을 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-x-5 gap-y-5">
          {!loading && !errorMessage && items.length === 0 && (
            <div className="col-span-3 rounded-2xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
              주문이 없습니다.
            </div>
          )}

          {gridItems.map((order, idx) => {
            if (!order) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-[200px] rounded-2xl border border-transparent"
                />
              )
            }
            return (
              <button
                key={order.id}
                type="button"
                className={`${card} w-full p-6 text-left transition-transform hover:-translate-y-0.5`}
                onClick={() => onSelectOrder(order.id)}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">주문 #{order.id}</span>
                  <span className="text-xs text-slate-500">{formatDateTime(order.createdAt)}</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5 text-xs text-slate-600">
                  <div className={statBox}>
                    <p className="text-[10px] text-slate-400">주문자</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {order.nickname ? `닉네임: ${order.nickname}` : `User #${order.userId}`}
                    </p>
                  </div>
                  <div className={statBox}>
                    <p className="text-[10px] text-slate-400">상태</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {formatOrderStatus(order.status)}
                    </p>
                  </div>
                  <div className={statBox}>
                    <p className="text-[10px] text-slate-400">수량</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {order.quantity.toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className={statBox}>
                    <p className="text-[10px] text-slate-400">가격</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {formatCurrency(order.productPrice)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* 숫자 페이지네이션 */}
        {pageInfo && totalPages > 1 && (
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
          상품 상세로 돌아가기
        </Button>
      </div>
    </CenteredCardLayout>
  )
}
