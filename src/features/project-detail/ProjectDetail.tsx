import { motion, useIsPresent } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { Tag } from '@/components/ui/Tag'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import type { Project } from '@/types'

const ProjectArtifact = lazy(() => import('@/features/artifact/ProjectArtifact'))

interface ProjectDetailProps {
  project: Project
  /** Origin rect of the clicked tile; null falls back to a centered zoom. */
  rect: DOMRect | null
  onClose: () => void
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

/**
 * Full-screen, blog-style project page.
 *
 * The hero image performs a FLIP zoom: it starts transformed to overlap the
 * exact tile the user clicked (viewport coords from `rect`) and animates to a
 * full-width hero. Title and long-form content fade in once the zoom lands; on
 * close the hero zooms back into the tile while the page fades over the same
 * duration so the reverse zoom stays visible.
 */
export function ProjectDetail({ project, rect, onClose }: ProjectDetailProps) {
  useLockBodyScroll(true)
  // While AnimatePresence plays the exit, isPresent is false — drop pointer
  // events for the whole exit so the fading overlay never blocks the gallery.
  // NB: useIsPresent (read-only), NOT usePresence — the latter would make this
  // component responsible for its own removal, so it would never unmount.
  const isPresent = useIsPresent()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Hero height is fixed (px) so it matches the FLIP math precisely.
  const [heroHeight] = useState(() => Math.max(340, Math.round(window.innerHeight * 0.6)))

  useEffect(() => {
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      // Trap Tab focus inside the dialog.
      if (event.key === 'Tab') {
        const root = dialogRef.current
        if (!root) return
        const items = root.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (event.shiftKey && (active === first || !root.contains(active))) {
          last.focus()
          event.preventDefault()
        } else if (!event.shiftKey && (active === last || !root.contains(active))) {
          first.focus()
          event.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const viewportWidth = window.innerWidth
  const scaleX = rect ? rect.width / viewportWidth : 0.5
  const scaleY = rect ? rect.height / heroHeight : 0.5
  const originX = rect ? rect.left : viewportWidth * 0.25
  const originY = rect ? rect.top : 100

  const heroFrom = { x: originX, y: originY, scaleX, scaleY }
  const heroTo = { x: 0, y: 0, scaleX: 1, scaleY: 1 }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — case study`}
      className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-paper text-ink"
      style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        data-hover
        className="btn fixed right-4 top-4 z-[70] bg-paper/85 backdrop-blur-md md:right-8 md:top-6"
      >
        Close <span aria-hidden>✕</span>
      </button>

      {/* Hero with FLIP zoom */}
      <div className="relative w-full overflow-hidden" style={{ height: heroHeight }}>
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: '0 0', backgroundColor: '#14141b' }}
          initial={heroFrom}
          animate={heroTo}
          exit={{ ...heroFrom, transition: { duration: 0.5, ease: EASE } }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Accent orb (shown when there's no screenshot). */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[6%] -top-[45%] aspect-square w-[52%] rounded-full opacity-90 blur-[34px]"
            style={{ background: project.accent }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[55%] left-[8%] aspect-square w-[38%] rounded-full opacity-30 blur-[55px]"
            style={{ background: project.accent }}
          />
          {project.image && (
            <img src={project.image} alt="" className="h-full w-full object-cover" />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,8,10,0.86) 0%, rgba(8,8,10,0.25) 55%, rgba(8,8,10,0.4) 100%)',
            }}
          />
        </motion.div>

        {/* Rotating 3D artifact (separate layer so the FLIP zoom doesn't distort it). */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          <Suspense fallback={null}>
            <ProjectArtifact project={project} className="h-full w-full" />
          </Suspense>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 mx-auto flex max-w-[1100px] flex-col justify-end px-5 pb-10 text-paper md:px-10 md:pb-14"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, delay: 0.48, ease: EASE }}
        >
          <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/75">
            <span className="text-accent">{project.index}</span>
            <span>{project.category}</span>
            <span aria-hidden>·</span>
            <span>{project.year}</span>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,6.5vw,5rem)] font-medium leading-[0.96] tracking-[-0.02em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl font-display text-lg leading-snug text-paper/90 md:text-2xl">
            {project.tagline}
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <motion.div
        className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
      >
        <div className="grid gap-8 border-b border-ink/12 pb-12 md:grid-cols-[200px_1fr] md:gap-12">
          <div>
            <span className="label">Role</span>
            <p className="mt-3 font-display text-xl">{project.role}</p>
          </div>
          <div>
            <span className="label">Stack</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <Tag key={tool}>{tool}</Tag>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-14 max-w-3xl font-display text-2xl leading-snug md:text-[2rem]" dangerouslySetInnerHTML={{ __html: project.overview }} />

        <div className="mt-16 space-y-14 md:mt-20">
          {project.sections.map((section, i) => (
            <section key={i} className="grid gap-4 md:grid-cols-[280px_1fr] md:gap-12">
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">
                <span className="label-accent mr-3 align-middle font-mono text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.heading}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-ink/12 pt-10">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              data-hover
              className="btn btn-accent"
            >
              Visit project <span aria-hidden>↗</span>
            </a>
          ) : (
            <span className="label max-w-sm normal-case text-ink-soft">
              Private / academic project — happy to walk through it on request.
            </span>
          )}
          <button type="button" onClick={onClose} data-hover className="btn">
            <span aria-hidden>←</span> Back to work
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
