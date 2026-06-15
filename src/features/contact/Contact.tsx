import { Reveal } from '@/components/ui/Reveal'
import { profile } from '@/data/profile'
import { useLocalTime } from '@/hooks/useLocalTime'

export function Contact() {
  const time = useLocalTime(profile.timezone)

  return (
    <section id="contact" className="relative overflow-hidden bg-night text-paper">
      <div className="mx-auto max-w-[1640px] px-5 py-28 md:px-10 md:py-40">
        <div className="label flex items-center gap-3 text-paper/55">
          <span className="text-accent">06</span>
          <span aria-hidden className="h-px w-8 bg-paper/25" />
          <span>Contact</span>
        </div>

        <Reveal>
          <h2 className="mt-8 font-display text-[clamp(3rem,11vw,10.5rem)] font-medium leading-[0.86] tracking-[-0.03em]">
            Let&apos;s build
            <br />
            <em className="font-normal italic text-accent">something good.</em>
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <a
              href={`mailto:${profile.email}`}
              data-hover
              className="link font-display text-2xl tracking-tight md:text-4xl"
            >
              {profile.email}
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {profile.socials
                .filter((social) => social.label !== 'Email')
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="link label text-paper/80 hover:text-paper"
                  >
                    {social.label} ↗
                  </a>
                ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-paper/15 pt-6 label text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {profile.availability}
          </span>
          <span>{profile.location}</span>
          <span className="tabular-nums">{time} WITA</span>
        </div>
      </div>
    </section>
  )
}
