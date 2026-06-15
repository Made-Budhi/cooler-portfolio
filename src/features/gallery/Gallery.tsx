import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { projects } from '@/data/projects'
import { useProjectModal } from '@/features/project-detail/ProjectModalContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { clamp, lerp } from '@/lib/math'

import { ProjectCover } from './ProjectCover'

interface DragApi {
  /** Measure an element's rect with the velocity-skew removed (accurate FLIP origin). */
  measure: (el: HTMLElement) => DOMRect
  /** Nudge the strip so a (possibly off-screen) tile becomes visible — for keyboard focus. */
  reveal: (el: HTMLElement) => void
}

/**
 * A draggable, momentum-based project gallery — inspired by phantom.land's
 * tactile work index. Grab and fling the strip, scroll it sideways, drag the
 * scrollbar to scrub, or tap / keyboard-activate a tile to open its case study.
 * Velocity drives a smoothed skew so the strip wobbles as it moves and settles.
 *
 * Interaction is pointer-event based with NO setPointerCapture: a press opens
 * the tile on pointerup if it never crossed the drag threshold, otherwise it's
 * a drag. State resets on every press, so a missed pointerup can't wedge it.
 */
export function Gallery() {
  const { open } = useProjectModal()
  const reduced = usePrefersReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<DragApi | null>(null)

  // Always-fresh opener the rAF/event closures can call without stale state.
  const openRef = useRef<(tileEl: HTMLElement) => void>(() => {})
  openRef.current = (tileEl: HTMLElement) => {
    const id = tileEl.dataset.projectId
    const project = id ? projects.find((p) => p.id === id) : undefined
    if (!project) return
    const media = (tileEl.querySelector('[data-media]') as HTMLElement | null) ?? tileEl
    const rect = apiRef.current ? apiRef.current.measure(media) : media.getBoundingClientRect()
    open(project, rect)
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const scrollbar = scrollbarRef.current
    const thumb = thumbRef.current
    if (!viewport || !track || !scrollbar || !thumb) return

    let min = 0 // furthest-left offset (negative)
    let target = 0
    let current = 0
    let previous = 0
    let skew = 0
    let pointerActive = false
    let dragging = false
    let scrubbing = false
    let activePointer: number | null = null
    let pointerStart = 0
    let targetStart = 0
    let lastPointer = 0
    let velocity = 0
    let downX = 0
    let downY = 0
    let downTile: HTMLElement | null = null
    let driftRemaining = reduced ? 0 : 150 // px of one-time intro nudge
    let visible = true
    let raf = 0

    const DRAG_THRESHOLD = 8

    const measure = () => {
      min = Math.min(0, viewport.clientWidth - track.scrollWidth)
      target = clamp(target, min, 0)
      scrollbar.dataset.hidden = String(min === 0)
      track.classList.toggle('is-centered', min === 0)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (pointerActive && event.pointerId !== activePointer) return // ignore extra pointers
      pointerActive = true
      dragging = false
      activePointer = event.pointerId
      driftRemaining = 0
      pointerStart = event.clientX
      lastPointer = event.clientX
      targetStart = target
      velocity = 0
      downX = event.clientX
      downY = event.clientY
      downTile = (event.target as Element | null)?.closest<HTMLElement>('[data-project-id]') ?? null
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerActive || event.pointerId !== activePointer) return
      const dx = event.clientX - pointerStart
      if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
        dragging = true
        viewport.classList.add('is-dragging')
      }
      if (dragging) {
        target = clamp(targetStart + dx, min - 90, 90) // small rubber-band past edges
        velocity = event.clientX - lastPointer
      }
      lastPointer = event.clientX
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!pointerActive || event.pointerId !== activePointer) return
      pointerActive = false
      activePointer = null
      if (dragging) {
        dragging = false
        viewport.classList.remove('is-dragging')
        target = clamp(target + velocity * 9, min, 0) // fling, then snap into bounds
      } else {
        // It was a tap, not a drag — open the tile.
        const moved = Math.hypot(event.clientX - downX, event.clientY - downY)
        if (downTile && moved < 10) openRef.current(downTile)
      }
      downTile = null
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || min === 0) return
      const next = clamp(target - event.deltaX, min, 0)
      if (next === target) return // already at the edge — let the page scroll
      target = next
      driftRemaining = 0
      event.preventDefault()
    }

    // --- Scrollbar scrubbing ---
    const scrubTo = (clientX: number) => {
      if (min === 0) return
      const rect = scrollbar.getBoundingClientRect()
      const frac = clamp((clientX - rect.left) / rect.width, 0, 1)
      target = frac * min
    }
    const onScrubDown = (event: PointerEvent) => {
      if (min === 0) return
      scrubbing = true
      driftRemaining = 0
      try {
        scrollbar.setPointerCapture(event.pointerId)
      } catch {
        /* ignore */
      }
      scrubTo(event.clientX)
    }
    const onScrubMove = (event: PointerEvent) => {
      if (scrubbing) scrubTo(event.clientX)
    }
    const onScrubUp = () => {
      scrubbing = false
    }

    apiRef.current = {
      measure: (el) => {
        track.style.transform = `translate3d(${current}px, 0, 0)`
        return el.getBoundingClientRect()
      },
      reveal: (el) => {
        driftRemaining = 0
        const vp = viewport.getBoundingClientRect()
        const er = el.getBoundingClientRect()
        const pad = 32
        let delta = 0
        if (er.left < vp.left + pad) delta = vp.left + pad - er.left
        else if (er.right > vp.right - pad) delta = vp.right - pad - er.right
        if (delta !== 0) target = clamp(target + delta, min, 0)
      },
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
    scrollbar.addEventListener('pointerdown', onScrubDown)
    scrollbar.addEventListener('pointermove', onScrubMove)
    scrollbar.addEventListener('pointerup', onScrubUp)
    scrollbar.addEventListener('pointercancel', onScrubUp)

    const render = () => {
      raf = requestAnimationFrame(render)
      if (!visible) return
      if (driftRemaining > 0 && !pointerActive && !scrubbing) {
        const step = 0.4
        target = clamp(target - step, min, 0)
        driftRemaining = target <= min ? 0 : driftRemaining - step
      }
      current = lerp(current, target, dragging || scrubbing ? 0.22 : 0.09)
      const delta = current - previous
      previous = current
      // Velocity-driven skew, smoothed so the strip wobbles as it moves and settles.
      const targetSkew = reduced ? 0 : clamp(delta * 0.32, -12, 12)
      skew = lerp(skew, targetSkew, 0.16)
      track.style.transform = `translate3d(${current}px, 0, 0) skewX(${skew}deg)`

      // Sync the scrollbar thumb.
      if (min < 0) {
        const widthPct = clamp(viewport.clientWidth / track.scrollWidth, 0.06, 1) * 100
        const progress = clamp(current / min, 0, 1)
        thumb.style.width = `${widthPct}%`
        thumb.style.left = `${progress * (100 - widthPct)}%`
      }
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      apiRef.current = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('wheel', onWheel)
      scrollbar.removeEventListener('pointerdown', onScrubDown)
      scrollbar.removeEventListener('pointermove', onScrubMove)
      scrollbar.removeEventListener('pointerup', onScrubUp)
      scrollbar.removeEventListener('pointercancel', onScrubUp)
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
            Drag through
            <br />
            <em className="font-normal italic text-accent">the work.</em>
          </h2>
        </div>
        <p className="max-w-xs leading-relaxed text-paper/55 md:text-right">
          A hands-on index — drag, fling, or scrub the bar below. Tap any project for the full case
          study.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="dg-viewport mt-12 md:mt-16"
        role="group"
        aria-label="Project gallery — drag to explore"
      >
        <div ref={trackRef} className="dg-track gap-4 px-5 md:gap-6 md:px-10">
          {projects.map((project) => (
            <article
              key={project.id}
              data-project-id={project.id}
              role="button"
              tabIndex={0}
              aria-label={`Open case study: ${project.title}`}
              onKeyDown={handleTileKey}
              onFocus={(event) => apiRef.current?.reveal(event.currentTarget)}
              data-hover
              className="dg-tile group w-[54vw] shrink-0 cursor-pointer rounded outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-night sm:w-[34vw] md:w-[25vw] lg:w-[18vw] xl:w-[15vw]"
            >
              {/* Meta — above the image */}
              <div className="mb-2 flex items-center justify-between font-mono text-[0.54rem] uppercase tracking-[0.14em] text-paper/50">
                <span className="truncate pr-2">{project.index}</span>
                <span className="shrink-0">{project.year}</span>
              </div>

              {/* Image — its own box */}
              <div data-media className="relative overflow-hidden rounded">
                <ProjectCover
                  project={project}
                  bare
                  className="aspect-[4/3] w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <span className="pointer-events-none absolute right-2.5 top-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span aria-hidden className="text-sm">↗</span>
                </span>
              </div>

              {/* Meta — below the image */}
              <div className="mt-2.5">
                <h3 className="font-display text-base leading-tight transition-colors group-hover:text-accent md:text-lg">
                  {project.title}
                </h3>
                <p className="mt-1.5 font-mono text-[0.54rem] uppercase tracking-[0.12em] text-paper/45">
                  {project.category}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1640px] px-5 md:px-10">
        <div ref={scrollbarRef} className="dg-scrollbar">
          <div ref={thumbRef} className="dg-thumb" />
        </div>
        <div className="mt-4 flex items-center justify-between label text-paper/45">
          <span className="flex items-center gap-2">
            <span aria-hidden>←</span> Drag · scrub <span aria-hidden>→</span>
          </span>
          <span>{projects.length} projects · 2023 — 2026</span>
        </div>
      </div>
    </section>
  )
}
