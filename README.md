# Raf Dancel Portfolio

Phase 4 Experience and Stack. Read `AGENTS.md` before making changes; stop after each phase for review.

## Local development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `next/font` downloads the specified fonts during the first build and serves them locally afterward.

## Checks

```sh
npm run build
npm run lint
```

The page uses the supplied content in `src/content.ts`: two experience entries and three work entries, including Vestra's live app and model links. Experience rows enter once and expose keyboard focus styling. Stack tokens have verified brand icons, contrast-aware hover/focus colors, and shared highlight state; matching work entries receive `data-highlighted="true"`. Work interaction and highlight presentation remain for Phase 5.

The hero enters once in sequence. The pipeline alternates equity extraction and Vestra detection, holds each result for three seconds, then clears over 200ms. It pauses off-screen and on hover. Lines never wrap; below 1280px, only the panel scrolls horizontally. The switcher restarts either run; reduced motion displays final states without looping or counting. The command palette, clipboard actions, OG image, and deployment belong to later phases.

Stack icons use `@icons-pack/react-simple-icons`. AWS, Codex, and Antigravity use local Devicon SVGs with their source URLs and license in `src/components/icons/`. OpenAI, AWS Bedrock, Bedrock KB, Auth.js, and pgAdmin have no matching icon in either catalogue and remain text-only, along with the five concepts named in `AGENTS.md`.

The PostCSS override patches Next.js 15's existing transitive dependency without adding a dependency or changing the framework version.
