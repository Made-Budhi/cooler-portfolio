import type { SkillGroup } from '@/types'

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'Java'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React', 'NuxtJS', 'Laravel', 'Flask', 'Flutter', 'Tailwind CSS', 'shadcn/ui'],
  },
  {
    label: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'Docker', 'MySQL', 'Supabase', 'Figma', 'Jira', 'Confluence'],
  },
  {
    label: 'Practices',
    items: ['System Analysis', 'Project Management', 'Communication'],
  },
]

/** Short phrases for the scrolling capability strip under the hero. */
export const marqueeItems: string[] = [
  'Full-stack Development',
  'Frontend Engineering',
  'Backend Systems',
  'System Analysis',
  'Project Leadership',
  'UI Implementation',
]
