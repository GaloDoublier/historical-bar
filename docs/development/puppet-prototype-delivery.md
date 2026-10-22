# Prototipo integrado de puppet — 2026-10-21

## Cómo probarlo

Con `npm run dev`, abrir http://localhost:3000 → Nuevo personaje → nombre y foto → modal → confirmar → guardar y abrir conversación. Usar un retrato frontal limpio, con boca cerrada y mentón completo.

En mandíbula, los primeros tres puntos son comisura izquierda, centro bajo el labio superior y comisura derecha. Continuar alrededor del mentón con al menos dos puntos más. Si se insertan puntos en el borde del labio, ajustar su contador. Marcar también los dos ojos y las dos cejas con polígonos de al menos tres puntos. Se puede arrastrar, insertar, eliminar, editar coordenadas por teclado, colocar el pivote, ampliar y desplazar la vista. Probar apertura y recorrido antes de confirmar.

En el chat: reproducir muestra, pausar, buscar otro tiempo, finalizar, silenciar y cargar otro audio. El indicador muestra RMS y apertura. El texto mock es independiente de la grabación, como indica la pantalla. Enviar mensajes activa thinking; reproducir audio activa speaking. No se agregó SpeechSynthesis.

Recargar recupera el personaje; Inicio permite seleccionarlo y Editar personaje conserva su ID. Foto y rig se guardan en IndexedDB; las fuentes sólo guardan metadatos, sin subir ni procesar archivos.

## Módulos

- `features/characters`: formulario, selector de guardados y persistencia de Blob/rig en IndexedDB.
- `features/puppet`: contrato normalizado, editor modal, renderer Canvas compartido y Web Audio RMS/gate/attack-release.
- `features/chat`: recuperación del personaje, conversación simulada y composición básica del bar con CSS.
- Home: diseño preservado; sólo se conecta Continuar con los guardados.

El renderer extrae el polígono, elimina el mentón de la base mediante interpolación de píxeles vecinos, dibuja la cavidad siguiendo el borde del labio y mueve una única capa fotográfica. En reposo dibuja el original. No usa IA.

Los tres PNG originales están en `docs/references/puppet`; el WAV original está en `public/assets/audio`. Proceden de RAG-proyect-context, descargado el 2026-10-21. No se implementó código en el repositorio de documentación.

## Pruebas ejecutadas

- `npm test`: 5 pruebas aprobadas: RMS de silencio/seno/ganancia, gate, attack/release, validación de polígonos y dos voces diferentes. Requiere Node 22.18+ o 24; probado con 24.13.1.
- Muestra original: 8.44 s. Segunda voz generada localmente con Microsoft Helena Desktop: 8.14 s. Curvas distintas, valores acotados y cierre tras 2 s de silencio. Esto verifica cálculo sobre señal fuera del navegador, no reproducción audible.
- `npm run lint`, `npm run typecheck`, `npm run build`: aprobados.
- `tests/render-check.mjs`: Canvas 2D offline, 0/30/60/100 %, tres retratos y píxeles idénticos en reposo. Capturas en `test-results/` (ignorado). Requiere `CANVAS_PACKAGE` apuntando a una implementación Canvas; se usó la del runtime, sin dependencias nuevas de app.
- Navegador: home → creador, nombre y presentación del formulario, sin errores de consola observados.
- Pendiente: el control de permisos rechazó dos veces cargar archivos en localhost, incluso después de autorización explícita del usuario. No se afirma haber verificado en navegador carga, edición, persistencia/recarga, reproducción, pausa, seek o cambio de archivo. Esos manejadores están implementados, pero el flujo completo requiere comprobación manual.

## Limitaciones

La reconstrucción puede dejar costuras o texturas estiradas en barbas, perfiles y aperturas grandes. Reducir recorrido y ajustar polígonos. No elimina marcas ya impresas en las fotos de referencia. El orden de los primeros puntos del labio importa.

Ojos y cejas quedan guardados como regiones separadas, todavía sin animación. El cuerpo y vestuario provienen del retrato: no hay torso intercambiable ni poses corporales elaboradas. La escena es una composición básica de CSS. No hay backend, LLM, RAG, ingestión, generación de imágenes ni sincronización fonética. La persistencia depende del navegador/origen y se pierde al borrar sus datos.

## Correcciones del editor y animación facial — 2026-10-21

Esta actualización reemplaza la limitación anterior de ojos/cejas estáticos.

- Herramientas separadas: Insertar puntos, Mano y Seleccionar puntos. Insertar cerca de una arista coloca el vértice en ese tramo; fuera de ella agrega al contorno.
- Supr/Backspace y Eliminar seleccionado actúan sólo sobre la selección. Al seleccionar una región distinta se limpia la selección.
- Ctrl+Z deshace y Ctrl+Y (también Ctrl+Shift+Z) rehace; se guarda un paso por arrastre. Restaurar esta guía y Restaurar todas las guías son independientes y reversibles. Restaurar vacía las regiones, como en el editor anterior.
- Zoom de 1× a 6×, Ctrl+rueda centrado en el cursor, mano para desplazar y Ajustar a la vista. Los atajos de texto no se interceptan mientras se edita un campo.
- La conversación ocupa el ancho completo debajo de la escena. Los dos tercios derechos se reservan al retrato; las pruebas se agrupan en un panel lateral pequeño con audio plegable.
- Parpadeo cada 4.6 s mediante oclusión curva con piel de la misma fotografía; no se aplasta el ojo. Se puede desactivar y respeta la preferencia de movimiento reducido.
- Cejas fotográficas independientes: Neutro, Sorpresa y Enojo, con traslación/rotación alrededor del centro de cada región. Las transiciones son suaves y la reconstrucción de piel es determinística. Controles disponibles en sala y preview.
- Compatible con los rigs guardados: no se altera el esquema ni se recalibran las regiones automáticamente. Las guías deben rodear realmente ojos y cejas; las mal ubicadas animarán otra parte de la foto.

Verificación adicional: 8 tests unitarios aprobados (historial agrupado, descarte de redo, periodicidad del parpadeo y simetría de cejas), render offline con las tres expresiones y neutral exacto, lint/typecheck/build. En navegador se verificaron el personaje persistido, nueva disposición, selección de emociones, restauraciones individual/total, Ctrl+Z/Ctrl+Y, eliminación seleccionada y zoom a 6×. Las ediciones de prueba se cancelaron, preservando el rig del usuario. Ctrl+rueda está implementado con listener no pasivo; no se simuló esa combinación de rueda con la herramienta de navegador.

Límites: párpados y reparación de piel son una aproximación geométrica, con posibles costuras según la foto y el contorno. Las cejas son provisionales. No hay detección automática ni IA. Para mejores resultados usar contornos ajustados, ojos con forma almendrada y cejas sin incluir grandes zonas de frente.

### Controles y validación del editor

Barra de cinco iconos con etiquetas accesibles y tooltips. Arrastre temporal con botón central desde cualquier herramienta (sin cambiar la herramienta seleccionada); se cancela al soltar o perder la captura. Apertura manual y Recorrido aparecen inmediatamente debajo del retrato con pistas y controles de rango explícitos para Chromium/Firefox.

Confirmar permanece habilitado y enumera regiones incompletas, contornos inválidos, puntos de mentón insuficientes y recorrido inválido. Los puntos consecutivos exactamente duplicados se eliminan al confirmar sin alterar la forma; insertar sobre un punto existente ya no lo duplica.

Verificación: 10 tests, lint, typecheck y build aprobados; navegador en pestaña separada comprobó iconos accesibles, ambos sliders respondiendo al teclado y errores de confirmación. No se simuló el arrastre de botón central con la herramienta. La edición abierta del usuario no se recargó ni se guardó. Copia de sus guías visibles en test-results/editor-draft-backup.json; captura de los controles en test-results/editor-controls-update.jpg.
