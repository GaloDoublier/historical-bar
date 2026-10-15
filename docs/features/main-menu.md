# Menú principal — Historical Bar (Frontend MVP)

**Estado:** especificación funcional aceptada. La estética precisa se iterará con referencias.

## Propósito
Pantalla de entrada con identidad western / viejo oeste, bar antiguo y tranquilo, inspirada a nivel de atmósfera y UI de videojuego en Red Dead Redemption 2. Evitar copiar marca, logos o UI propietaria. Experiencia narrativa, no dashboard SaaS.

## Interfaz inicial
- Título de la aplicación y una breve invitación a comenzar.
- Fondo escénico de bar rústico, coherente con la referencia principal `docs/references/bar-scene/example-02-rustic-bar/`.
- Dos acciones visibles: **Nuevo personaje** y **Cargar personaje / Continuar conversación**.
- Si no hay personajes guardados, la segunda acción aparece deshabilitada con explicación breve.
- Ajustes generales pueden existir en el futuro; no definirlos ni construirlos ahora.

## Selector de personajes
Inspiración funcional: selección de mundos guardados de Minecraft.
- Al existir personajes, permitir abrir un selector con tarjetas/lista de personajes creados, nombre y retrato.
- Elegir uno lleva a la conversación asociada o permite iniciar una nueva si aún no tiene mensajes.
- No se requiere cuenta ni servidor para esta fase; usar persistencia local limitada para prototipado.
- El nombre es el identificador visible, pero usar un `id` estable interno distinto: permite nombres duplicados y cambiar nombres sin romper rutas ni conversaciones.

## Navegación
- `/`: inicio y menú.
- `/characters/new`: creador.
- `/characters`: selector de personajes existentes (puede ser modal en la pantalla principal si resulta mejor; no duplicar pantallas sin necesidad).
- `/chat/[characterId]`: sala de conversación.

## Criterios de aceptación
- Pantalla inicial visualmente coherente con el viejo oeste y bar rústico.
- Nuevo personaje es claramente accesible.
- Cargar personaje está inactivo sin personajes y funciona al existir al menos uno.
- Selección de un personaje existente abre su sala con la cara configurada.
- Sin autenticación ni backend.
