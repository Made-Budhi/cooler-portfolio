/**
 * Marching squares — extract iso-lines ("contours") from a scalar field.
 *
 * This is pure logic with no canvas/React dependency: it walks a grid of
 * values and, for every cell crossed by `threshold`, emits the line segment(s)
 * where the contour passes through. The renderer decides what to do with them.
 *
 * Field layout: row-major `Float32Array` of size `cols * rows`,
 * where `field[r * cols + c]` is the value at grid node (c, r).
 */

export type SegmentEmitter = (x1: number, y1: number, x2: number, y2: number) => void

/** Fractional position of `threshold` between corner values `a` and `b`. */
function cross(a: number, b: number, threshold: number): number {
  const d = b - a
  if (d === 0) return 0.5
  return (threshold - a) / d
}

/**
 * Walk the field and emit every contour segment at `threshold`.
 * Coordinates are in pixels: grid node (c, r) maps to (c * cellW, r * cellH).
 *
 * Using a callback (rather than allocating an array per frame) keeps the
 * animation loop allocation-free, which matters at 60fps.
 */
export function forEachContourSegment(
  field: Float32Array,
  cols: number,
  rows: number,
  threshold: number,
  cellW: number,
  cellH: number,
  emit: SegmentEmitter,
): void {
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const i = r * cols + c
      const tl = field[i]
      const tr = field[i + 1]
      const bl = field[i + cols]
      const br = field[i + cols + 1]

      // Build the 4-bit marching-squares case (tl=8, tr=4, br=2, bl=1).
      let state = 0
      if (tl > threshold) state |= 8
      if (tr > threshold) state |= 4
      if (br > threshold) state |= 2
      if (bl > threshold) state |= 1
      if (state === 0 || state === 15) continue

      const x = c * cellW
      const y = r * cellH

      // Edge crossing points (only the ones a case needs are read).
      const topX = x + cellW * cross(tl, tr, threshold)
      const topY = y
      const rightX = x + cellW
      const rightY = y + cellH * cross(tr, br, threshold)
      const bottomX = x + cellW * cross(bl, br, threshold)
      const bottomY = y + cellH
      const leftX = x
      const leftY = y + cellH * cross(tl, bl, threshold)

      switch (state) {
        case 1: // bl
        case 14:
          emit(leftX, leftY, bottomX, bottomY)
          break
        case 2: // br
        case 13:
          emit(bottomX, bottomY, rightX, rightY)
          break
        case 3:
        case 12:
          emit(leftX, leftY, rightX, rightY)
          break
        case 4: // tr
        case 11:
          emit(topX, topY, rightX, rightY)
          break
        case 6:
        case 9:
          emit(topX, topY, bottomX, bottomY)
          break
        case 7: // tr, br, bl
        case 8: // tl
          emit(topX, topY, leftX, leftY)
          break
        case 5: // saddle: tl + br high
          emit(topX, topY, leftX, leftY)
          emit(bottomX, bottomY, rightX, rightY)
          break
        case 10: // saddle: tr + bl high
          emit(topX, topY, rightX, rightY)
          emit(leftX, leftY, bottomX, bottomY)
          break
      }
    }
  }
}
