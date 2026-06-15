import { useRef } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { ProjectCover } from '@/features/gallery/ProjectCover'
import { useProjectModal } from '@/features/project-detail/ProjectModalContext'
import type { Project } from '@/types'

/**
 * A large, editorial work feature: an image on one side and the project's
 * story on the other, sides alternating down the page. The whole row opens the
 * case study, zooming from the image.
 */
export function WorkFeature({ project, flip = false }: { project: Project; flip?: boolean }) {
  const imageRef = useRef<HTMLDivElement>(null)
  const { open } = useProjectModal()

  const handleOpen = () => open(project, imageRef.current?.getBoundingClientRect() ?? null)

  return (
    <Reveal>
      <article
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleOpen()
          }
        }}
        aria-label={`Open case study: ${project.title}`}
        className="group grid cursor-pointer items-center gap-8 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8 focus-visible:ring-offset-paper md:grid-cols-2 md:gap-16"
      >
        <div
          ref={imageRef}
          className={`relative overflow-hidden rounded ${flip ? 'md:order-2' : ''}`}
        >
          <ProjectCover
            project={project}
            bare
            artifact
            className="aspect-[4/3] w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <span className="pointer-events-none absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span aria-hidden className="text-xl">↗</span>
          </span>
        </div>

        <div className={flip ? 'md:order-1' : ''}>
          <div className="label flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="label-accent">{project.index}</span>
            <span>{project.category}</span>
            <span aria-hidden>·</span>
            <span>{project.year}</span>
          </div>

          <h3 className="mt-5 font-display text-4xl tracking-tight transition-colors group-hover:text-accent md:text-5xl lg:text-6xl">
            {project.title}
          </h3>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{project.tagline}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <Tag key={tool}>{tool}</Tag>
            ))}
          </div>

          <span className="mt-9 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors group-hover:text-accent">
            View case study <span aria-hidden>→</span>
          </span>
        </div>
      </article>
    </Reveal>
  )
}
