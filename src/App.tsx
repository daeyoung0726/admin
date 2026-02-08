import { useEffect, useState } from 'react'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import BudgetPage from '@/pages/BudgetPage'
import RouletteHistoryPage from '@/pages/RouletteHistoryPage'
import RouletteParticipantsPage from '@/pages/RouletteParticipantsPage'
import type { AdminSession } from '@/types/session'

function App() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [route, setRoute] = useState<'dashboard' | 'budget' | 'history' | 'participants'>(
    'dashboard',
  )
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

  return (
    <DashboardPage
      session={session}
      onLogout={handleLogout}
      onGoBudget={() => setRoute('budget')}
      onGoHistory={() => setRoute('history')}
    />
  )
}

export default App
