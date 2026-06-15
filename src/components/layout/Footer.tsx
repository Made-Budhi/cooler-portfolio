import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useLocalTime } from '@/hooks/useLocalTime'

export function Footer() {
  const time = useLocalTime(profile.timezone)

  return (
    <footer className="bg-night text-paper/80">
      <div className="mx-auto max-w-[1640px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Wordmark + line */}
          <div>
            <a href="#top" className="font-display text-3xl text-paper">
              Budhi<span className="text-accent">.</span>
            </a>
            <p className="mt-4 max-w-xs font-display text-lg leading-snug text-paper/60">
              {profile.taglineTop.join(' ')}
            </p>
          </div>

          {/* Sitemap */}
          <nav className="flex flex-col gap-3">
            <span className="label text-paper/40">Index</span>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="link w-fit text-paper/80 hover:text-paper">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <nav className="flex flex-col gap-3">
            <span className="label text-paper/40">Elsewhere</span>
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="link w-fit text-paper/80 hover:text-paper"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 label text-paper/45 md:flex-row md:items-center md:justify-between">
          <span>&#169; 2026 {profile.nickname}</span>
          <span className="hidden md:inline">Built with love</span>
          <span className="tabular-nums">{profile.location}</span>
        </div>
      </div>
    </footer>
  )
}
