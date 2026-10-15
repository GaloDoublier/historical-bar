# Referencias visuales — sala de conversación

Estas referencias son **dos ejemplos alternativos de cómo podría verse la sala del bar**, no resultados separados por modelo generativo ni recursos finales del juego.

Las imágenes se guardarán bajo `docs/references/bar-scene/`, separadas de los assets reales de la aplicación.

## Ejemplo 01 — Bar cinematográfico de madera

Carpeta: `example-01-cinematic-bar/`

Se conservan únicamente las seis imágenes `05` a `10` del paquete original de diez. Las imágenes `01` a `04` se excluyen por ser iteraciones previas que no corresponden a la dirección buscada.

- `05_man_listening_western.png`: escucha frontal.
- `06_man_drinking.png`: bebe.
- `07_man_talking.png`: habla y gesticula.
- `08_man_standing_goodbye.png`: se levanta/despide.
- `09_man_thinking_about_drink.png`: piensa mirando su vaso.
- `10_man_thinking_hand_on_face.png`: piensa, mano sobre la cara.

## Ejemplo 02 — Bar rústico, con luces cálidas

Carpeta: `example-02-rustic-bar/`

Se conservan las seis imágenes del otro paquete, ahora con nombres descriptivos.

- `01_listening_hand_on_face.jpeg`: escucha apoyando la mano en el rostro.
- `02_looking_down_at_drink.jpeg`: mira la jarra.
- `03_standing_at_table.jpeg`: de pie detrás de la mesa.
- `04_talking_gesturing.jpeg`: habla gesticulando.
- `05_drinking_from_mug.jpeg`: bebe de una jarra.
- `06_listening_front.jpeg`: escucha de frente.

## Indicaciones para desarrollo

- Ambos grupos ejemplifican **una misma funcionalidad**: conversar con un personaje histórico frente a una mesa.
- Mantener la perspectiva en primera persona, la iluminación cálida y el ambiente íntimo.
- Priorizar estados idle, escuchar, pensar, hablar y beber.
- No reproducir la identidad de estos personajes como diseño obligatorio: los personajes históricos serán configurables.
- No confundir referencias fotográficas con sprites ya preparados para puppet animation.
- Las imágenes no son assets de producción; guardar referencias bajo `docs/references/`, no `public/`.

## Prioridad visual acordada (2026-10-15)

**Referencia principal y objetivo estético: `example-02-rustic-bar/`.** El usuario indicó explícitamente que esta propuesta es mucho más cercana al resultado deseado. Al diseñar la sala, **priorizar sus características por encima de `example-01`**: bar antiguo y rústico, atmósfera tranquila y acogedora, madera y mobiliario clásico, iluminación tenue y cálida con luces colgantes, cámara en primera persona con interlocutor al otro lado de una mesa. Usar también su composición, tratamiento de la ropa/cuerpo y encuadres de poses como guía.

**Referencia secundaria: `example-01-cinematic-bar/`.** Sirve para inspirarse en poses, acciones y algunos detalles de composición, pero **no** es un segundo objetivo visual de igual importancia. No promediar ni fusionar indiscriminadamente los dos estilos: si entran en conflicto, prevalece `example-02`.

El rostro de las personas fotografiadas **no** es una referencia de identidad ni debe replicarse: el rostro lo aporta/configura cada usuario y debe poder reemplazarse sobre el cuerpo/traje predefinido. Las referencias son inspiración visual; no son todavía capas ni sprites preparados para producción.
