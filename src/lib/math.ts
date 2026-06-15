/** Pure numeric helpers — no DOM, no React. */

export const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Remap `value` from one range to another. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin)
}
