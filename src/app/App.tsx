import { Cursor } from '@/components/ui/Cursor'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { About } from '@/features/about/About'
import { CapabilityStrip } from '@/features/capabilities/CapabilityStrip'
import { Contact } from '@/features/contact/Contact'
import { Experience } from '@/features/experience/Experience'
import { Gallery } from '@/features/gallery/Gallery'
import { Hero } from '@/features/hero/Hero'
import { ProjectModalProvider } from '@/features/project-detail/ProjectModalContext'
import { Skills } from '@/features/skills/Skills'
import { Work } from '@/features/work/Work'

/**
 * Composition root. The page is a single vertical scroll; each section is a
 * self-contained feature that reads from the data layer. Order here defines
 * the narrative: who → what → archive → background → how to reach me.
 */
export function App() {
  return (
    <ProjectModalProvider>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <CapabilityStrip />
        <Work />
        <Gallery />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </ProjectModalProvider>
  )
}
