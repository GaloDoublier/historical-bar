# Capturas de la PR Photo Puppet Chat

Capturas reales del navegador del 2026-10-23, después de integrar `main` (menú, commit `4222563`) en `feat/photo-puppet-chat`.

| Archivo | Pantalla |
| --- | --- |
| `01-main-menu.jpg` | Menú sin personajes guardados |
| `02-character-creator.jpg` | Formulario con retrato configurado |
| `03-puppet-editor.jpg` | Modal de regiones faciales, herramientas y preview |
| `04-conversation-room.jpg` | Sala con retrato, controles de expresión/audio y respuesta mock |
| `05-saved-characters.jpg` | Menú con selector de personajes guardados desplegado |
| `06-mobile-menu.jpg` | Menú y selector a 390 × 844 |

Escritorio: viewport de 1440 × 1000; capturas de página completa. Edge headless, servidor `next dev`, movimiento reducido. El indicador de desarrollo de Next.js aparece en las capturas.

Se usó un contexto de navegador nuevo, sin datos del usuario. El personaje «Retrato de prueba» es una fixture de revisión creada sólo en ese contexto, con una foto recortada de `docs/references/bar-scene/example-02-rustic-bar/06_listening_front.jpeg` y regiones manuales. Esta referencia sirve exclusivamente para la prueba y la documentación; no se agrega como personaje predeterminado ni asset de producción. La fixture se preparó en IndexedDB; después se verificaron edición, guardado desde el formulario, navegación y persistencia tras recargar.

Comprobaciones de esta actualización: lint, typecheck, build y 10 tests aprobados. En navegador se verificaron estado vacío, navegación al creador, carga de imagen y apertura/cancelación del modal, edición/guardado de la fixture, envío y respuesta mock, regreso al menú, selección del guardado, recarga, estado de ID inexistente y ausencia de desborde horizontal del menú a 390 px. No se registraron errores de página.

Estas capturas no verifican audio audible ni sincronización fonética. El audio de prueba es independiente del chat. La escena sigue siendo un prototipo CSS, el editor requiere guías manuales y el chat no utiliza LLM ni RAG.
