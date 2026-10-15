# Historical Bar

A frontend for creating historical characters and meeting them in a quiet, rustic western bar.

**Current milestone: 0 — bootstrap and context handoff.** The project has three navigable placeholder pages. Character creation, persistence, the puppet modal, the bar scene, chat and voice are not implemented yet. Backend, LLM and RAG integration are outside the current scope.

## Getting started

Use Node.js 20.9 or newer and npm 10 or newer. Bootstrap was verified with Node.js 24.13.1 and npm 11.8.0.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, API keys, external services or remote fonts are needed.

The app was initialized directly in this repository using [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) version 16.4.1 with App Router, TypeScript, Tailwind, ESLint, npm, `src/` and `@/*`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint with no warnings allowed |
| `npm run typecheck` | Generate Next.js route types and check strict TypeScript |
| `npm run build` | Create the production build |
| `npm start` | Serve the production build locally after building |

`typecheck` generates its route types first so it also works on a fresh checkout before a build. Keep `package-lock.json` committed; use `npm ci` for repeatable installs.

## Routes

| Route | Current behavior |
| --- | --- |
| `/` | Main menu; new-character link, disabled continue action and sample-room link |
| `/characters/new` | Creator placeholder; links to the sample room |
| `/chat/[characterId]` | Room placeholder displaying the requested identifier; links back to creation |

Use `/chat/demo` to explore navigation. This sample identifier does not represent a saved character; any identifier currently shows a placeholder. Detailed styling and full screen behavior belong to the next milestones.

## Project structure

```text
AGENTS.md
README.md
docs/
  development/
    context-import.md
    frontend-guidelines.md
    frontend-implementation-plan.md
  features/
    main-menu.md
    character-creation.md
    conversation-room.md
  project/
    vision.md
  references/bar-scene/
    README.md
    example-01-cinematic-bar/  (6 PNG references)
    example-02-rustic-bar/     (6 JPEG references; primary)
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    characters/new/page.tsx
    chat/[characterId]/page.tsx
  components/ui/
    page-shell.tsx
  features/
    characters/new-character-placeholder.tsx
    chat/conversation-placeholder.tsx
.gitignore
eslint.config.mjs
next.config.ts
next-env.d.ts                (generated and ignored)
package.json
package-lock.json
tsconfig.json
```

Create `features/puppet/`, `lib/`, `types/` or `public/assets/` when they have actual contents and consumers. The puppet editor will be a **modal inside character creation**, not another route.

## Dependencies

Runtime dependencies: **Next.js 16.4.1**, **React 19.3.0** and **React DOM 19.3.0**.

| Development dependency | Installed version at bootstrap |
| --- | --- |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| `@tailwindcss/turbopack` | 4.3.3 |
| ESLint | 9.39.5 |
| `eslint-config-next` | 16.4.1 |
| `@types/node` | 20.19.43 |
| `@types/react` | 19.3.0 |
| `@types/react-dom` | 19.3.0 |

Exact versions are recorded in `package-lock.json`. Strict TypeScript, the Next.js ESLint rules and the `@/*` → `src/*` alias are configured.

The generated template uses the official Tailwind Turbopack integration in `next.config.ts`; no separate PostCSS configuration is needed. Optional component caching and partial prefetching were left disabled to keep bootstrap simple.

## Project context and assets

Start with [AGENTS.md](AGENTS.md). The required documents and all twelve visual references were imported from [RAG-proyect-context](https://github.com/GaloDoublier/RAG-proyect-context); see [the import record](docs/development/context-import.md) for the exact source snapshot. No required files are missing.

`example-02-rustic-bar` is the primary reference for later visual work. Example 01 is secondary for poses and actions. Keep design inspiration under `docs/references/`; put assets actually used by the app under `public/assets/`. These reference images are not prepared puppet sprites. The bootstrap uses no image assets.

## Verification and limitations

Before committing, run lint, type checking, the production build and a local navigation smoke check. Verify the menu → creator → sample room → creator flow and the return links to the menu. Check a direct request to another character identifier too.

Bootstrap verification on 2026-10-15:

| Check | Result |
| --- | --- |
| Dependency installation and lockfile synchronization | Passed |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; two static pages and one dynamic conversation route |
| `npm run dev -- --hostname 127.0.0.1` | Started successfully on port 3000 |
| Browser navigation | Menu → creator → sample room → creator → menu passed |
| Continue action without saved characters | Disabled, with explanation |
| Direct HTTP route checks | HTTP 200 for `/`, `/characters/new`, `/chat/demo` and `/chat/bootstrap-check-123` |
| Browser console | No warnings or errors captured during navigation |
| Imported context integrity | All 19 unchanged documents/reference files match source Git blob hashes |

The initial dependency audit reports five high-severity development dependency entries stemming from one [`braces` advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through the Next.js ESLint plugin. The suggested automatic fix downgrades `eslint-config-next` to 14.2.35, which does not match this project. The generated dependency versions are retained; check future upstream fixes with `npm audit`. Do not apply `npm audit fix --force` blindly. `npm audit --omit=dev` reports **zero production vulnerabilities** at bootstrap.

No automated behavior test framework is installed for these static placeholders. There is no saved data, image processing, animation, actual conversation or source ingestion. No deployment or push is part of bootstrap.

## Next implementation step

Implement **milestone 1 — visual skeleton and navigation** from the [frontend plan](docs/development/frontend-implementation-plan.md): develop the rustic main menu, basic character form with an embedded modal placeholder and the conversation scene placeholder, using example 02 as the primary reference. Keep the work frontend-only.
