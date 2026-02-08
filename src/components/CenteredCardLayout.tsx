import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  title?: string
  children: ReactNode
}

export default function CenteredCardLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F7F9FC] via-[#EEF2F9] to-[#F9FAFD] px-6">
      <Card className="w-full max-w-[720px] rounded-2xl border border-black/10 bg-white shadow-lg">
        <CardContent className="p-8">
          {title ? (
            <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">
              {title}
            </h1>
          ) : null}
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
