import type { CSSProperties, ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Seconds for one full loop. Lower = faster. */
  durationSeconds?: number
  direction?: 'normal' | 'reverse'
  pauseOnHover?: boolean
  /** Remove the edge fade mask. */
  bleed?: boolean
  className?: string
}

/**
 * Infinite horizontal marquee. Renders two identical groups inside the track
 * and translates by -50%, so the loop is seamless regardless of content width.
 */
export function Marquee({
  children,
  durationSeconds = 32,
  direction = 'normal',
  pauseOnHover = false,
  bleed = false,
  className = '',
}: MarqueeProps) {
  const style = {
    '--marquee-duration': `${durationSeconds}s`,
    '--marquee-direction': direction,
  } as CSSProperties

  return (
    <div
      className={[
        'marquee',
        bleed ? 'marquee--bleed' : '',
        pauseOnHover ? 'marquee--pause' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="marquee__track" style={style}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
