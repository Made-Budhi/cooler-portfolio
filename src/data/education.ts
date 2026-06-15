import type { CredentialItem, EducationItem } from '@/types'

export const education: EducationItem[] = [
  {
    id: 'pnb',
    school: 'Politeknik Negeri Bali',
    program: 'Software Engineering',
    period: 'Sep 2022 — Present',
    note: 'Received the Best Project award twice during project-based learning.',
  },
  {
    id: 'coventry',
    school: 'Coventry University',
    program: 'AI & Software (Exchange)',
    period: 'Sep 2024 — Dec 2024',
    note: 'One-semester exchange via the fully-funded IISMA scholarship.',
  },
]

export const credentials: CredentialItem[] = [
  {
    id: 'iisma',
    title: 'Indonesian International Student Mobility Awards (IISMA)',
    issuer: 'Ministry of Education, Culture, Research, and Technology',
    period: '2025',
    images: ['/certificates/iisma.jpg'],
  },
  {
    id: 'toeic',
    title: 'TOEIC — 925 / 990',
    issuer: 'ETS',
    period: '2024',
    images: ['/certificates/toeic.jpg'],
  },
  {
    id: 'lsp',
    title: 'Junior Web Programmer (Certificate of Competence)',
    issuer: 'LSP TIK Indonesia',
    period: '2024',
    images: ['/certificates/junior-web-1.jpg', '/certificates/junior-web-2.jpg'],
  },
]
