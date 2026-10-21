# Main menu assets

The menu follows the warm light, worn timber and quiet first-person atmosphere of `example-02-rustic-bar`. Reference photographs remain in `docs/references/` and are not shipped as production assets. The scene intentionally has an empty chair, with no fixed character identity.

The revised layout contains the title, subtitle, two action labels and a small version number at the bottom. It has no decorative frames, dividers, header or footer. The background is a dim nocturnal bar rendered at 52% opacity. Buttons are isolated physical planks with transparent, chipped silhouettes, rather than rectangles filled with a wood texture. `public/assets/main-menu/worn-ink.svg` supplies a restrained procedural alpha mask for aged title and button lettering; it leaves the underlying accessible text intact.

## Interaction details

- `public/assets/cursors/western-arrow.png` is the only cursor used across body content, links and buttons. It has no sheriff star or secondary decoration, and remains unchanged while hovering or holding controls. The PNG format ensures browser cursor compatibility.
- Warm parchment and brass typography, a quieter italic subtitle and lightly worn plank lettering integrate the text with the lighting.
- Planks scale to 1.045 on hover/focus, then 1.015 while pressed, returning after release. Reduced-motion users receive no scaling or transitions.
- The small version label reads from `package.json`, initially 1.0.0.

## Current assets

- `public/assets/main-menu/Bartender_polishing_glass_in_saloon_20261015192207.mp4`: only menu background. It autoplays muted, loops, and renders directly behind the interface without a poster or static image fallback.
- `public/assets/main-menu/night-bar.webp`: 1672 × 941 pixels, WebP quality 85, 96,642 bytes. Original nighttime scene generated with the built-in imagegen tool.
- `public/assets/main-menu/wooden-plank.webp`: 2151 × 731 pixels, WebP quality 90, 402,308 bytes. Generated with the built-in imagegen tool on a transparent background. Alpha is preserved in WebP; no opaque rectangular background is applied to the controls.
- Both original PNGs remain in the generator's output directory. WebP encoding uses the existing Sharp dependency.
- The unavailable action uses a darker, slightly rotated rendering of the same plank. Its explanation and keyboard/touch behavior are unchanged.

Final nighttime background prompt:

> Use case: historical-scene. Asset type: background for Historical Bar western game menu. Original photorealistic old rustic western tavern late at night, wide 16:9 landscape. Interior from a seated guest's perspective: rough timber beams, dark wooden bar and bottles in middle distance on the right, worn table and empty chair in the lower right foreground. Only TWO small distant oil lanterns, extremely dim amber pools of light, large areas of natural deep shadow. Windows are almost black with barely visible cool midnight blue outdoors; absolutely no daylight, sunlight, bright windows or electric lights. Quiet intimate nocturnal atmosphere, walnut brown timber, subtle film grain, subdued warm highlights. Left 45 percent is a dark quiet wall with negative space for menu labels added in code. No people, lettering, logos, UI, watermark. Clearly a different bar composition from a daytime saloon. Keep architectural detail discernible in the darkness.

Final wooden plank prompt:

> Use case: product-mockup. Asset type: transparent PNG cutout of a physical wooden plank for a western game menu. ONE single long horizontal OLD WOODEN PLANK viewed straight on from the front, isolated on a genuinely TRANSPARENT alpha background. Aspect of plank roughly 5:1, occupying nearly full image width with small transparent margins. Dark honey walnut wood, authentic horizontal grain, shallow knots, weathered sun-worn patches, tiny splinters, chipped irregular upper and lower edges, asymmetrically broken jagged ends. Visible thin thickness along bottom edge, restrained warm lantern lighting from upper left. It must read as a real loose plank, NOT a rectangle with wood texture, NOT a modern rounded UI button, NOT a framed sign. Solid continuous wood face with a quiet dark medium-brown central area suitable for cream text later. No text, no lettering, no symbols, no bolts, no ropes, no nails, no extra boards, no background scene, no checkerboard painted into the image. Crisp isolated silhouette with true transparency outside all irregular edges.

## Previous background (no longer displayed)

- Asset: `public/assets/main-menu/rustic-bar.webp`.
- Created on 2026-10-15 using the built-in imagegen tool, not the API/CLI fallback.
- Original generated image: 1672 × 941 pixels; encoded as WebP at quality 85 (225,060 bytes) using the existing Sharp dependency.
- Served through `next/image` with responsive sizes, eager loading and high fetch priority. A dark base color keeps the menu legible if the image cannot load.
- The source PNG remains in the image generator's output directory; the application only needs the checked-in WebP.

Final generation prompt:

> Use case: historical-scene. Asset type: full-bleed background for the Historical Bar western narrative game main menu. Generate an original photorealistic, quietly cinematic late-19th-century rustic tavern interior, landscape 16:9, ideally 1920x1080 or larger. A worn solid dark oak table in the lower right foreground, one empty spindle-back wooden chair opposite the viewer, a small glass mug with amber drink on the table. Behind it, an old wooden bar counter with shelves of bottles, timber beams, rough plaster walls, several small hanging oil lanterns with warm amber light. Intimate, calm, welcoming and slightly dusty; earthy walnut, tobacco brown, honey brass, subtle natural film grain. Composition: seated first-person eye level; table and empty chair on the right half, bar in middle distance; left 45 percent is a quiet darker timber wall and softly lit shadow space for overlaying menu typography in code. Keep recognizable details and depth on the right. Realistic natural materials, restrained soft glow, detailed wood grain. No people, no faces, no modern objects, no lettering, no typography, no logo, no watermark, no UI. Original atmosphere inspired by a quiet rustic western bar, not a reproduction of any franchise.

## Typography

- Display font: Rye Regular, locally served with `next/font/local`.
- Asset: `public/assets/fonts/rye-regular.ttf`.
- Source: [Google Fonts Rye repository](https://github.com/google/fonts/tree/main/ofl/rye).
- License: SIL Open Font License 1.1, included at `public/assets/fonts/OFL-Rye.txt`.
- Body typography retains the project's Georgia/Times serif stack. No runtime font requests to third-party services are needed.
