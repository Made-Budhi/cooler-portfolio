import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { education } from '@/data/education'
import { profile } from '@/data/profile'

import { Recognition } from './Recognition'

export function About() {
  return (
    <section id="about" className="bg-paper-2">
      <div className="mx-auto max-w-[1640px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading index="03" label="About">
          Engineer across
          <br />
          the <em>whole stack.</em>
        </SectionHeading>

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12">
          {/* Statement + summary */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="max-w-2xl font-display text-2xl leading-snug md:text-3xl">
                {profile.statement}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-xl leading-relaxed text-ink-soft">{profile.summary}</p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12">
                <span className="label">Languages</span>
                <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4">
                  {profile.languages.map((language) => (
                    <div key={language.label}>
                      <div className="font-display text-xl">{language.label}</div>
                      <div className="label mt-1">{language.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Card + education + recognition */}
          <div className="space-y-12 md:col-span-5 md:col-start-8">
            <Reveal>
              <div className="rounded-2xl border border-ink/12 bg-paper p-6">
                <div className="flex items-center justify-between label">
                  <span>{profile.locationShort}</span>
                  <span>{profile.role}</span>
                </div>
                <div className="mt-10 font-display text-7xl font-medium italic text-accent">{profile.nickname}</div>
                <div className="mt-3 font-display text-2xl leading-tight">{profile.fullName}</div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div>
                <span className="label">Education</span>
                <div className="mt-3">
                  {education.map((item) => (
                    <div key={item.id} className="border-t border-ink/12 py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-display text-xl">{item.school}</h4>
                        <span className="label shrink-0">{item.period}</span>
                      </div>
                      <p className="mt-1 text-ink-soft">{item.program}</p>
                      {item.note && <p className="mt-2 text-sm leading-relaxed text-ink-soft/85">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Recognition />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
