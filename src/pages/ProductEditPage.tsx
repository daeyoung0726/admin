import { useEffect, useState } from 'react'
import CenteredCardLayout from '@/components/CenteredCardLayout'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/apis/client'
import { getProductById, updateProductInfo } from '@/apis/products'

const primaryBtn = 'bg-[#4C9AFF] text-white hover:bg-[#3A8BFF] active:bg-[#2A7EFF]'
const inputClass =
  'h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10'

type ProductEditProps = {
  productId: number
  onBack: () => void
}

export default function ProductEditPage({ productId, onBack }: ProductEditProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const product = await getProductById(productId)
        setName(product.name)
        setPrice(String(product.price))
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
    const priceValue = Number(price)
    if (!name.trim()) {
      setErrorMessage('상품명은 필수입니다.')
      return
    }
    if (!Number.isFinite(priceValue) || priceValue < 1) {
      setErrorMessage('가격은 1 이상이어야 합니다.')
      return
    }
    try {
      setSaving(true)
      setErrorMessage(null)
      await updateProductInfo(productId, { name: name.trim(), price: priceValue })
      onBack()
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message)
      else if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('상품 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900">상품 수정</h1>
          <p className="text-sm text-slate-500">이름과 가격을 수정합니다.</p>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">상품명</label>
            <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
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
