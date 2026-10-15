# Implementation plan — Historical Bar frontend (A1)

**Status:** ready to start implementation. This plan deliberately avoids backend/RAG decisions.

## Milestone 0 — Bootstrap and context handoff
1. Create **a separate implementation repository** for Historical Bar, following ADR-002.
2. Scaffold Next.js with TypeScript, Tailwind, App Router, `src/` and ESLint.
3. Copy the minimal context documents and bar reference images alongside the code; adapt `AGENTS.md` to that repo. Do not copy the whole RAG planning context into every coding task.
4. Verify `npm run dev` and initial commit.

## Milestone 1 — Visual skeleton and navigation
- Western/rustic entry page with title, New Character and Load Character.
- Load Character disabled with no saved characters; later shows a picker.
- Character creation page with basic form and modal placeholder.
- Conversation page with environment placeholder.
- Cohesive styling primarily derived from **example-02-rustic-bar**.
**Done:** navigate between all three pages; no backend needed.

## Milestone 2 — Character creation and local save
- Name, portrait upload, sources file list.
- Puppet **modal** inside creation (pan/zoom, adjustable facial guides and preview).
- Save portrait/alignment data and character; list and reopen created characters.
- Sources marked not processed; never report fake embeddings.
**Done:** create, save, load a character locally with aligned portrait.

## Milestone 3 — Composited character and pose states
- One rustic bar background; one preset body/outfit.
- Compositing supports swapping user-selected face.
- Static state images for idle/thinking/speaking; optional drink/goodbye.
- Mouth puppet animation while speaking (approximate, not phoneme sync).
**Done:** one configured face persists across principal poses without disruptive visual jumps.

## Milestone 4 — Mock chat and browser voice
- Message list and text input.
- Mock response flow: idle → thinking → speaking → idle.
- Browser SpeechSynthesis with graceful failures/availability differences.
**Done:** interactive conversation demo with text, voice and pose/mouth behavior.

## Not part of A1
Accounts, hosted character storage, backend NestJS, PostgreSQL/Prisma, streaming LLM, secure API key management, RAG ingestion/embeddings, backgrounds/outfits picker.

## Suggested first Codex request
Read `AGENTS.md`, `docs/features/main-menu.md`, `docs/features/character-creation.md`, `docs/features/conversation-room.md`, and the visual reference README. Implement only **Milestone 1**. Preserve the existing Next.js setup; build three navigable screens, with the editor as a modal placeholder inside character creation. Take example-02 as primary aesthetic reference and avoid backend integrations. Run available checks and report results.
