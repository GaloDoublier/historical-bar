# Historical Bar — Frontend agent guide

Historical Bar is an interactive western-style bar where visitors create historical characters and converse with them. This repository implements the **Next.js frontend only**. The current milestone is **0: bootstrap and context handoff**; its three pages are navigable placeholders. Do not implement later milestones unless requested.

## Stack and structure

- Next.js App Router, React, strict TypeScript, Tailwind CSS, ESLint and npm.
- Use `src/` and the `@/*` alias. Routes belong in `src/app/`; keep route files thin.
- Feature UI belongs in `src/features/characters/` and `src/features/chat/`. Add `features/puppet/` when the editor is implemented.
- Shared visual primitives belong in `src/components/ui/`. Add `lib/`, `types/` or other layers only for an immediate need.
- Prefer Server Components; introduce client boundaries for actual browser interaction.

## Approved context

Read the [vision](docs/project/vision.md), then the specification relevant to the task:

- [Main menu](docs/features/main-menu.md)
- [Character creation](docs/features/character-creation.md)
- [Conversation room](docs/features/conversation-room.md)
- [Frontend guidelines](docs/development/frontend-guidelines.md)
- [Implementation milestones](docs/development/frontend-implementation-plan.md)
- [Visual reference guide](docs/references/bar-scene/README.md)

These files were imported from the planning repository; see [context provenance](docs/development/context-import.md). The vision discusses future products, not authorization to implement them.

## Product boundaries

- **`example-02-rustic-bar` is the primary visual reference.** Example 01 is secondary for poses/actions. Use the warm, quiet, rustic western atmosphere of example 02 when detailed design starts.
- The puppet editor is **a modal within character creation**, never a separate page or route.
- Keep reference images in `docs/references/`. Production assets, when needed, belong in `public/assets/`. Reference images are inspiration, not prepared animation sprites or production layers.
- Backend, NestJS, database/authentication, LLM integration and RAG implementation are excluded. Do not add API route handlers, credentials or environment variables for those systems.
- Local character persistence, portrait alignment, mock chat, animation and browser voice belong to later frontend milestones. Keep face, body/outfit and background conceptually separate when modeling them.
- Never report source uploads, ingestion or embeddings as completed when they are not implemented.

## Working and verification

Keep changes small, testable and runnable. Avoid speculative layers and unnecessary dependencies. Preserve existing work and implement one requested milestone at a time.

Run `npm run lint`, `npm run typecheck` and `npm run build`; start `npm run dev` and check affected navigation in a browser. Report what changed, verification results and remaining limitations. Add focused tests when behavior warrants them. Never publish or push without user authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
