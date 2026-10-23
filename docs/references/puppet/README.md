# Referencias visuales y bibliografía del Puppet Generator

Estas referencias documentan **photographic cut-out puppet animation / Nutcracker Jaw / jaw flap**. NO describen talking-head AI o 3D face rig. Las fotografías enviadas por el usuario son la dirección visual principal.

## Capturas originales aportadas por usuario
- **REF-U01:** primer plano de retrato masculino con barba blanca. Línea de separación bajo bigote. Debe inspirar la frontera del recorte, sin que la línea negra quede visible como cicatriz.
- **REF-U02:** fotografía de boca y barba oscura con selección del área de mandíbula removida; hueco negro rectangular. Es solo un ejemplo de EDICIÓN, no del aspecto final animado.
- **REF-U03:** misma fotografía que U02, área de mandíbula/labio inferior seleccionada; demuestra que se recorta una pieza de labios + mentón, no una mandíbula esquemática.
- Archivos: `REF-U01-retrato-linea-boca.png`, `REF-U02-area-boca-vaciada.png`, `REF-U03-zona-mandibula-seleccionada.png` (archivos PNG originales, preservados sin modificación).

### Qué copiar
Separación fotográfica de la zona inferior del labio y mentón, contorno manual con ajustes para barbas y bigotes, foto esencialmente estática con parte inferior que baja como cascanueces, estética intencionalmente artesanal / poco fluida.

### Qué NO copiar
Rectángulos negros, bordes punteados de Photoshop, líneas negras visibles como una herida, siluetas duplicadas de mentón, fluidez tipo deepfake o modificar todo el rostro.

## Fuentes conceptuales
- https://lbmslab.org/lab/after-effects-and-photoshop-project-puppet-mouth/ — separar mandíbula de una foto.
- https://www.animationguides.com/transforming-photo-into-character-animator-puppet/ — capas de ojos y cejas, pestañeos y bocas a partir de fotos.
- https://helpx.adobe.com/adobe-character-animator/desktop/behaviors/learn-more-about-behaviors/body-directly-controlled.html — comportamiento documentado `Nutcracker Jaw`.
- https://helpx.adobe.com/adobe-character-animator/desktop/creating-and-controlling-puppets/prepare-artwork.html — organización de capas.
- https://manual.reallusion.com/Cartoon-Animator/Content/Resources/ENU/08_Animation/Facial_Puppeteering/The_Face_Keys_and_Sprite_Based_Head.htm — sprite swapping de ojos.
- https://motionographer.com/2011/08/15/terry-gilliams-cutout-animation-tutorial/ — estética histórica de recortes.
- https://electropuppet.com/downloads/la-catrina/ — ejemplo de combinación jaw / blink / eyebrows (ilustrado, no fotográfico).

## Bibliografía API browser
- https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance

**Estas tres capturas no contienen animación de ojos ni cejas.** La implementación actual requiere guardar sus regiones/anclajes; la animación facial adicional se hará luego con edición geométrica y de píxeles, siempre sin IA.
