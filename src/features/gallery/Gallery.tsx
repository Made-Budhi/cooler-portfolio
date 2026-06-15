import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { projects } from '@/data/projects'
import { useProjectModal } from '@/features/project-detail/ProjectModalContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { clamp, lerp } from '@/lib/math'

import { ProjectCover } from './ProjectCover'

/** Two copies of the project set make the loop seamless (one always fills the viewport). */
const COPIES = 2
const loopTiles = Array.from({ length: COPIES }).flatMap(() => projects)

const MAX_ANGLE = 34 // deg of inward rotation at the edges
const DEPTH = 200 // px the edges recede

/**
 * A curved, infinite, momentum-based gallery — a panoramic "360" arc of project
 * covers (inspired by curved architecture-studio galleries). Drag, fling, or
 * scroll sideways; it loops forever and drifts gently on its own. Each tile is
 * rotated toward the center on a perspective curve, and (on desktop) carries
 * its rotating 3D artifact. Tap / keyboard-activate a tile to open its study.
 */
export function Gallery() {
  const { open } = useProjectModal()
  const reduced = usePrefersReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [showArtifact, setShowArtifact] = useState(false)

  // Only run the per-tile WebGL artifacts where there's GPU headroom.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const apply = () => setShowArtifact(mql.matches && !reduced)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [reduced])

  const openRef = useRef<(tileEl: HTMLElement) => void>(() => {})
  openRef.current = (tileEl: HTMLElement) => {
    const id = tileEl.dataset.projectId
    const project = id ? projects.find((p) => p.id === id) : undefined
    if (!project) return
    const media = (tileEl.querySelector('[data-media]') as HTMLElement | null) ?? tileEl
    open(project, media.getBoundingClientRect())
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const tileEls = Array.from(track.children) as HTMLElement[]
    let centers: number[] = []
    let setWidth = 0
    let offset = 0
    let current = 0
    let pointerActive = false
    let dragging = false
    let activePointer: number | null = null
    let lastPointer = 0
    let velocity = 0
    let startX = 0
    let downTile: HTMLElement | null = null
    let visible = true
    let raf = 0

    const DRAG_THRESHOLD = 8
    const drift = reduced ? 0 : 0.18 // px/frame ambient rotation

    const measure = () => {
      centers = tileEls.map((el) => el.offsetLeft + el.offsetWidth / 2)
      // Distance between a tile and its copy = exactly one set width.
      setWidth = tileEls.length > projects.length ? tileEls[projects.length].offsetLeft - tileEls[0].offsetLeft : 0
    }

    // Manual hit-test: native click/hover is unreliable through the 3D-curved
    // tiles, so find the tile whose projected rect contains the point.
    const tileAt = (x: number, y: number): HTMLElement | null => {
      let best: HTMLElement | null = null
      let bestDist = Infinity
      for (const el of tileEls) {
        const r = el.getBoundingClientRect()
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2))
          if (d < bestDist) {
            bestDist = d
            best = el
          }
        }
      }
      return best
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (pointerActive && event.pointerId !== activePointer) return
      pointerActive = true
      dragging = false
      activePointer = event.pointerId
      lastPointer = event.clientX
      startX = event.clientX
      velocity = 0
      downTile = tileAt(event.clientX, event.clientY) // the aimed tile
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerActive || event.pointerId !== activePointer) return
      const dx = event.clientX - lastPointer
      lastPointer = event.clientX
      if (!dragging && Math.abs(event.clientX - startX) > DRAG_THRESHOLD) {
        dragging = true
        downTile = null // it's a drag, not a tap
        viewport.classList.add('is-dragging')
      }
      if (dragging) {
        offset -= dx
        velocity = -dx
      }
    }
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerActive || event.pointerId !== activePointer) return
      pointerActive = false
      activePointer = null
      if (dragging) {
        dragging = false
        viewport.classList.remove('is-dragging')
        offset += velocity * 12 // fling
      } else if (downTile) {
        openRef.current(downTile) // it was a tap on this tile
      }
      downTile = null
    }
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      offset += event.deltaX
      event.preventDefault()
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewport)
    resizeObserver.observe(track)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(viewport)

    viewport.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    viewport.addEventListener('wheel', onWheel, { passive: false })

    const render = () => {
      raf = requestAnimationFrame(render)
      if (!visible || setWidth === 0) return
      if (!pointerActive) offset += drift
      current = lerp(current, offset, dragging ? 0.2 : 0.08)
      // Seamless loop: keep current in [0, setWidth) and shift offset with it.
      while (current >= setWidth) {
        current -= setWidth
        offset -= setWidth
      }
      while (current < 0) {
        current += setWidth
        offset += setWidth
      }
      track.style.transform = `translate3d(${-current}px, 0, 0)`

      const vpCenter = viewport.clientWidth / 2
      for (let i = 0; i < tileEls.length; i++) {
        const dx = clamp((centers[i] - current - vpCenter) / vpCenter, -1.5, 1.5)
        const rotateY = -dx * MAX_ANGLE
        const tz = -Math.abs(dx) * DEPTH
        const el = tileEls[i]
        el.style.transform = `translateZ(${tz}px) rotateY(${rotateY}deg)`
        el.style.opacity = String(clamp(1 - Math.abs(dx) * 0.4, 0.25, 1))
      }
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('wheel', onWheel)
    }
  }, [reduced])

  const handleTileKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openRef.current(event.currentTarget)
    }
  }

  return (
    <section id="gallery" className="overflow-hidden bg-night py-24 text-paper md:py-32">
      <div className="mx-auto flex max-w-[1640px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <div className="label flex items-center gap-3 text-paper/55">
            <span className="text-accent">02</span>
            <span aria-hidden className="h-px w-8 bg-paper/25" />
            <span>The Archive</span>
          </div>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em]">
            A panorama
            <br />
            <em className="font-normal italic text-accent">of the work.</em>
          </h2>
        </div>
        <p className="max-w-xs leading-relaxed text-paper/55 md:text-right">
          An endless, curved reel — drag, fling, or scroll sideways. Tap any project for the full
          case study.
        </p>
      </div>

      <div ref={viewportRef} className="dg-viewport mt-12 md:mt-16" role="group" aria-label="Project gallery — drag to explore">
        <div ref={trackRef} className="dg-track gap-5 md:gap-7">
          {loopTiles.map((project, i) => (
            <article
              key={`${project.id}-${i}`}
              data-project-id={project.id}
              role="button"
              tabIndex={i < projects.length ? 0 : -1}
              aria-hidden={i >= projects.length}
              aria-label={`Open case study: ${project.title}`}
              onKeyDown={handleTileKey}
              data-hover
              className="dg-tile group w-[80vw] shrink-0 cursor-pointer sm:w-[50vw] md:w-[36vw] lg:w-[27vw]"
            >
              {/* Meta — above the image */}
              <div className="mb-2.5 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper/50">
                <span>{project.index}</span>
                <span>{project.year}</span>
              </div>

              {/* Image */}
              <div data-media className="relative aspect-[4/3] overflow-hidden rounded">
                <ProjectCover
                  project={project}
                  bare
                  artifact={showArtifact}
                  artifactQuality="low"
                  className="absolute inset-0 h-full w-full"
                />
                <span className="pointer-events-none absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span aria-hidden>↗</span>
                </span>
              </div>

              {/* Meta — below the image */}
              <div className="mt-3">
                <h3 className="font-display text-lg leading-tight transition-colors group-hover:text-accent md:text-xl">
                  {project.title}
                </h3>
                <p className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-paper/45">
                  {project.category}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1640px] items-center justify-between px-5 label text-paper/45 md:px-10">
        <span className="flex items-center gap-2">
          <span aria-hidden>←</span> Drag <span aria-hidden>→</span>
        </span>
        <span>{projects.length} projects · 2023 — 2026</span>
      </div>
    </section>
  )
}
