/** A clean six-ray asterisk used as a label glyph and marquee separator. */
export function Asterisk({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="-12 -12 24 24"
      width="1em"
      height="1em"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="0" y1="-10" x2="0" y2="10" />
      <line x1="-8.66" y1="-5" x2="8.66" y2="5" />
      <line x1="-8.66" y1="5" x2="8.66" y2="-5" />
    </svg>
  )
}
