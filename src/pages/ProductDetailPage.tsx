import { useEffect, useMemo, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { deleteProduct, getProductById } from '@/apis/products'
import type { ProductDetail } from '@/types/product'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

type ProductDetailProps = {
  productId: number
  onBack: () => void
  onEdit: () => void
  onStock: () => void
  onDeleted: () => void
  onOrders: () => void
}

export default function ProductDetailPage({
  productId,
  onBack,
  onEdit,
  onStock,
  onDeleted,
  onOrders,
}: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getProductById(productId)
        setProduct(result)
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message)
        else if (error instanceof Error) setErrorMessage(error.message)
        else setErrorMessage('상품 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId])

  const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
  const card =
    'rounded-3xl border border-black/10 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]'
  const statBox = 'rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4'

  const createdAtText = useMemo(() => {
    if (!product?.createdAt) return '-'
    const date = new Date(product.createdAt)
    if (Number.isNaN(date.getTime())) return product.createdAt
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }, [product?.createdAt])

  const handleDelete = async () => {
    const confirmed = window.confirm('해당 상품을 삭제하시겠습니까?')
    if (!confirmed) return
    try {
      setErrorMessage(null)
      await deleteProduct(productId)
      onDeleted()
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('상품 삭제에 실패했습니다.')
    }
  }

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-10">
        {/* ✅ 헤더: 제목(중앙) + 우측 "주문 내역 보기" */}
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            {/* 중앙 정렬 유지용 좌측 스페이서 */}
            <div className="w-[160px]" />

            <div className="space-y-3 text-center">
              <h1 className="text-xl font-semibold text-slate-900">상품 상세</h1>
              <p className="text-sm text-slate-500">상품 정보를 확인합니다.</p>
            </div>

            {/* 우측 버튼 */}
            <div className="w-[160px] flex justify-end">
              <Button
                type="button"
                className={`h-12 rounded-2xl px-6 text-sm font-semibold shadow-sm ${primaryBtn}`}
                onClick={onOrders}
                disabled={loading || !product}
              >
                주문 내역 보기
              </Button>
            </div>
          </div>
        </div>

        {/* 로딩/에러 */}
        {loading && (
          <div className="rounded-3xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            상품 정보를 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* 본문 */}
        {product && (
          <div className={`${card} p-7`}>
            {/* 상단 요약 */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-slate-600">
                <span className="text-slate-400">ID</span>
                <span className="font-semibold text-slate-900">#{product.id}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-slate-400">상품명</p>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {product.name}
                </p>
              </div>

              <div className="w-full sm:w-auto sm:min-w-[260px]">
                <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                    가격
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* 디바이더 */}
            <div className="my-7 h-px w-full bg-black/5" />

            {/* 상세 정보 그리드 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className={statBox}>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                  재고
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {product.stockQuantity.toLocaleString('ko-KR')}
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

        {/* 하단 버튼 */}
        <div className="space-y-6 pt-2">
          {/* ✅ (수정/재고/삭제) 한 줄 */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              onClick={onEdit}
            >
              수정하기
            </Button>

            <Button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              onClick={onStock}
            >
              재고 수정하기
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="h-12 rounded-2xl text-sm font-semibold !text-white"
              style={{ color: '#fff' }}
              onClick={handleDelete}
            >
              삭제하기
            </Button>
          </div>

          {/* ✅ 한 칸 더 띄움 */}
          <div className="pt-2">
            <Button
              type="button"
              className={`h-14 w-full rounded-2xl text-[16px] font-semibold shadow-sm ${primaryBtn}`}
              onClick={onBack}
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </CenteredCardLayout>
  )
}
