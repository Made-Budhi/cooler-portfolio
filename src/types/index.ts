/**
 * Domain types — the shared vocabulary of the portfolio.
 * The data layer (`src/data`) produces these; the UI layer consumes them.
 * Keeping them here means presentation never invents its own shapes.
 */

/** A headed paragraph in a project's long-form story. */
export interface ProjectSection {
  heading: string
  body: string
}

export interface Project {
  id: string
  /** Display index, e.g. "01". */
  index: string
  title: string
  category: string
  year: string
  role: string
  /** One-line hook shown on cards and under the detail title. */
  tagline: string
  tools: string[]
  /** Opening paragraph on the detail page. */
  overview: string
  /** Long-form story, broken into headed sections. */
  sections: ProjectSection[]
  /** CSS gradient used behind/while-loading the cover image. */
  accent: string
  /** Real cover image (served from /public). */
  image?: string
  /** Optional external link to the live project / repo. */
  href?: string
  /** Featured projects surface as large cards in the Work section. */
  featured: boolean
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  period: string
  bullets: string[]
  tags: string[]
}

export interface EducationItem {
  id: string
  school: string
  program: string
  period: string
  note?: string
}

export interface CredentialItem {
  id: string
  title: string
  issuer: string
  period: string
  /** Certificate scans shown in the recognition viewer (multi-page allowed). */
  images: string[]
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
  handle: string
}
