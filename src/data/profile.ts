import type { SocialLink } from '@/types'

/**
 * Single source of truth for personal content, derived from the CV.
 * Update copy here — never inline in components.
 *
 * TODO(budhi): replace the GitHub / LinkedIn URLs below with your real ones.
 */
export const profile = {
  fullName: 'I Made Bagus Mahatma Budhi',
  nickname: 'Made Budhi',
  // The hero splits the name into two editorial words.
  displayFirst: 'MADE',
  displayLast: 'BUDHI',

  role: 'Software Engineer',
  roleLabel: 'Software Engineer · Full-stack Developer',

  /** Downloadable CV (served from /public) and the previous portfolio site. */
  cvUrl: '/Made-Budhi-CV.pdf',
  previousSite: 'https://portfolio-cool-seven.vercel.app/',

  /** Small two-line tagline near the hero. */
  taglineTop: ['Efficiency first.', 'Always.'],

  /** Big statement used in the about intro. */
  statement:
    'I build reliable software — from the interface a person touches down to the systems and services behind it.',

  summary:
    'Software engineering student with experience in full-stack web development, system analysis, and software project leadership. I work comfortably across the frontend and backend to ship web applications, and I like leading small teams from prototype to production.',

  location: 'Denpasar, Bali — Indonesia',
  locationShort: 'BALI, ID',
  coordinates: '8.4095° S / 115.1889° E',
  /** IANA zone for Bali (WITA, UTC+8). */
  timezone: 'Asia/Makassar',

  years: '2022 — 2026',
  status: 'OPEN TO WORK — 2026',
  availability: 'Open to work',

  email: 'madebudhi15@gmail.com',

  languages: [
    { label: 'Indonesian', level: 'Native' },
    { label: 'English', level: 'Fluent · TOEIC 925' },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/madebudhi', handle: 'github.com/madebudhi' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/madebudhi', handle: 'in/madebudhi' },
    { label: 'Instagram', href: 'https://www.instagram.com/made_budhi', handle: 'instagram.com/made_budhi' },
    { label: 'Email', href: 'mailto:madebudhi15@gmail.com', handle: 'madebudhi15@gmail.com' },
  ] satisfies SocialLink[],
} as const
