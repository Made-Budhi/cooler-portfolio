import { useEffect, useRef } from 'react'

import { lerp } from '@/lib/math'

const HOVER_SELECTOR = 'a, button, [data-hover], input, textarea'

/**
 * Custom cursor: a precise dot that tracks instantly and a ring that trails
 * with easing and swells over interactive elements. Native cursor is only
 * hidden once this mounts (via a class on <html>), so a JS failure can never
 * leave the user without a pointer. Disabled on touch / coarse pointers.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    if (!finePointer.matches) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    const place = (el: HTMLElement | null, x: number, y: number) => {
      if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      place(dotRef.current, mouseX, mouseY)
    }

    const setHover = (hovering: boolean) => {
      ringRef.current?.setAttribute('data-hover', String(hovering))
    }

    const onOver = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(HOVER_SELECTOR)) setHover(true)
    }
    const onOut = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(HOVER_SELECTOR)) setHover(false)
    }

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.18)
      ringY = lerp(ringY, mouseY, 0.18)
      place(ringRef.current, ringX, ringY)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      root.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}
