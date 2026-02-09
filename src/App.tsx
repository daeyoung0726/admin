import { useEffect, useState } from 'react'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import BudgetPage from '@/pages/BudgetPage'
import RouletteHistoryPage from '@/pages/RouletteHistoryPage'
import RouletteParticipantsPage from '@/pages/RouletteParticipantsPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductCreatePage from '@/pages/ProductCreatePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductEditPage from '@/pages/ProductEditPage'
import ProductStockPage from '@/pages/ProductStockPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import type { AdminSession } from '@/types/session'

function App() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [route, setRoute] = useState<
    | 'dashboard'
    | 'budget'
    | 'history'
    | 'participants'
    | 'products'
    | 'product-create'
    | 'product-detail'
    | 'product-edit'
    | 'product-stock'
    | 'product-orders'
    | 'order-detail'
  >(
    'dashboard',
  )
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [selectedRouletteDate, setSelectedRouletteDate] = useState<string | null>(null)

  useEffect(() => {
    const rawSession = localStorage.getItem('adminSession')
    if (!rawSession) return
    try {
      const parsed = JSON.parse(rawSession) as AdminSession
      if (parsed?.id && parsed?.nickname) {
        setSession(parsed)
      }
    } catch {
      localStorage.removeItem('adminSession')
    }
  }, [])

  const handleLoginSuccess = (nextSession: AdminSession) => {
    localStorage.setItem('adminSession', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    setSession(null)
  }

  if (!session) {
    return <LoginPage onSuccess={handleLoginSuccess} />
  }

  if (route === 'budget') {
    return <BudgetPage onBack={() => setRoute('dashboard')} />
  }
  if (route === 'history') {
    return (
      <RouletteHistoryPage
        onBack={() => setRoute('dashboard')}
        onSelectDate={(date) => {
          setSelectedRouletteDate(date)
          setRoute('participants')
        }}
      />
    )
  }
  if (route === 'participants' && selectedRouletteDate) {
    return (
      <RouletteParticipantsPage
        rouletteDate={selectedRouletteDate}
        onBack={() => setRoute('history')}
      />
    )
  }
  if (route === 'products') {
    return (
      <ProductsPage
        onBack={() => setRoute('dashboard')}
        onCreate={() => setRoute('product-create')}
        onSelectProduct={(productId) => {
          setSelectedProductId(productId)
          setRoute('product-detail')
        }}
      />
    )
  }
  if (route === 'product-create') {
    return <ProductCreatePage onBack={() => setRoute('products')} />
  }
  if (route === 'product-detail' && selectedProductId !== null) {
    return (
      <ProductDetailPage
        productId={selectedProductId}
        onBack={() => setRoute('products')}
        onEdit={() => setRoute('product-edit')}
        onStock={() => setRoute('product-stock')}
        onDeleted={() => setRoute('products')}
        onOrders={() => setRoute('product-orders')}
      />
    )
  }
  if (route === 'product-orders' && selectedProductId !== null) {
    return (
      <OrdersPage
        productId={selectedProductId}
        onBack={() => setRoute('product-detail')}
        onSelectOrder={(orderId) => {
          setSelectedOrderId(orderId)
          setRoute('order-detail')
        }}
      />
    )
  }
  if (route === 'order-detail' && selectedOrderId !== null) {
    return <OrderDetailPage orderId={selectedOrderId} onBack={() => setRoute('product-orders')} />
  }
  if (route === 'product-edit' && selectedProductId !== null) {
    return (
      <ProductEditPage
        productId={selectedProductId}
        onBack={() => setRoute('product-detail')}
      />
    )
  }
  if (route === 'product-stock' && selectedProductId !== null) {
    return (
      <ProductStockPage
        productId={selectedProductId}
        onBack={() => setRoute('product-detail')}
      />
    )
  }

  return (
    <DashboardPage
      session={session}
      onLogout={handleLogout}
      onGoBudget={() => setRoute('budget')}
      onGoHistory={() => setRoute('history')}
      onGoProducts={() => setRoute('products')}
    />
  )
}

export default App
