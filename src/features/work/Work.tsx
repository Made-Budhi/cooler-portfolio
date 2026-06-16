import { SectionHeading } from '@/components/ui/SectionHeading'
import { featuredProjects } from '@/data/projects'

import { WorkFeature } from './WorkFeature'

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1640px] px-5 py-24 md:px-10 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading index="01" label="Selected Work">
          Featured projects,
          <br />
          <em>start to finish.</em>
        </SectionHeading>
        <p className="max-w-xs leading-relaxed text-ink-soft md:text-right">
          The projects I designed and engineered end to end — click through for the full story.
        </p>
      </div>

      <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
        {featuredProjects.map((project, i) => (
          <WorkFeature key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
