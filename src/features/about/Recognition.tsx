import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'

import { credentials } from '@/data/education'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import type { CredentialItem } from '@/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const stop = (event: MouseEvent) => event.stopPropagation()

/**
 * Recognition list. Each credential previews its certificate on hover (desktop)
 * and opens a full-size, multi-page lightbox on click / keyboard activation.
 */
export function Recognition() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = credentials.find((c) => c.id === activeId) ?? null

  return (
    <div>
      <span className="label">Recognition</span>
      <div className="mt-3">
        {credentials.map((credential) => (
          <RecognitionRow
            key={credential.id}
            credential={credential}
            onOpen={() => setActiveId(credential.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && <CertificateLightbox credential={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </div>
  )
}

function RecognitionRow({
  credential,
  onOpen,
}: {
  credential: CredentialItem
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-hover
      aria-label={`View certificate: ${credential.title}`}
      className="group relative flex w-full items-baseline justify-between gap-4 border-t border-ink/12 py-3 text-left outline-none"
    >
      <div>
        <h4 className="font-display text-lg leading-tight transition-colors group-hover:text-accent group-focus-visible:text-accent">
          {credential.title}
        </h4>
        <p className="label mt-1 normal-case">{credential.issuer}</p>
      </div>
      <span className="label flex shrink-0 items-center gap-2">
        <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          View
        </span>
        {credential.period}
      </span>

      {/* Hover preview — floats into the gutter on wide screens. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-full top-1/2 z-30 mr-6 hidden w-56 -translate-y-1/2 translate-x-3 -rotate-3 overflow-hidden rounded-md border border-ink/15 bg-paper opacity-0 shadow-2xl transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 lg:block"
      >
        <img src={credential.images[0]} alt="" className="block w-full" />
      </span>
    </button>
  )
}

function CertificateLightbox({
  credential,
  onClose,
}: {
  credential: CredentialItem
  onClose: () => void
}) {
  useLockBodyScroll(true)
  const [page, setPage] = useState(0)
  const images = credential.images
  const multiPage = images.length > 1

  const next = () => setPage((p) => (p + 1) % images.length)
  const prev = () => setPage((p) => (p - 1 + images.length) % images.length)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (multiPage && event.key === 'ArrowRight') next()
      if (multiPage && event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiPage, images.length, onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={credential.title}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-night/92 p-4 backdrop-blur-md md:p-8"
    >
      <div
        onClick={stop}
        className="flex w-full max-w-5xl items-end justify-between gap-4 pb-4 text-paper"
      >
        <div>
          <h3 className="font-display text-xl md:text-2xl">{credential.title}</h3>
          <p className="label mt-1 normal-case text-paper/60">
            {credential.issuer} · {credential.period}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-hover
          className="btn border-paper/30 text-paper hover:bg-paper hover:text-ink"
        >
          Close <span aria-hidden>✕</span>
        </button>
      </div>

      <motion.div
        key={page}
        onClick={stop}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center"
      >
        <img
          src={images[page]}
          alt={`${credential.title} certificate${multiPage ? `, page ${page + 1}` : ''}`}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />
      </motion.div>

      {multiPage && (
        <div onClick={stop} className="mt-4 flex items-center gap-4 text-paper">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous page"
            className="btn border-paper/30 text-paper hover:bg-paper hover:text-ink"
          >
            <span aria-hidden>←</span>
          </button>
          <span className="label text-paper/70">
            {page + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Next page"
            className="btn border-paper/30 text-paper hover:bg-paper hover:text-ink"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </motion.div>
  )
}
