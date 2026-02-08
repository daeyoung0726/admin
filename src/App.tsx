import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function App() {
  type Campaign = {
    name: string
    status: 'Active' | 'Paused' | 'Draft'
    budget: string
    updatedAt: string
  }

  const campaigns: Campaign[] = [
    { name: 'Weekend Spin', status: 'Active', budget: '₩2,400,000', updatedAt: '2026-02-08' },
    { name: 'New User Bonus', status: 'Paused', budget: '₩1,200,000', updatedAt: '2026-02-02' },
    { name: 'Holiday Special', status: 'Draft', budget: '₩3,800,000', updatedAt: '2026-01-25' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/40">
          <div className="px-6 py-6 text-lg font-semibold">Roulette Admin</div>
          <nav className="space-y-2 px-4 text-sm text-slate-300">
            <button className="w-full rounded-lg bg-slate-800 px-3 py-2 text-left text-slate-100">
              Dashboard
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/70">
              Campaigns
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/70">
              Rewards
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/70">
              Users
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/70">
              Settings
            </button>
          </nav>
        </aside>

        <main className="flex flex-col gap-6 p-6">
          <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Today · 2026-02-08
              </p>
              <h1 className="text-2xl font-semibold">Campaign Overview</h1>
              <p className="text-sm text-slate-400">
                Monitor active spins, budgets, and performance at a glance.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                placeholder="Search campaigns"
                className="w-full bg-slate-950/50 sm:w-64"
              />
              <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                Create Campaign
              </Button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Active Campaigns', value: '12', trend: '+4.1%' },
              { label: 'Daily Spins', value: '4,821', trend: '+7.8%' },
              { label: 'Redemptions', value: '1,297', trend: '+2.3%' },
              { label: 'Revenue Impact', value: '₩8,600,000', trend: '+5.6%' },
            ].map((stat) => (
              <Card key={stat.label} className="border-slate-800 bg-slate-900/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">{stat.value}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300">
                    {stat.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.name}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            campaign.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : campaign.status === 'Paused'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-700/40 text-slate-300'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.budget}</TableCell>
                      <TableCell className="text-slate-400">
                        {campaign.updatedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default App
