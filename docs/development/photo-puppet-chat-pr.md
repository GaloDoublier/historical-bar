## Qué hace esta PR

Reemplaza los placeholders de creación y conversación por un prototipo frontend de **foto → puppet → sala de chat**. Permite configurar un retrato manualmente, guardarlo en este navegador y verlo animado en el bar.

Integra `main` después del merge del menú (#1, `4222563`), resuelve los conflictos del README y la portada, conserva video, tipografía, tablones, cursor y versión, y conecta **Cargar conversación** con IndexedDB. Actualización: `0dab6ec`.

## Funcionalidad incluida

- **Creación y edición:** nombre, foto JPEG/PNG/WebP de hasta 20 MB, preview y fuentes opcionales. Editar conserva el ID del personaje.
- **Editor modal dentro del creador:** regiones manuales de mandíbula, ambos ojos y ambas cejas; insertar/seleccionar/eliminar puntos, mano, zoom, pivote, coordenadas, deshacer/rehacer y restauración de guías. Validación antes de confirmar y preview de apertura, recorrido y expresiones.
- **Persistencia:** foto como Blob y rig en IndexedDB. El menú despliega los personajes guardados y abre su sala; explica carga, ausencia de personajes y errores de lectura. Sin personajes precargados.
- **Sala:** bar provisional en CSS, retrato Canvas, chat de texto con respuestas mock y estados escuchando/pensando/hablando. Parpadeo geométrico y cejas Neutro/Sorpresa/Enojo, con enlace para editar el personaje.
- **Audio:** muestra local o archivo del usuario, controles de reproducción y análisis Web Audio RMS con gate y attack/release para mover la mandíbula. El audio es independiente del texto mock.
- **Fuentes:** seleccionar y quitar archivos localmente; sólo se guardan metadatos y se aclara que no están procesados.

## Cómo probar

1. Ejecutar `npm ci` y `npm run dev`. Para `npm test`, usar Node 22.18+ o 24.
2. Abrir Inicio → **Nuevo personaje**, escribir un nombre y elegir un retrato frontal con boca cerrada y mentón completo.
3. En el modal, definir mandíbula, ojos y cejas. Los primeros tres puntos de mandíbula son comisura izquierda, centro bajo el labio superior y comisura derecha; continuar alrededor del mentón con al menos dos puntos más. Probar apertura/recorrido y confirmar.
4. Guardar y abrir la conversación. Enviar texto para ver la respuesta simulada; probar expresiones y **Pruebas de voz** para reproducir la muestra o cargar otro audio.
5. Volver a Inicio → **Cargar conversación**, seleccionar el personaje y recargar para comprobar persistencia. **Editar personaje** permite ajustar el mismo registro.

Ver [guía de uso, implementación y limitaciones](https://github.com/GaloDoublier/historical-bar/blob/feat/photo-puppet-chat/docs/development/puppet-prototype-delivery.md).

## Verificación de esta actualización

- `npm run lint`, `npm run typecheck` y `npm run build`: aprobados.
- `npm test`: **10/10** aprobados: RMS, gate, attack/release, dos voces, polígonos, validación de rig, historial, parpadeo y cejas. Node muestra una advertencia de detección automática de módulos en los tests, sin fallos.
- Navegador Edge con contexto aislado: estado vacío, menú → creador, carga de foto y apertura/cancelación del modal, edición y guardado de una fixture, chat mock, regreso al menú, selección del guardado, persistencia tras recargar e ID inexistente. Sin errores de página.
- Menú a **390 × 844**: sin desborde horizontal. Se revisaron visualmente las seis capturas.
- Esta actualización no verifica reproducción audible ni sincronización fonética.

## Capturas actuales

Capturas reales del servidor de desarrollo del 2026-10-23. «Retrato de prueba» es una fixture preparada en un contexto de navegador nuevo con un recorte de una referencia del repositorio y guías manuales. No usa ni modifica datos del usuario, ni se entrega como personaje predeterminado. El indicador de Next.js corresponde al modo desarrollo. [Condiciones y procedencia](https://github.com/GaloDoublier/historical-bar/blob/feat/photo-puppet-chat/docs/development/screenshots/photo-puppet-chat/README.md).

### Menú principal

![Menú principal](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/01-main-menu.jpg)

### Creación del personaje

![Creador con retrato configurado](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/02-character-creator.jpg)

### Editor modal de puppet

![Editor de regiones faciales y preview](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/03-puppet-editor.jpg)

### Sala de conversación

![Bar con retrato, controles de expresión y audio, y chat mock](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/04-conversation-room.jpg)

### Selección de personajes guardados

![Menú conectado a IndexedDB](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/05-saved-characters.jpg)

### Menú móvil

![Menú móvil a 390 píxeles](https://raw.githubusercontent.com/GaloDoublier/historical-bar/0dab6ec/docs/development/screenshots/photo-puppet-chat/06-mobile-menu.jpg)

## Limitaciones

Frontend únicamente: **sin backend, autenticación, LLM, RAG, ingestión ni embeddings**. No se procesan ni suben fuentes. Se persiste el personaje y el rig; el historial de mensajes es temporal. Los datos se limitan al navegador/origen y pueden perderse al borrar su almacenamiento.

La animación determinística exige guías manuales y puede mostrar costuras o deformaciones según la foto y el recorrido. No hay detección facial, generación con IA ni sincronización fonética. El cuerpo/vestuario procede del retrato y la sala sigue siendo CSS provisional; no hay torso intercambiable ni un sistema completo de poses.
