import type { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    id: 'ada-group',
    company: 'ADA Group',
    role: 'Software Engineering Intern',
    location: 'Singapore',
    period: 'Aug 2025 — Jan 2026',
    bullets: [
      'Took a responsive web app from prototype to a functional, production-ready platform using Flutter for Web and modern frontend patterns.',
      'Implemented WebRTC for low-latency real-time streaming, owning the signaling logic and peer-to-peer connections in the browser.',
      'Designed and expanded a scalable Python (Flask) backend with RESTful endpoints for complex data processing and secure client–server communication.',
    ],
    tags: ['Flutter', 'Python', 'Flask', 'WebRTC'],
  },
  {
    id: 'hilton',
    company: 'Hilton Bali Resort',
    role: 'Banquet Service',
    location: 'Bali, Indonesia',
    period: 'Jan 2022 — Jan 2023',
    bullets: [
      'Served the G20 mega event in 2022, operating under high-pressure, high-stakes conditions.',
      'Supported the event for the Minister of Finance of the Republic of Indonesia.',
    ],
    tags: ['Operations', 'High-stakes events'],
  },
]
