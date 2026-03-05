import type { ReactNode } from 'react'
import { AppShell } from './AppShell'

type Props = {
  sidebar: ReactNode
  children: ReactNode
}

export function LearningLayout({ sidebar, children }: Props) {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="md:w-72 md:flex-shrink-0">{sidebar}</div>
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </AppShell>
  )
}

