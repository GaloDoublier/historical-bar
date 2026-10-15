# Frontend implementation guidelines — Phase A1

## Stack and ownership
- Next.js App Router, React, TypeScript, Tailwind CSS. Add other dependencies only when they solve a concrete need.
- The frontend owns routing, UI, Canvas/image alignment, puppet animation, browser TTS and client interaction.
- Future app business logic belongs to NestJS; do **not** build a second backend in Next.js route handlers during phase A1.

## App route sketch
- `/`: main menu (new character / load character; latter disabled when no saved characters).
- `/characters/new`: character form (name, portrait + embedded puppet editor modal, file attachments).
- `/chat/[characterId]`: conversation room (western bar scene, pose states, text chat).
- Saved-character picker may be an overlay on `/` rather than a new route.

## Suggested small feature boundaries
- `features/characters`: form, saved characters, portrait metadata, local persistence adapter.
- `features/puppet`: face alignment guides, edit modal, preview and mouth animation.
- `features/chat`: UI, mock reply adapter, character pose state machine, browser speech adapter.
- `components/ui`: shared visual primitives.

These are guidelines, not a requirement for excessive directories or layers.

## Modeling guidelines
- The display name identifies the character to a human. Use a stable ID for routing/storage.
- Keep face, outfit/body and background separately identifiable in the model; **do not implement selectors** for outfit/background yet.
- Keep pose asset coordinates/anchors consistent where possible to avoid face jumps between static frames.
- Mock chat is replaceable. Treat `thinking`, `speaking`, `idle`, and optionally `drinking`/`goodbye` as explicit UI states.
- Browser TTS is variable by browser; provide a non-speech fallback.
- Persist reasonable prototype data locally; do not put full-size images in localStorage. IndexedDB can be used for images if necessary.

## UX / design
- Favor the atmosphere, light, furniture, composition and outfit of `docs/references/bar-scene/example-02-rustic-bar/` above example-01. The faces are **not** identity assets.
- Main menu should feel like a western video game (Minecraft-like saved-character selection as functional inspiration), not a conventional admin dashboard.
- Mobile/responsive behavior, accessible form/modal focus, clear error states.
- For sources: select/list/remove files locally; label them **not processed** rather than showing fake upload or embedding success.

## Definition of done for each milestone
- Local dev server runs.
- Routing and state changes work in the browser.
- Lint and type checking pass, when configured.
- A brief report explains implementation and known gaps.
