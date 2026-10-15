# Creación de personaje — Historical Bar (Frontend MVP)

**Estado:** especificación funcional acordada; algoritmo exacto de puppet pendiente de prueba.

## Objetivo
Permitir crear un personaje histórico mediante **nombre, fotografía del rostro y fuentes bibliográficas**. Evitar formularios extensos y configuraciones innecesarias. Una vez creado, puede seleccionarse desde el menú inicial o entrar directamente a la sala de conversación.

## Flujo
1. Desde inicio: **Nuevo personaje**.
2. Escribir **nombre** (etiqueta/identidad visible).
3. **Cargar imagen del rostro**; se abre un editor de alineación tipo modal.
4. Dentro de **ese mismo modal**, alinear rostro, ajustar guías y probar preview del puppet; confirmar y regresar al formulario de creación.
5. **Adjuntar fuentes** (archivos visibles en una lista).
6. **Iniciar conversación** cuando los datos mínimos de frontend estén preparados; navegar a `/chat/[characterId]`.

No introducir campos de personalidad/prompts en el MVP inicial; pueden reconsiderarse en otra iteración. Tampoco exigir elección de fondo o traje.

## Editor del rostro / puppet (modal integrado)

**No es una pantalla, ruta ni paso independiente de navegación.** Es una herramienta modal integrada dentro de la pantalla **Crear personaje** y ligada al campo **Imagen / Editor de personaje**. Su complejidad técnica interna no debe trasladarse a la navegación principal. Al guardar o cerrar, se vuelve al mismo formulario sin perder el nombre ni los archivos seleccionados.

- Abrir modal inmediatamente después de subir la imagen; poder reabrirlo.
- Imagen con zoom, desplazamiento y opcionalmente rotación si el prototipo lo justifica.
- Plantilla facial superpuesta con guías para **ojos, cejas y boca**. El usuario debe poder alinear la imagen con la plantilla y ajustar las guías para distintas proporciones de rostro.
- Procurar una plantilla lo más general posible; no afirmar compatibilidad perfecta con toda fotografía.
- Incluir controles para restaurar y confirmar.
- Persistir imagen preparada y parámetros de alineación (incluidas coordenadas normalizadas / anclajes) para render y puppet posterior.
- Vista previa de boca en reposo / hablando antes de terminar.
- Usar transformaciones y Canvas / tecnología web cuando sea útil; el recorte exacto y la integración del rostro con distintas poses se validarán mediante prototipo.
- No usar IA de reconocimiento facial ni generación de imágenes para la primera versión.

## Fuentes
- Permitir elegir archivos y mostrar nombre/tamaño y opción de remover.
- **Fase frontend:** selección/adjuntos simulados sin embeddings ni subida a servidor. Mensaje transparente: «Los archivos se incorporarán al habilitar el procesamiento de fuentes»; no mostrar «procesado» falsamente.
- La futura versión con RAG indicará estado real de ingestión (pendiente / procesando / listo / error), bloqueará «Iniciar conversación» durante un procesamiento obligatorio y habilitará el inicio al completarse. No simular procesamiento como éxito real.
- Dado que el usuario quiere probar ya la conversación sin RAG, **las fuentes son opcionales en el MVP de frontend**; el backend futuro definirá formatos, cantidad máxima y límites de tamaño.
- No prometer que los archivos quedarán disponibles permanentemente con solo LocalStorage; para esta fase guardar metadatos locales y comunicar la limitación.

## Personalización futura — no construir
- Elegir fondo predeterminado.
- Elegir traje/cuerpo predeterminado.
- Opcionalmente generar un traje/cuerpo a partir del personaje.
- Reprocesar bibliografía con RAG y mostrar progreso real.
- Mantener la separación conceptual de `face`, `body/outfit`, `background`.

## Datos y persistencia para el prototipo
```ts
type Character = {
  id: string; // identidad técnica estable (UUID)
  name: string; // identificador legible
  portrait: { imageRef: string; alignment: FaceAlignment };
  backgroundId: string; // valor predeterminado en MVP
  outfitId: string; // valor predeterminado en MVP
  sources: Array<{ name: string; size: number; type: string; status: "not-processed" }>;
  createdAt: string;
};
```
Usar almacenamiento local apropiado para imágenes (por ejemplo IndexedDB) o una estrategia ligera de prototipo; no introducir backend ahora. `FaceAlignment` debe definir coordenadas y escalas reutilizables. Evitar guardar imágenes grandes como strings en localStorage.

## Errores y accesibilidad
- Validar nombre no vacío e imagen legible.
- Manejar cancelación de carga, archivos corruptos e imágenes excesivas.
- Modal con controles accesibles por teclado, cierre/cancelación, confirmación explícita.
- Responsive: editor utilizable en escritorio y móviles.

## Criterios de aceptación
- Crear personaje con nombre y foto, ajustar rostro en modal y confirmar.
- Guardar el personaje localmente y volver a seleccionarlo desde el menú.
- Agregar o quitar adjuntos como preparación visual sin afirmar procesamiento de RAG.
- Abrir la sala con la cara elegida sobre el traje y fondo únicos del MVP.
- No implementar LLM, NestJS, Prisma ni RAG.
