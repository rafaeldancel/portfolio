# Raf Dancel Portfolio

Phase 3 hero and pipeline motion. Read `AGENTS.md` before making changes; stop after each phase for review.

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

The page uses the supplied content in `src/content.ts`: two experience entries and three work entries. The hero enters once in sequence. The pipeline reveals its lines, counts down its token and runtime figures, then verifies the result; replay restarts it. Reduced motion shows the final state immediately, including a stationary cursor. Work details remain static; expansion, stack icons and cross-highlighting, the command palette, clipboard actions, OG image, and deployment belong to later phases.

The PostCSS override patches Next.js 15's existing transitive dependency without adding a dependency or changing the framework version.
