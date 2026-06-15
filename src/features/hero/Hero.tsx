import { motion } from 'framer-motion'

import { Asterisk } from '@/components/ui/Asterisk'
import { profile } from '@/data/profile'

import { TopographicField } from './TopographicField'

const lineVariants = {
  hidden: { y: '115%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 },
  }),
}

const fade = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.1 },
  }),
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <TopographicField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Soft paper edges to anchor the type over the contour field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(233,227,213,0.55) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1640px] flex-col px-5 pb-8 pt-28 md:px-10 md:pb-10">
        {/* Top row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-5">
            <motion.p
              custom={0}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="label flex max-w-[16ch] items-center gap-2 leading-relaxed"
            >
              <Asterisk className="text-accent" />
              {profile.roleLabel}
            </motion.p>

            <motion.div
              custom={5}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3"
            >
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                data-hover
                className="btn btn-accent"
              >
                View CV <span aria-hidden>↗</span>
              </a>
              <a
                href={profile.previousSite}
                target="_blank"
                rel="noreferrer"
                data-hover
                className="btn"
              >
                Previous site <span aria-hidden>↗</span>
              </a>
            </motion.div>
          </div>

          <motion.p
            custom={1}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="label hidden max-w-[20ch] text-right leading-relaxed md:block"
          >
            {profile.taglineTop[0]}
            <br />
            {profile.taglineTop[1]}
          </motion.p>
        </div>

        {/* Name */}
        <div className="flex flex-1 items-center">
          <h1 className="w-full font-display font-medium leading-[0.8] tracking-[-0.03em]">
            <span className="hero-name-line block">
              <motion.span
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="block text-[clamp(4rem,18vw,16rem)]"
              >
                {profile.displayFirst}
              </motion.span>
            </span>
            <span className="hero-name-line block">
              <motion.span
                custom={1}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="block text-right font-normal italic text-accent text-[clamp(4rem,18vw,16rem)]"
              >
                {profile.displayLast}
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between gap-4 label">
          <motion.span custom={2} variants={fade} initial="hidden" animate="visible">
            ( {profile.years} )
          </motion.span>
          <motion.span
            custom={3}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="hidden tabular-nums md:inline"
          >
            {profile.location}
          </motion.span>
          <motion.a
            href="#work"
            custom={4}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 transition-colors hover:text-ink"
          >
            Scroll
            <span className="scroll-cue inline-block">↓</span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
