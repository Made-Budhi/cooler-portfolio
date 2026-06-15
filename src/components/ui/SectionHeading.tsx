import type { ReactNode } from 'react'

import { Reveal } from './Reveal'

interface SectionHeadingProps {
  /** Two-digit section index, e.g. "02". */
  index: string
  label: string
  /** Heading content — wrap accent words in <em> for the orange italic. */
  children: ReactNode
  align?: 'left' | 'right'
}

/**
 * The repeated section header: a small mono eyebrow above a large
 * editorial serif title. <em> inside `children` renders as orange italic.
 */
export function SectionHeading({ index, label, children, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <Reveal>
        <div
          className={`label flex items-center gap-3 ${
            align === 'right' ? 'justify-end' : ''
          }`}
        >
          <span className="label-accent">{index}</span>
          <span aria-hidden className="h-px w-8 bg-ink/25" />
          <span>{label}</span>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em] [&_em]:font-normal [&_em]:italic [&_em]:text-accent">
          {children}
        </h2>
      </Reveal>
    </div>
  )
}
