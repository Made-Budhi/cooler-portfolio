import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useLocalTime } from '@/hooks/useLocalTime'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useScrolled } from '@/hooks/useScrolled'

export function Navbar() {
  const scrolled = useScrolled(40)
  const time = useLocalTime(profile.timezone)
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile menu is open (ref-counted, shared with modals).
  useLockBodyScroll(open)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled || open
          ? 'border-b border-ink/10 bg-paper/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1640px] items-center justify-between px-5 py-4 md:px-10">
        {/* Wordmark */}
        <a href="#top" className="group flex items-baseline gap-2" aria-label="Home">
          <span className="font-display text-xl font-medium tracking-tight">
            Budhi<span className="text-accent">.</span>
          </span>
          <span className="label hidden sm:inline">©26</span>
        </a>

        {/* Center nav (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="label link transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Meta (desktop) */}
        <div className="hidden items-center gap-5 md:flex">
          <span className="flex items-center gap-2 label">
            {profile.locationShort}
          </span>
          <span className="label tabular-nums">{time}</span>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="label flex items-center gap-2 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
          <span className="relative flex h-3 w-4 flex-col justify-between">
            <span
              className={`h-px w-full bg-ink transition-transform ${open ? 'translate-y-[5px] rotate-45' : ''}`}
            />
            <span className={`h-px w-full bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`h-px w-full bg-ink transition-transform ${open ? '-translate-y-[5px] -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink/10 bg-paper px-5 pb-10 pt-4 md:hidden"
          >
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink/10 py-4 font-display text-3xl tracking-tight"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between label">
              <span>{profile.locationShort}</span>
              <span className="tabular-nums">{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
