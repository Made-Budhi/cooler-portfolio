import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Seconds before the animation starts once in view. */
  delay?: number
  /** Initial vertical offset in px. */
  y?: number
  className?: string
}

/**
 * Fade-and-rise on scroll into view. The workhorse entrance animation;
 * fires once, respects reduced motion via Framer Motion defaults.
 */
export function Reveal({ children, delay = 0, y = 26, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
