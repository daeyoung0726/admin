import { useEffect, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getProductById, updateProductStock } from '@/apis/products'

const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
const inputClass =
  'h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10'

type ProductStockProps = {
  productId: number
  onBack: () => void
}

export default function ProductStockPage({ productId, onBack }: ProductStockProps) {
  const [currentStock, setCurrentStock] = useState<number | null>(null)
  const [delta, setDelta] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const product = await getProductById(productId)
        setCurrentStock(product.stockQuantity)
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const deltaValue = Number(delta)
    if (!Number.isFinite(deltaValue) || deltaValue === 0) {
      setErrorMessage('재고 증감 값은 0이 될 수 없습니다.')
      return
    }
    try {
      setSaving(true)
      setErrorMessage(null)
      await updateProductStock(productId, { increaseStock: deltaValue })
      onBack()
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('재고 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">재고 수정</h1>
          <p className="text-sm text-slate-500">재고를 증감 형태로 입력하세요.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-black/10 bg-[#F7FAFF] px-6 py-5 text-center text-sm text-slate-600">
            상품 정보를 불러오는 중입니다...
          </div>
        )}
        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm text-slate-700">
            현재 재고: <span className="font-semibold text-slate-900">{currentStock ?? '-'}</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">증감 수량</label>
            <input
              type="number"
              value={delta}
              onChange={(event) => setDelta(event.target.value)}
              className={inputClass}
              placeholder="예: 10 또는 -3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              className="h-12 rounded-xl border border-black/10 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onBack}
            >
              돌아가기
            </Button>
            <Button
              type="submit"
              className={`h-12 rounded-xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              disabled={saving}
            >
              {saving ? '저장 중...' : '수정 완료'}
            </Button>
          </div>
        </form>
      </div>
    </CenteredCardLayout>
  )
}
