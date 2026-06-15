import { Asterisk } from '@/components/ui/Asterisk'
import { Marquee } from '@/components/ui/Marquee'
import { marqueeItems } from '@/data/skills'

/** Scrolling capability band that sits between the hero and the work section. */
export function CapabilityStrip() {
  return (
    <section aria-label="Capabilities" className="border-y border-ink/12 bg-paper-2 py-6 md:py-7">
      <Marquee durationSeconds={36} bleed>
        {marqueeItems.map((item) => (
          <span key={item} className="flex items-center">
            <span className="px-6 font-display text-[clamp(1.3rem,3vw,2.1rem)] md:px-9">{item}</span>
            <Asterisk className="shrink-0 text-lg text-accent" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}
