import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import type { Project } from '@/types'

const ProjectArtifact = lazy(() => import('@/features/artifact/ProjectArtifact'))

interface ProjectCoverProps {
  project: Project
  className?: string
  /** Show the title/category over the image (used on the gallery wall). */
  overlay?: boolean
  /** Tighter padding + smaller type for the dense gallery wall. */
  compact?: boolean
  /** Image + art only, no text — the caption lives outside the cover. */
  bare?: boolean
  /** Render the rotating 3D artifact over the orb (lazy-loaded three.js). */
  artifact?: boolean
}

/**
 * Project cover art. With no screenshot, it shows a soft accent-gradient orb in
 * the corner over a dark base (the abstract "cover" look). If a real image is
 * provided it fades in on top of that art (also handles already-cached images).
 */
export function ProjectCover({
  project,
  className = '',
  overlay = false,
  compact = false,
  bare = false,
  artifact = false,
}: ProjectCoverProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: '#14141b' }}>
      {/* Accent orb — the rounded gradient shape in the corner. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[12%] -top-[24%] aspect-square w-[78%] rounded-full opacity-95 blur-[10px]"
        style={{ background: project.accent }}
      />
      {/* Faint echo for depth. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[34%] -left-[20%] aspect-square w-[52%] rounded-full opacity-25 blur-[26px]"
        style={{ background: project.accent }}
      />

      {artifact && (
        <Suspense fallback={null}>
          <ProjectArtifact project={project} className="pointer-events-none absolute inset-0 z-[1]" />
        </Suspense>
      )}

      {project.image && (
        <img
          ref={imgRef}
          src={project.image}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {!bare && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: overlay
                ? 'linear-gradient(to top, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.12) 55%, rgba(8,8,10,0.3) 100%)'
                : 'linear-gradient(to top, rgba(8,8,10,0) 55%, rgba(8,8,10,0.22) 100%)',
            }}
          />
          <div
            className={`relative z-10 flex h-full flex-col justify-between text-paper ${
              compact ? 'p-4' : 'p-5 md:p-6'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper/80">
              <span>{project.index}</span>
              <span>{project.year}</span>
            </div>

            {overlay && (
              <div>
                <h4 className={`font-display leading-tight ${compact ? 'text-lg' : 'text-2xl md:text-3xl'}`}>
                  {project.title}
                </h4>
                <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper/75">
                  {project.category}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
