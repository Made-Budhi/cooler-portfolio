import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { forEachContourSegment } from '@/lib/contour'
import { clamp, lerp } from '@/lib/math'

interface TopographicFieldProps {
  className?: string
}

/** Grid spacing in CSS px — smaller = denser contours, more work per frame. */
const CELL = 26
const LEVELS = 16
const FIELD_LO = -0.85
const FIELD_HI = 1.7
const AMBIENT = 'rgba(24, 22, 15, 0.14)'
const ACCENT = 'rgba(224, 80, 30, 0.85)'

/**
 * Interactive topographic background.
 *
 * Every frame we evaluate a layered simplex-noise field, add a Gaussian bump
 * centered on the (smoothed) cursor, then trace iso-lines through it with
 * marching squares. The bump makes the cursor read as a hill that bends the
 * contours; the innermost rings are drawn in accent orange. The field drifts
 * slowly on its own (paused when reduced motion is requested or off-screen).
 */
export function TopographicField({ className }: TopographicFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const noise = createNoise3D()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let cellW = 0
    let cellH = 0
    let field = new Float32Array(0)
    let rect = canvas.getBoundingClientRect()

    // Cursor as normalized coords (0..1), smoothed toward the target each frame.
    let targetX = 0.5
    let targetY = 0.42
    let pointerX = targetX
    let pointerY = targetY
    let targetAmp = 0.82
    let amp = targetAmp

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      if (width === 0 || height === 0) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cols = Math.max(2, Math.ceil(width / CELL) + 1)
      rows = Math.max(2, Math.ceil(height / CELL) + 1)
      cellW = width / (cols - 1)
      cellH = height / (rows - 1)
      field = new Float32Array(cols * rows)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rect = canvas.getBoundingClientRect()
    }

    const onPointerMove = (event: PointerEvent) => {
      const nx = (event.clientX - rect.left) / rect.width
      const ny = (event.clientY - rect.top) / rect.height
      const inside = nx > -0.2 && nx < 1.2 && ny > -0.2 && ny < 1.2
      targetX = clamp(nx, -0.1, 1.1)
      targetY = clamp(ny, -0.1, 1.1)
      targetAmp = inside ? 1.05 : 0.82
    }
    const refreshRect = () => {
      rect = canvas.getBoundingClientRect()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    let visible = true
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', refreshRect, { passive: true })

    const freq = 0.0024
    let raf = 0
    let startTime = 0

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      if (!visible || width === 0 || height === 0) return
      if (!startTime) startTime = now

      const z = prefersReducedMotion ? 0 : (now - startTime) * 0.00004

      pointerX = lerp(pointerX, targetX, 0.07)
      pointerY = lerp(pointerY, targetY, 0.07)
      amp = lerp(amp, targetAmp, 0.06)

      const cx = pointerX * width
      const cy = pointerY * height
      const bumpRadius = Math.min(width, height) * 0.34
      const invTwoR2 = 1 / (2 * bumpRadius * bumpRadius)

      for (let r = 0; r < rows; r++) {
        const y = r * cellH
        for (let c = 0; c < cols; c++) {
          const x = c * cellW
          let value =
            0.66 * noise(x * freq, y * freq, z) +
            0.34 * noise(x * freq * 2.1, y * freq * 2.1, z * 1.3 + 11.2)
          const dx = x - cx
          const dy = y - cy
          value += amp * Math.exp(-(dx * dx + dy * dy) * invTwoR2)
          field[r * cols + c] = value
        }
      }

      ctx.clearRect(0, 0, width, height)
      ctx.lineJoin = 'round'

      for (let level = 0; level < LEVELS; level++) {
        const threshold = FIELD_LO + ((level + 0.5) / LEVELS) * (FIELD_HI - FIELD_LO)
        const isAccent = level >= LEVELS - 3
        ctx.strokeStyle = isAccent ? ACCENT : AMBIENT
        ctx.lineWidth = isAccent ? 1.4 : 1
        ctx.beginPath()
        forEachContourSegment(field, cols, rows, threshold, cellW, cellH, (x1, y1, x2, y2) => {
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
        })
        ctx.stroke()
      }
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', refreshRect)
    }
  }, [prefersReducedMotion])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
