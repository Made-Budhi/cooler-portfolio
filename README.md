# Budhi — Portfolio

An editorial, single-page portfolio for **I Made Bagus Mahatma Budhi** — software engineer.
Calm paper palette, Fraunces display type, an interactive topographic hero, and a 3D
gallery wall.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (CSS-first tokens, no config file)
- **Framer Motion** — reveals, marquees, gallery tilt
- **simplex-noise** — the hero contour field
- Fonts: **Fraunces** + **Space Mono** (Google Fonts)

## Run

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build to /dist
npm run preview  # preview the production build
```

## Architecture

Feature-oriented clean architecture — dependencies point inward
(`features` → `components` → `hooks`/`lib` → `data`/`types`):

```
src/
  app/           App shell — composition root
  data/          Content from the CV (single source of truth)
  types/         Shared domain types
  lib/           Pure logic, no React (marching-squares contours, math)
  hooks/         Reusable behavior (local time, reduced motion, scroll)
  components/
    ui/          Presentational primitives (Marquee, Reveal, Cursor, …)
    layout/      Navbar, Footer
  features/      One folder per page section
    hero/        Interactive topographic canvas
    capabilities/
    work/
    gallery/     3D project wall
    about/  experience/  skills/  contact/
  styles/        Tokens, base, bespoke CSS (hero, gallery 3D, cursor, grain)
```

### The interactive hero

`features/hero/TopographicField.tsx` evaluates a layered simplex-noise field each
frame, adds a Gaussian "hill" under the (smoothed) cursor, then traces iso-lines
through it with marching squares (`lib/contour.ts`). The innermost rings render in
accent orange, so the cursor reads as a peak bending the contours. It drifts gently
on its own and pauses when off-screen or when the user prefers reduced motion.

## Things to personalize

- **Social links** — `src/data/profile.ts` has placeholder GitHub / LinkedIn URLs.
- **Email** — currently `madebudhi15@gmail.com` (from the CV).
- **Project covers** are generated gradients; drop in real screenshots later by
  extending `features/gallery/ProjectCover.tsx`.
- **Colors / fonts** live as tokens in `src/styles/global.css` (`@theme`).
```
