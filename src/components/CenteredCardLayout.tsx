import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  title?: string
  children: ReactNode
}

export default function CenteredCardLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F6F8] px-6">
      <Card className="w-full max-w-[640px] rounded-2xl border border-black/10 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.12)]">
        <CardContent className="px-12 pt-10 pb-14">
          {title ? (
            <h1 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
          ) : null}
          {children}
        </CardContent>
      </Card>
    </div>
  )
}