import { AnimatePresence } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import type { Project } from '@/types'

import { ProjectDetail } from './ProjectDetail'

interface ActiveProject {
  project: Project
  /** Viewport rect of the clicked tile — origin for the zoom animation. */
  rect: DOMRect | null
}

interface ProjectModalValue {
  open: (project: Project, rect: DOMRect | null) => void
  close: () => void
}

const ProjectModalContext = createContext<ProjectModalValue | null>(null)

export function useProjectModal(): ProjectModalValue {
  const ctx = useContext(ProjectModalContext)
  if (!ctx) throw new Error('useProjectModal must be used within a ProjectModalProvider')
  return ctx
}

/**
 * Owns the "selected project" state and renders the detail overlay.
 *
 * History model: the open modal corresponds to exactly ONE pushed history entry
 * (no URL change), so the browser / mobile Back button closes it.
 * - open from closed → push one entry.
 * - switch project while open → replaceState in place (never grows the stack).
 * - close → history.back() to actually POP the entry (replaceState can't pop, so
 *   using it would leak an entry every cycle and degrade the Back button).
 * - popstate → only close when we've popped off our modal entry (gated on state),
 *   so unrelated navigations can't blank the modal.
 *
 * `ownsEntry` tracks whether our modal entry is currently on the stack, which
 * keeps push/replace/back balanced.
 */
export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveProject | null>(null)
  const ownsEntryRef = useRef(false)

  const open = useCallback((project: Project, rect: DOMRect | null) => {
    setActive({ project, rect })
    const state = { projectModal: project.id }
    if (ownsEntryRef.current) {
      // Already on our modal entry — switch project without growing the stack.
      window.history.replaceState(state, '')
    } else {
      window.history.pushState(state, '')
      ownsEntryRef.current = true
    }
  }, [])

  const close = useCallback(() => {
    if (ownsEntryRef.current) {
      // Pop our entry; the popstate handler clears state + ownsEntry.
      window.history.back()
    } else {
      setActive(null)
    }
  }, [])

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // Only act when we've landed off our modal entry (Back pressed, or our
      // own close()-driven back()). Ignore popstates that stay on a modal entry.
      if (!(event.state as { projectModal?: string } | null)?.projectModal) {
        ownsEntryRef.current = false
        setActive(null)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {active && (
          <ProjectDetail
            key={active.project.id}
            project={active.project}
            rect={active.rect}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </ProjectModalContext.Provider>
  )
}
