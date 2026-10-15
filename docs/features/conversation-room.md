# Sala de conversación — especificación frontend (fase 1)

**Estado:** dirección de producto acordada; detalles del pipeline gráfico pendientes de prototipo.

## Objetivo y sensación

La conversación ocurre en un bar antiguo, tranquilo y rústico, con reminiscencias del lejano oeste. Cámara en primera persona: el visitante mira hacia una persona sentada al otro lado de la mesa. Iluminación cálida, atmósfera íntima, sensación de videojuego retro. Usar `docs/references/bar-scene/README.md` y sus dos ejemplos como orientación de composición, vestimenta, ambiente y acciones; no copiar necesariamente sus caras.

## Composición visual por capas

1. **Background / environment**: imagen del bar sin depender de qué personaje se seleccione. Un solo fondo predeterminado en fase 1.
2. **Body / outfit / pose**: torso, traje, brazos y manos del interlocutor. Para fase 1 hay un único conjunto visual coherente con el bar rústico; varias poses prefijadas sirven como estados expresivos.
3. **Face / head**: la identidad del personaje cambia con el retrato aportado por el usuario. No tomar los rostros de referencia como identidad obligatoria.
4. **Puppet mouth**: animación determinística de la zona bucal del rostro, superpuesta/coordinada con el retrato al hablar.
5. **Conversation UI**: caja de diálogo, input de texto y controles sobre la escena.

**Principio:** la cara debe poder reemplazarse sin obligar a rehacer fondo, cuerpo y vestuario. La implementación concreta para alinear una cara con las poses —incluidas orientación, escala, cuello, oclusión y consistencia visual— requiere validarse con un prototipo.

## Estados y cambios de pose

La ilusión de vida se consigue principalmente mediante **cambios discretos de imagen/pose**, no mediante interpolación continua de video:

- `idle`: sentado, postura neutra/escuchando.
- `thinking`: pose pensativa mientras se prepara la respuesta.
- `speaking`: postura gesticulando, boca animada mediante puppet.
- `drinking`: pose breve de beber (ambiental, opcional).
- `goodbye`: despedida/de pie (opcional).

Flujo de ejemplo: el usuario envía texto → personaje pasa a `thinking` → se obtiene la respuesta (mock en fase 1) → se muestra texto y se usa SpeechSynthesis → el personaje pasa a `speaking` y mueve su boca mientras dure la síntesis → vuelve a `idle`. No afirmar sincronización fonética exacta: en la primera fase se anima por estado `speaking`.

Evitar cambios de imagen agresivos que produzcan saltos de posición del rostro; mantener anclajes compatibles entre poses. Un crossfade sutil podría evaluarse, pero no es necesario para la intención retro de cambio discreto.

## Alcance de fase 1

- Un fondo de bar rústico.
- Un traje/cuerpo predeterminado, con poses predeterminadas.
- Una cara variable seleccionada o subida desde creación de personaje.
- Puppet de boca básico y determinístico.
- Chat con respuestas mock y SpeechSynthesis en navegador.
- Estado de `thinking` mostrado mientras se simula la preparación de respuesta.
- La interfaz puede mostrar elementos futuros solo como placeholders claramente no funcionales si aportan a la comprensión.

## Futuro, NO implementar todavía

- Selector de fondos/ambientes.
- Selector de vestuario y cuerpos predeterminados.
- Posible generación personalizada de vestimenta/cuerpo asociada al personaje.
- Biblioteca de packs de poses y ambientes.
- Respuestas de LLM y posterior RAG.

Conservar en el modelo de frontend la **distinción conceptual** entre `face`, `outfit/body` y `background`, pero evitar crear un sistema extensible de assets, generadores o APIs sin un caso inmediato.

## Criterios de aceptación del prototipo

1. Se puede cambiar la cara sin modificar manualmente el fondo ni el traje.
2. Se aprecia de inmediato la perspectiva de conversación en un bar rústico.
3. Se reconocen visualmente los estados neutro, pensando y hablando mediante poses distintas.
4. La boca del rostro se anima durante la reproducción de voz y deja de moverse al terminar.
5. La escena funciona con datos simulados, sin backend ni RAG.
6. Las imágenes de referencia no se tratan como sprites finales; puede ser necesario producir assets compatibles y con capas separadas.

## Pendientes técnicos acotados

- Cómo extraer/recortar y montar el rostro sin bordes notorios.
- Qué assets base (fondo, poses de cuerpo sin cara) producir para que todas las poses tengan anclajes compatibles.
- Diseño responsive de la composición escena/chat.

## Jerarquía de referencias visuales (confirmada 2026-10-15)

La referencia **principal** para la apariencia de la sala es `docs/references/bar-scene/example-02-rustic-bar/`. Acercarse todo lo posible a su ambiente rústico, cálido, tranquilo y antiguo, sus materiales, iluminación, encuadre y tratamiento visual de cuerpo/traje. `example-01-cinematic-bar/` es solo referencia **secundaria** para poses y acciones. Cuando haya diferencias entre ambas, prevalece el estilo del ejemplo 02. No promediar ambas estéticas. La identidad facial en las referencias no debe copiarse, porque el retrato facial se sustituye para cada personaje. Ver `docs/references/bar-scene/README.md`.
