import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import BudgetPage from '@/pages/BudgetPage'
import BudgetEditPage from '@/pages/BudgetEditPage'
import RouletteHistoryPage from '@/pages/RouletteHistoryPage'
import RouletteParticipantsPage from '@/pages/RouletteParticipantsPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductCreatePage from '@/pages/ProductCreatePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductEditPage from '@/pages/ProductEditPage'
import ProductStockPage from '@/pages/ProductStockPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import UsersPage from '@/pages/UsersPage'
import UserDetailPage from '@/pages/UserDetailPage'
import type { AdminSession } from '@/types/session'

type RequireAuthProps = {
  session: AdminSession | null
  children: ReactNode
}

function RequireAuth({ session, children }: RequireAuthProps) {
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

function LoginRoute({
  session,
  onLogin,
}: {
  session: AdminSession | null
  onLogin: (next: AdminSession) => void
}) {
  const navigate = useNavigate()

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <LoginPage
      onSuccess={(nextSession) => {
        onLogin(nextSession)
        navigate('/', { replace: true })
      }}
    />
  )
}

function DashboardRoute({
  session,
  onLogout,
}: {
  session: AdminSession
  onLogout: () => void
}) {
  const navigate = useNavigate()

  return (
    <DashboardPage
      session={session}
      onLogout={onLogout}
      onGoBudget={() => navigate('/budget')}
      onGoProducts={() => navigate('/products')}
      onGoUsers={() => navigate('/users')}
    />
  )
}

function BudgetRoute() {
  const navigate = useNavigate()

  return (
    <BudgetPage
      onBack={() => navigate('/')}
      onGoEdit={() => navigate('/budget/edit')}
      onGoHistory={() => navigate('/roulette-history')}
    />
  )
}

function BudgetEditRoute() {
  const navigate = useNavigate()
  return <BudgetEditPage onBack={() => navigate('/budget')} />
}

function HistoryRoute() {
  const navigate = useNavigate()

  return (
    <RouletteHistoryPage
      onBack={() => navigate('/budget')}
      onSelectDate={(date) => navigate(`/roulette/${date}`)}
    />
  )
}

function RouletteParticipantsRoute() {
  const { rouletteDate } = useParams()
  const navigate = useNavigate()

  if (!rouletteDate) return <Navigate to="/roulette-history" replace />

  return (
    <RouletteParticipantsPage
      rouletteDate={rouletteDate}
      onBack={() => navigate('/roulette-history')}
    />
  )
}

function ProductsRoute() {
  const navigate = useNavigate()

  return (
    <ProductsPage
      onBack={() => navigate('/')}
      onCreate={() => navigate('/products/new')}
      onSelectProduct={(productId) => navigate(`/products/${productId}`)}
    />
  )
}

function ProductCreateRoute() {
  const navigate = useNavigate()
  return <ProductCreatePage onBack={() => navigate('/products')} />
}

function ProductDetailRoute() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const id = Number(productId)
  if (!Number.isFinite(id)) return <Navigate to="/products" replace />

  return (
    <ProductDetailPage
      productId={id}
      onBack={() => navigate('/products')}
      onEdit={() => navigate(`/products/${id}/edit`)}
      onStock={() => navigate(`/products/${id}/stock`)}
      onDeleted={() => navigate('/products')}
      onOrders={() => navigate(`/products/${id}/orders`)}
    />
  )
}

function ProductEditRoute() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const id = Number(productId)
  if (!Number.isFinite(id)) return <Navigate to="/products" replace />
  return <ProductEditPage productId={id} onBack={() => navigate(`/products/${id}`)} />
}

function ProductStockRoute() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const id = Number(productId)
  if (!Number.isFinite(id)) return <Navigate to="/products" replace />
  return <ProductStockPage productId={id} onBack={() => navigate(`/products/${id}`)} />
}

function ProductOrdersRoute() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = Number(productId)
  if (!Number.isFinite(id)) return <Navigate to="/products" replace />

  return (
    <OrdersPage
      productId={id}
      onBack={() => navigate(`/products/${id}`)}
      onSelectOrder={(orderId) =>
        navigate(`/orders/${orderId}`, { state: { backTo: location.pathname } })
      }
    />
  )
}

function OrderDetailRoute() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = Number(orderId)
  if (!Number.isFinite(id)) return <Navigate to="/products" replace />
  const backTo =
    typeof location.state === 'object' &&
    location.state &&
    'backTo' in location.state &&
    typeof (location.state as { backTo?: string }).backTo === 'string'
      ? (location.state as { backTo: string }).backTo
      : '/products'

  return <OrderDetailPage orderId={id} onBack={() => navigate(backTo)} />
}

function UsersRoute() {
  const navigate = useNavigate()

  return (
    <UsersPage
      onBack={() => navigate('/')}
      onSelectUser={(userId) => navigate(`/users/${userId}`)}
    />
  )
}

function UserDetailRoute() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const id = Number(userId)
  if (!Number.isFinite(id)) return <Navigate to="/users" replace />

  return (
    <UserDetailPage
      userId={id}
      onBack={() => navigate('/users')}
      onOrders={() => navigate(`/users/${id}/orders`)}
      onPoints={() => navigate(`/users/${id}/points`)}
    />
  )
}

function UserOrdersRoute() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = Number(userId)
  if (!Number.isFinite(id)) return <Navigate to="/users" replace />

  return (
    <OrdersPage
      userId={id}
      onBack={() => navigate(`/users/${id}`)}
      onSelectOrder={(orderId) =>
        navigate(`/orders/${orderId}`, { state: { backTo: location.pathname } })
      }
    />
  )
}

function UserPointsRoute() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const id = Number(userId)
  if (!Number.isFinite(id)) return <Navigate to="/users" replace />

  return <RouletteParticipantsPage userId={id} onBack={() => navigate(`/users/${id}`)} />
}

export default function App() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const rawSession = localStorage.getItem('adminSession')
    if (!rawSession) {
      setReady(true)
      return
    }
    try {
      const parsed = JSON.parse(rawSession) as AdminSession
      if (parsed?.id && parsed?.nickname) {
        setSession(parsed)
      }
    } catch {
      localStorage.removeItem('adminSession')
    } finally {
      setReady(true)
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

  if (!ready) return null

  return (
    <Routes>
      <Route path="/login" element={<LoginRoute session={session} onLogin={handleLoginSuccess} />} />

      <Route
        path="/"
        element={
          <RequireAuth session={session}>
            <DashboardRoute session={session as AdminSession} onLogout={handleLogout} />
          </RequireAuth>
        }
      />
      <Route
        path="/budget"
        element={
          <RequireAuth session={session}>
            <BudgetRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/budget/edit"
        element={
          <RequireAuth session={session}>
            <BudgetEditRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/roulette-history"
        element={
          <RequireAuth session={session}>
            <HistoryRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/roulette/:rouletteDate"
        element={
          <RequireAuth session={session}>
            <RouletteParticipantsRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth session={session}>
            <ProductsRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products/new"
        element={
          <RequireAuth session={session}>
            <ProductCreateRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <RequireAuth session={session}>
            <ProductDetailRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:productId/edit"
        element={
          <RequireAuth session={session}>
            <ProductEditRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:productId/stock"
        element={
          <RequireAuth session={session}>
            <ProductStockRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:productId/orders"
        element={
          <RequireAuth session={session}>
            <ProductOrdersRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <RequireAuth session={session}>
            <OrderDetailRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth session={session}>
            <UsersRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <RequireAuth session={session}>
            <UserDetailRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/users/:userId/orders"
        element={
          <RequireAuth session={session}>
            <UserOrdersRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/users/:userId/points"
        element={
          <RequireAuth session={session}>
            <UserPointsRoute />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={session ? '/' : '/login'} replace />} />
    </Routes>
  )
}
