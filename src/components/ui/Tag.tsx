import type { ReactNode } from 'react'

/** Small mono pill used for tech stacks and meta labels. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/15 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">
      {children}
    </span>
  )
}
