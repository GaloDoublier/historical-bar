# Historical Bar

A frontend for creating historical characters and meeting them in a quiet, rustic western bar.

**Current iteration: integrated photo-puppet prototype with the rustic main menu.** Create and edit characters, align facial regions in an embedded modal, save portraits and rigs in IndexedDB, and open a local mock conversation with audio-driven jaw movement, blinking and eyebrow expressions. The merged menu keeps its video, typography, assets and cursor; Cargar conversación opens the saved-character list. See [prototype usage, verification and limitations](docs/development/puppet-prototype-delivery.md). Backend, LLM and RAG remain excluded.

## Getting started

Use Node.js 20.9 or newer and npm 10 or newer. Bootstrap was verified with Node.js 24.13.1 and npm 11.8.0.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, API keys, external services or remote fonts are needed.

The app was initialized directly in this repository using [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) version 16.4.1 with App Router, TypeScript, Tailwind, ESLint, npm, `src/` and `@/*`.

## Commands

The menu displays the version from `package.json`, starting at **1.0.0**. Keep its root version synchronized with `package-lock.json` when changing releases.

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
| `/` | Rustic video menu with new-character navigation and a collapsible saved-character list; empty/loading/error states explain unavailable loading |
| `/characters/new` | Character form with portrait upload, embedded puppet editor, optional source metadata and local saving; `?edit=id` edits an existing character |
| `/chat/[characterId]` | Saved portrait in the bar, mock messages, facial expressions and audio tests; missing identifiers offer character creation |

The menu has exactly two primary actions. Loading becomes available when characters exist in this browser. `/chat/demo` and unknown IDs show an invitation to create a character; no sample character is seeded.

## Project structure

```text
AGENTS.md
README.md
docs/
  development/
    context-import.md
    frontend-guidelines.md
    frontend-implementation-plan.md
    main-menu-assets.md
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
public/assets/
  favicon.svg                (local western monogram)
  fonts/                     (Rye font and SIL Open Font License)
  main-menu/night-bar.webp    (dim nocturnal menu background)
  main-menu/wooden-plank.webp (transparent physical plank cutout)
  main-menu/worn-ink.svg      (distressed lettering mask)
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
    characters/main-menu.tsx
    characters/main-menu.module.css
    characters/load-character-button.tsx
    characters/character-form.tsx
    characters/storage.ts
    chat/conversation-room.tsx
    puppet/                    (editor, renderer, rig, expressions and audio)
.gitignore
eslint.config.mjs
next.config.ts
next-env.d.ts                (generated and ignored)
package.json
package-lock.json
tsconfig.json
```

The puppet editor is a **modal inside character creation**, not another route.

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

The project uses the official Tailwind Turbopack integration in `next.config.ts`; no separate PostCSS configuration is needed. Its loader targets `globals.css` so CSS Modules retain their scoped class exports. Menu-specific styles live in a CSS Module; other screens keep their existing Tailwind styles. Optional component caching and partial prefetching were left disabled to keep bootstrap simple.

## Project context and assets

Start with [AGENTS.md](AGENTS.md). The required documents and all twelve visual references were imported from [RAG-proyect-context](https://github.com/GaloDoublier/RAG-proyect-context); see [the import record](docs/development/context-import.md) for the exact source snapshot. No required files are missing.

`example-02-rustic-bar` is the primary reference: warm hanging lanterns, aged wood and a quiet table. Example 01 is secondary for poses and actions. The menu uses an original generated background, not a copied reference photo. Production assets live under `public/assets/`; design references stay under `docs/references/`. These images are not prepared puppet sprites. See [menu asset provenance and generation prompt](docs/development/main-menu-assets.md). All assets and fonts are served locally.

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

The tables above record historical bootstrap checks. Current prototype tests run with `npm test` (Node 22.18+ or 24); see the prototype delivery notes for verification and limitations. There is no backend, LLM, RAG or source ingestion.

Main-menu verification on 2026-10-15:

- `npm run lint`, `npm run typecheck` and `npm run build` pass.
- Browser checks cover the unavailable load action, its initially hidden explanation, hover/focus/click/Enter/Space/touch activation, Escape/blur dismissal, and menu → creator → sample room → menu navigation.
- Responsive checks cover 320px, 390px, 768px, 844px and 1920px widths, with no horizontal overflow; desktop and mobile screenshots were visually inspected.
- Reduced-motion preferences disable plank transitions and scaling. Hover/focus gently enlarges each plank; holding a press gives a smaller, lowered response until release. A single western arrow cursor is used everywhere, including links and buttons; it has no star pointer variant. These states and the version display were checked in the browser.
- The menu remains a Server Component; a small client component handles the load explanation. The load control uses `aria-disabled` so it remains focusable and can explain its unavailable state without navigating.
- The initial menu was checked in development and production, including new-character navigation without JavaScript. The revised menu passes development browser checks with no console warnings or errors; showing the explanation requires JavaScript.

## Current scope

This PR integrates the existing menu and photo-puppet prototype. Further milestones require a separate request. Character data stays in this browser; source files retain metadata only, audio is independent from mock text, and skin reconstruction can show seams. See [prototype delivery notes](docs/development/puppet-prototype-delivery.md).
