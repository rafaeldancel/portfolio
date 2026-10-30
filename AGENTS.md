# AGENTS.md: Raf Dancel Portfolio

Spec for Codex. Read fully before writing code. Build phase by phase; stop after each phase so I can review the diff.

## Goal
A one-page portfolio for Rafael "Raf" Dancel, AI Developer. Live on Vercel in under a day.
It must read as a hand-crafted product, not an AI template. The frontend itself is the proof of skill.

## Stack (do not add more)
- Next.js 15 (App Router), TypeScript strict, React 19
- Tailwind CSS 4
- Framer Motion (`motion/react`)
- `next/font` for fonts. No UI kits (no shadcn, no MUI).
- Icons: Simple Icons brand SVGs (`@icons-pack/react-simple-icons`) for the stack section only. If a needed logo is missing there (e.g. AWS, pgAdmin), use the Devicon SVG for that one, inlined as a component. UI icons (arrows, copy) stay hand-drawn inline SVG.
- `cmdk` allowed for the command palette only.
- Deploy: Vercel. No backend, no chatbot, no analytics yet. Contact form sends via mailto for now. A Web3Forms provider is scaffolded but off; it turns on later only when `NEXT_PUBLIC_WEB3FORMS_KEY` is set (`.env.local`, never committed).

## Design direction: "Terminal / pipeline"
The site looks like a well-designed internal tool an AI engineer would build. Restrained, dense, precise.

### Tokens (define in `globals.css` as CSS vars, map in Tailwind theme)
- `--bg` #0D0D0B (warm near-black), `--bg-raised` #151513
- `--line` #2A2A26 (hairlines, 1px only)
- `--fg` #E9E6DD (paper), `--fg-muted` #8C897F, `--fg-dim` #55534C
- `--accent` #FFB224 (signal amber). Use it on less than 5% of the screen: active states, metric deltas, the cursor.
- `--ok` #7FB77E for "pass" states only.

### Type
- Mono (data, labels, nav, metrics): **IBM Plex Mono** 400/500
- Sans (prose, headings): **IBM Plex Sans** 400/500/600
- Scale: 12 / 14 / 16 / 20 / 28 / 44 / 72. Headings tight (-0.02em). Labels in mono, uppercase, 11px, 0.08em tracking.

### Layout
- 12-col grid, max-width 1200px, 24px gutter, 16px side padding on mobile.
- Visible structure: hairline borders between sections and inside cards, like a spreadsheet or log viewer. Corners square or 2px. No big rounded cards.
- Every section has a mono index label: `01 / EXPERIENCE`, `02 / EDUCATION`, `03 / STACK`, etc.

### Anti-"AI-generated" rules (hard rules)
- NO purple/blue gradients, glassmorphism, blurred blobs, glowing orbs, aurora backgrounds.
- NO emoji, no waving-hand "Hi, I'm…", no "passionate developer" copy.
- NO 3-column icon feature cards, no logo clouds, no progress-bar skill meters.
- NO generic fade-up on every element. Motion only where it explains something.
- NO lorem ipsum, NO invented numbers. Use only `content.ts`.
- Copy is plain and specific. Short sentences. First person.

## Page structure (single route `/`)
0. **Top bar** (sticky, 48px): `rafael.dancel` left; section links in mono center; `⌘K` hint + status dot "available" right.
1. **Hero**
   - Line 1 (mono label): `~/portfolio · 2026`
   - Name (sans, 72px desktop): `Rafael Dancel`
   - Title (under the name): rotates `Gen AI Developer` ↔ `AI Engineer` (loop, ~3s hold, vertical slide; fixed width; reduced motion = `Gen AI Developer` only) in IBM Plex Sans 300 (light), ~64–76px desktop, `--fg-muted`. Instrument Serif is no longer used: remove it from layout.tsx and the font tokens.
   - Layout: the hero fills the first screen (`min-height: calc(100svh - topbar)`), name ~120–132px desktop over 2 lines, buttons 56–60px tall, PipelineLog panel large (16–17px text) with a header bar (`job: …`) and a footer (`run 1 of 2` + switcher). Bottom of hero: mono `↓ SCROLL · 01 / EXPERIENCE` cue. Mobile: stacked, 3 buttons in one row, compact log below.
   - Subtitle (mono, muted): `Full-stack · Agentic systems · Automation`
   - No extra headline or one-liner for now.
   - Buttons: primary `Connect with Raf ↓` (scrolls to #contact) + ghost `View work` (scrolls to #work). Same button styling as before. No résumé button for now.
   - **Signature element: `<PipelineLog />`**. A bordered panel on the right (below on mobile) that plays a short log sequence once on load, line by line, like a real job run:
     ```
     [00:00] ingest   annual_report.pdf  ~500 pages
     [00:01] chunk    96k → 12k tokens / call
     [00:02] extract  6 extractors · source-cited
     [00:03] run      562s → 113s   (parallelized)
     [00:04] verify   every value quotes a source passage ✓
     ```
     Timestamps dim, verbs amber, ✓ in `--ok`. Numbers count up/down. Blinking block cursor at the end. Respects `prefers-reduced-motion` (render final state instantly).
     Loops between two runs (data in `content.ts` as `pipelineRuns`): run 1 above with header `job: equity-extract`; run 2 header `job: vestra-detect`:
     ```
     [00:00] load     vestra-y26s-m1.onnx  38 MB · WebGPU
     [00:01] warmup   first inference 1270ms → 36ms
     [00:02] detect   9 classes · live camera 8–10 fps
     [00:03] eval     mAP@.5:.95 0.468 → 0.547  (+17%)
     [00:04] verify   ONNX ↔ PyTorch parity ✓
     ```
     Play → hold 3s → 200ms clear → next run → loop. Fixed panel height. Pause when off-screen or hovered. Mono `1/2` switcher with prev/next instead of replay.
2. **01 / Experience**: styled like `git log`. Each entry: commit-hash-looking short id (derived, e.g. `a3f9c1`), date range in mono, role, company, 1 to 2 lines. Hover highlights the row with a 1px amber left rule.
3. **02 / Education**: own section after Experience, same git-log row and print-in: hash, `2021–2025`, degree, school. Not in the top-bar nav.
4. **03 / Stack**: rendered as a dependency manifest. Grouped table: `ai/llm`, `full-stack`, `cloud`, `tooling` → items as mono tokens, each with a small (14–16px) monochrome brand icon in `--fg-muted`, turning to the brand color or `--fg` on hover. Concepts without a logo (RAG, Embeddings, Structured output, LLM evaluation, OCR) get no icon, just the token. No logo cloud, no marquee. Hovering a stack item highlights the project cards below that use it (shared state via context). This cross-linking is a key frontend showcase.
5. **04 / Work**: a one-project-per-view carousel. Exactly 3 entries, order: Vestra (default, shown first), AI equity research platform, Logos. No other WPH client work.
   - Each slide shows the full project: index, title, one-line context, kind label, **one big metric** as `<MetricDelta from to unit />` (bar animates on view), the points, stack tokens, links (Vestra: live demo + model; no repo link while private). Client work shows "Under NDA: anonymized, no code or screenshots".
   - Controls: ‹ › buttons, mono `1 / 3` counter, pager dots, keyboard ←/→ when the carousel is focused, swipe/drag on touch. Slide transition: horizontal slide + fade, direction-aware.
   - URL hash per project (`#work-vestra`, `#work-a`, `#work-logos`); loading a hash opens that slide.
   - Stack ↔ Work link: hovering/focusing a stack token highlights the pager dots of the projects that use it; the current slide's matching stack tokens highlight too.
   - Small label on each: `PoC · client · team` or `personal · thesis · team` so honesty is visible.
6. **05 / Contact**: line `Based in the Philippines · UTC+8`; the three buttons moved from the hero (Email = copy + mailto, shows "copied" in mono; LinkedIn; GitHub), same styling. Message form: Name, Email, Message, Send. Terminal styling (square/2px corners, hairlines, mono labels), real `<label>`s, required + email validation, hidden honeypot field, states: idle / sending / sent ✓ / error (with mailto fallback link). No phone.
7. **Footer**: `built with Next.js · Tailwind · Framer Motion` + year.

### Global interactions
- **Command palette (⌘K / Ctrl+K, also a button on mobile)** via `cmdk`: jump to sections, open a case study, copy email, open LinkedIn, open GitHub.
- Keyboard: `g` then `w` → work, `g` then `c` → contact (optional, only if time).
- Background: faint 1px dotted grid on `--bg`. Dots near the cursor brighten toward amber in a soft ~160px radius (second dot layer revealed by a radial CSS mask; position via CSS vars updated in rAF, no React state). No blob or glow fill. Off on touch devices and with reduced motion.
- Section motion: scroll-linked and reversible (src/lib/usePrintIn.tsx). Label hairline draws on scroll, rows print in top→bottom, and fade back out when scrolling up. Smoothed with useSpring, transform/opacity/clip-path only. Reduced motion = final state.

## Content
All copy lives in `src/content.ts`, typed. Components never hard-code text.

```ts
export const profile = {
  name: "Rafael Dancel",
  short: "Raf",
  title: "AI Developer",
  location: "Cavite, Philippines",
  email: "rafaeljandancel@gmail.com",
  linkedin: "https://linkedin.com/in/rafaeldancel",
  github: "TODO", // Raf will supply
  // resume: not yet. Add a "Download résumé" button later when the PDF exists.
};

export const experience = [
  { role: "AI Developer", org: "WPH Digital Phil.", range: "Mar 2026 – Present",
    note: "Full-stack + AI solutions for Southeast Asian clients. Client work under NDA." },
  { role: "Freelance AI Developer (subcontract)", org: "Independent", range: "Mar–Jun 2025 · Dec 2025–Apr 2026",
    note: "~10 AI-driven SaaS MVPs for one client with Lovable, Replit and Claude, incl. ChristFit (camera rep counting, Spotify, Apple HealthKit, ElevenLabs voice coach)." },
];

export const stack = {
  "ai/llm": ["Amazon Bedrock", "Claude", "OpenAI", "Gemini", "RAG", "Qdrant", "Bedrock Knowledge Bases", "LLM evaluation", "YOLO"],
  "full-stack": ["JavaScript", "TypeScript", "Python", "Next.js", "React", "Tailwind", "tRPC", "Prisma", "PostgreSQL", "Supabase", "Zod", "Auth.js", "Docker"],
  "cloud": ["AWS", "Google Cloud Platform"],
  "tooling": ["Claude Code", "Codex", "Cursor", "Antigravity", "Vitest", "GitLab", "GitHub", "pgAdmin", "Figma"],
};

export const work = [
  { id: "a", kind: "PoC · client · team", title: "AI equity research platform",
    context: "Regulated financial services client",
    metric: { from: 562, to: 113, unit: "s", label: "extraction time" },
    points: [
      "6 LLM extractors pull source-cited financial data from filings up to ~500 pages; every value must quote a real source passage.",
      "Chunked RAG retrieval cut context from 96k to 12k tokens per call; 400k-token documents now process.",
      "Extraction 562s → 113s via parallelization; 173s → 13s after fixing 3 Bedrock migration bugs.",
      "Market data pipeline and financial computations end to end; segment figures reconcile exactly to audited filings.",
      "AI insight confidence 0.72–0.96 after rebuilding grounding.",
    ],
    stack: ["Next.js", "TypeScript", "tRPC", "Prisma", "PostgreSQL", "Amazon Bedrock", "Vitest"] },
  { id: "vestra", kind: "personal", title: "Vestra",
    context: "Real-time dress code detection in the browser",
    live: "https://vestra-dresscode.vercel.app",
    model: "https://huggingface.co/rafdancel/vestra-y26s",
    metric: { from: 0.468, to: 0.547, unit: "mAP@.5:.95", label: "vs YOLOv5s baseline (+17%)" },
    points: [
      "Trained YOLO26s on 15,604 images across 9 classes (Roboflow skirts set, cleaned, + dress and leggings from Fashionpedia, license-checked).",
      "mAP@.5:.95 0.468 → 0.547 (+17%) and crop-top 0.241 → 0.409 vs a YOLOv5s baseline, on a 283-image test split.",
      "Runs on-device with WebGPU via ONNX: first inference 1270 ms → 36 ms after a warm-up fix; live camera at 8–10 fps.",
      "Evaluated on 433 held-out images (283 test split + 150 real-world photos never trained on); trousers detected 6 → 43 of 54 in the real-world set.",
      "In progress: next model version targets leggings vs trousers, outerwear, and a footwear class.",
    ],
    stack: ["YOLO", "ONNX", "WebGPU", "TypeScript", "Vitest"] },
  { id: "logos", kind: "bootcamp · personal", title: "Logos", context: "RAG mentorship assistant · Hytel AI Bootcamp, Feb–Mar 2026",
    metric: null,
    points: ["Ingestion pipeline with chunking, embeddings and Firestore.", "React / TypeScript Turborepo frontend."],
    stack: ["RAG", "Embeddings", "Firestore", "React", "TypeScript"] },
];

export const education = {
  degree: "BS Computer Science, Intelligent Systems",
  school: "De La Salle University – Dasmariñas", range: "2021–2025",
};
```
Note: fix the stack lists on cards to match only what the case study notes say. Don't add tech not listed in the KT.

## File structure
```
src/
  app/ layout.tsx  page.tsx  globals.css  opengraph-image.tsx
  content.ts
  components/
    TopBar.tsx  Hero.tsx  PipelineLog.tsx
    Section.tsx            // index label + animated hairline
    ExperienceLog.tsx  StackManifest.tsx
    WorkGrid.tsx  WorkCard.tsx  WorkDetail.tsx  MetricDelta.tsx
    CommandPalette.tsx  Contact.tsx  Footer.tsx
  lib/ highlight-context.tsx   // stack ↔ project hover state
       useReducedMotion.ts
public/ favicon.svg
```

## Quality bar (acceptance)
- Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- No layout shift from fonts (`next/font`, `display: swap`). LCP is the headline text, not an image.
- Fully keyboard navigable; visible focus rings (1px amber outline, 2px offset).
- `prefers-reduced-motion`: all animations resolve to final state.
- Works at 360px width with no horizontal scroll.
- `npm run build` and `npm run lint` pass with zero warnings.
- Metadata + OG image (generated, mono text on dark, name + title).

## Git
- Never commit, push, or stage. Raf reviews the diff and commits himself.

## Build phases (stop after each; ~6 hrs total)
1. **Scaffold (30m)**: create-next-app, Tailwind 4, fonts, tokens, dotted bg, `Section` component, empty sections in `page.tsx`. This AGENTS.md already sits in the repo root: if create-next-app refuses the non-empty folder, scaffold into a temp subfolder, move everything up, and keep AGENTS.md untouched.
2. **Content + layout (45m)**: `content.ts`, TopBar, static versions of every section with real copy. No animation yet.
3. **Hero + PipelineLog (1.5h)**: the signature piece. Get timing and typography right.
4. **Experience + Stack (1h)**: git-log rows, manifest table, highlight context wiring.
5. **Work (1h)**: 3 cards, MetricDelta, expand/collapse with `layoutId`, hash routing, Esc handling.
6. **Palette + Contact (45m)**: cmdk palette, copy-email, footer.
7. **Polish + ship (45m)**: reduced motion, a11y pass, Lighthouse, OG image, deploy to Vercel.

## Things I (Raf) still need to supply
- Later: Web3Forms access key (web3forms.com, free) → `.env.local` and Vercel env, to switch the form from mailto
- Vestra repo is private: no GitHub link on the card until it's public
- Later: résumé PDF, Vestra details (placeholder card ships for now)
