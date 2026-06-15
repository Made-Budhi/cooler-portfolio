import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { experience } from '@/data/experience'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-[1640px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading index="04" label="Experience">
        Where I&apos;ve
        <br />
        <em>worked.</em>
      </SectionHeading>

      <div className="mt-16 md:mt-20">
        {experience.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <div className="grid gap-6 border-t border-ink/12 py-10 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <h3 className="font-display text-2xl md:text-3xl">{item.role}</h3>
                <p className="mt-2 text-ink-soft">
                  {item.company} — {item.location}
                </p>
                <p className="label mt-3">{item.period}</p>
              </div>

              <div className="md:col-span-8">
                <ul className="space-y-3">
                  {item.bullets.map((bullet, b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
