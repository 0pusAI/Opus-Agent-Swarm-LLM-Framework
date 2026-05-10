# opus-web

The storefront for OPUS — a single-page, scroll-driven Next.js site.

For the engineering substance, see [`opus-core`](../opus-core). For the philosophy, see the [whitepaper](../docs/whitepaper.md).

---

## Develop

Requires Node 20+.

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Layout

```
src/
├── app/
│   ├── layout.tsx        ── root, fonts, metadata
│   ├── page.tsx          ── the landing page (all sections wired)
│   ├── globals.css       ── Tailwind + base styles + film grain
│   └── manifesto/page.tsx── long-form essay route
├── components/
│   ├── Sphere.tsx        ── Three.js armillary sphere (the brand mark)
│   ├── CloudCanvas.tsx   ── animated storm-cloud noise background
│   ├── Hero.tsx
│   ├── Manifesto.tsx
│   ├── BeehiveBrain.tsx
│   ├── Architecture.tsx
│   ├── TechStack.tsx
│   ├── LiveSwarm.tsx
│   ├── GreatWork.tsx
│   ├── BuildLog.tsx
│   ├── CallToAction.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── Divider.tsx
│       ├── Ornament.tsx
│       └── Button.tsx
├── lib/
│   ├── fonts.ts          ── self-hosted Cormorant, Cinzel, Inter, JetBrains
│   └── motion.ts         ── GSAP + Framer presets
└── styles/
    └── tokens.css        ── palette + spacing tokens
```

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3** with custom palette tokens (see `src/styles/tokens.css`)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`
- **GSAP + ScrollTrigger** for cinematic scroll choreography
- **Lenis** for smooth scroll
- **Framer Motion** for component-level motion

## Design notes

The hero is the centerpiece: a Three.js armillary sphere that mirrors the brand mark, with mouse parallax and scroll-driven camera moves. Mobile and `prefers-reduced-motion` users get a static SVG fallback.

Sections are separated by ornate engraved dividers. The cursor leaves a faint luminous gold trail (subtle). After the user scrolls past the hero, the sphere shrinks and migrates to a fixed top-left brand mark.

Quality bar: Lighthouse ≥ 90 / Accessibility ≥ 95, WCAG AA contrast, semantic landmarks throughout.
