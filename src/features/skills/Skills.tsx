import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { skillGroups } from '@/data/skills'

export function Skills() {
  return (
    <section id="skills" className="bg-paper-2">
      <div className="mx-auto max-w-[1640px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading index="05" label="Capabilities">
          Tools I reach
          <br />
          <em>for.</em>
        </SectionHeading>

        <div className="mt-16 grid gap-x-10 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.06}>
              <div className="border-t border-ink/15 pt-5">
                <h3 className="label">{group.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
