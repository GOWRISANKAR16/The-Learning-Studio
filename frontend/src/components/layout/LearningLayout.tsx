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
        <div className="md:sticky md:top-4 md:w-80 md:flex-shrink-0 md:self-start">
          {sidebar}
        </div>
        <div className="min-w-0 flex-1 space-y-4">{children}</div>
      </div>
    </AppShell>
  )
}

