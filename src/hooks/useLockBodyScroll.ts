import { useEffect } from 'react'

/**
 * Freeze background scroll while a modal / overlay is open.
 *
 * Ref-counted at the module level so multiple simultaneous consumers (the
 * project detail page, a certificate lightbox, the mobile nav menu) cooperate
 * over the single `document.body.style.overflow` property instead of clobbering
 * each other. Scroll is restored only once the last lock releases. The count is
 * clamped at 0 and always restores to '' so the page can never be left locked.
 */
let lockCount = 0

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    lockCount += 1
    document.body.style.overflow = 'hidden'

    return () => {
      lockCount -= 1
      if (lockCount <= 0) {
        lockCount = 0
        document.body.style.overflow = ''
      }
    }
  }, [locked])
}
