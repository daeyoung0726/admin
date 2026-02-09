import { useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { createProduct } from '@/apis/products'

const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
const inputClass =
  'h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10'

type ProductCreateProps = {
  onBack: () => void
}

export default function ProductCreatePage({ onBack }: ProductCreateProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const priceValue = Number(price)
    const stockValue = Number(stockQuantity)

    if (!name.trim()) {
      setErrorMessage('상품명은 필수입니다.')
      return
    }
    if (!Number.isFinite(priceValue) || priceValue < 1) {
      setErrorMessage('가격은 1 이상이어야 합니다.')
      return
    }
    if (!Number.isFinite(stockValue) || stockValue < 1) {
      setErrorMessage('재고는 1 이상이어야 합니다.')
      return
    }

    try {
      setSaving(true)
      await createProduct({
        name: name.trim(),
        price: priceValue,
        stockQuantity: stockValue,
      })
      onBack()
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('상품 등록에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">상품 등록</h1>
          <p className="text-sm text-slate-500">새 상품 정보를 입력하세요.</p>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">상품명</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">가격</label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">재고</label>
            <input
              type="number"
              min={1}
              value={stockQuantity}
              onChange={(event) => setStockQuantity(event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              className="h-12 rounded-xl border border-black/10 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onBack}
            >
              목록으로
            </Button>
            <Button
              type="submit"
              className={`h-12 rounded-xl text-sm font-semibold shadow-sm ${primaryBtn}`}
              disabled={saving}
            >
              {saving ? '등록 중...' : '상품 등록'}
            </Button>
          </div>
        </form>
      </div>
    </CenteredCardLayout>
  )
}
