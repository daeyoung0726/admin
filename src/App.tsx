import { useEffect, useState } from 'react'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import type { AdminSession } from '@/types/session'

function App() {
  const [session, setSession] = useState<AdminSession | null>(null)

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

  return <DashboardPage session={session} onLogout={handleLogout} />
}

export default App
