<!-- Reemplaza el mundo "Engineering Logbook" descartado por el usuario el 2026-08-02.
     Sincronizado contra el build el 2026-08-04: tokens, breakpoints, radios, pins y
     números de scroll son los que corre el código, medidos en navegador. -->

---
name: Matías Grande — Portfolio
description: Tipografía a escala extrema sobre hueso, restricción severa, y el scroll como argumento.
---

# Design System: Matías Grande — Portfolio

## Overview

**Creative North Star: "The Statement Page"**

Una superficie que apuesta todo a tres cosas: escala tipográfica, restricción cromática y ritmo de scroll. Sin ornamento, sin cards decorativas, sin ilustración. Lo único que grita es el tamaño del tipo, y grita porque todo lo demás está callado.

El contraste no viene de mezclar familias: viene de saltar de 170px a 13px dentro de **una sola tipografía**. Esa disciplina es la identidad. En el momento en que entra una segunda familia "para los detalles", el sistema se vuelve genérico.

La página respira en secciones de viewport completo. Cada scroll entrega una idea y nada más. La densidad alterna deliberadamente: un pasaje denso se gana el silencio del siguiente.

**Cómo se relaciona con la referencia.** El usuario pidió apegarse al lenguaje de `majd-portfolio.framer.website`: escala extrema, fondo hueso, casi monocromo, secciones de altura completa, reveals de scroll, nav flotante. Ese vocabulario se adopta. Lo que **no** se adopta es su contenido, su estructura de evidencia ni su acento: el acento acá es navy, los proyectos son dos y reales, y no hay testimonios ni blog porque no existen.

**Anti-referencia:** el portfolio de junior con nube de logos, barras de "skill al 80%", cards con sombra y grilla de proyectos rellenada con ejercicios de clase.

**Key Characteristics:**
- Una sola familia tipográfica, de 170px a 13px
- Fondo hueso cálido, tinta casi negra, navy usado con avaricia
- Secciones de `100svh`, una idea por pantalla
- Cero sombras, cero gradientes, cero ilustración decorativa
- El scroll construye convicción; no es un contenedor de secciones
- Lo que no existe no se muestra: sin testimonios, sin blog, sin métricas

## Colors

Casi monocromo. Dos neutros hacen el 95% de la superficie y el navy aparece lo suficientemente poco como para que se note cuando aparece.

### Primary
- **Navy** (`#16325C`): el acento único. Links, estado activo, la palabra que carga el peso en un titular, y el campo de la sección de contacto. Constraint fijado por el usuario.

### Neutral
- **Hueso** (`#FAF7F3`): el suelo. Blanco cálido, no crema ni beige. Ocupa casi todo.
- **Tinta** (`#111110`): texto y titulares. Casi negro, con un grano cálido apenas perceptible — nunca `#000` puro.
- **Gris Medio** (`#6B6B66`): texto secundario, etiquetas, metadatos, estados inactivos.
- **Hairline** (`#DEDAD3`): divisores de 1px entre filas y secciones. Nunca más de 1px.

### Named Rules

**The Scarcity Rule.** El navy no supera el 5% del área de ninguna pantalla, con una sola excepción: la sección de contacto, donde ocupa el campo entero. Un navy repartido en seis lugares distintos es una falla del sistema.

**La regla cuenta pantallas del sitio.** Las superficies de marca —`app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.png`— van con campo navy pleno y **no** cuentan como excepciones: no son una pantalla que alguien recorra, son una pieza cerrada de 16px o de 1200×630 que se ve fuera del sitio. Ahí el navy pleno hace un trabajo que en una pantalla no haría — separar la marca en una barra de pestañas o un feed donde casi todo es claro. Detalle en § Components → Marca de pestaña y tarjeta de link.

La tarjeta 3D de Bio **no** es una segunda excepción, aunque se lea navy: su cara frontal es una fotografía bañada en esa luz, no un campo de color. El `background-color: var(--navy)` que lleva en el CSS es piso mientras la imagen decodifica — nunca la superficie que se ve. La regla cuenta campos de color aplicados por el sistema, no la iluminación de una foto.

**The Two Neutrals Rule.** Hueso y Tinta hacen el trabajo. Si algo necesita destacarse, se resuelve con tamaño, peso o espacio antes que con color.

## Typography

**Familia única:** Schibsted Grotesk (fallback: `Helvetica Neue`, Arial, sans-serif)

**Character:** Grotesca contemporánea con un rango de peso real — llega a 900 sin deformarse y mantiene una minúscula limpia y legible a 16px. Es la decisión de identidad más importante del sistema: una sola voz, estirada hasta sus dos extremos.

### Hierarchy
- **Display** (900, `clamp(4rem, 13vw, 11rem)`, line-height 0.86, letter-spacing -0.035em): hero y titulares de sección. Ocupa el ancho completo del container. Uppercase en el hero.
- **Headline** (700, `clamp(2rem, 5vw, 4rem)`, line-height 1.0, letter-spacing -0.02em): titulares de bloque y el manifiesto.
- **Title** (600, `clamp(1.25rem, 2vw, 1.75rem)`, line-height 1.25): nombres de proyecto y filas de capacidades.
- **Body** (400, `1.0625rem`, line-height 1.55, max 66ch): cuerpo de lectura.
- **Label** (500, `0.8125rem`, letter-spacing 0.1em, uppercase): metadatos, años, etiquetas, numeración de sección.

### Named Rules

**The One Voice Rule.** Una sola familia tipográfica en todo el sitio, sin excepción. Ni mono para los datos, ni serif para los acentos. La jerarquía se construye únicamente con tamaño, peso, caso y tracking.

**The Extremes Rule.** Si un tamaño cae entre Headline y Label sin una razón concreta, la jerarquía se está diluyendo. El sistema vive en sus extremos, no en el medio.

## Layout

Container de 1440px con márgenes generosos: `clamp(24px, 5vw, 96px)`. El Display sangra hasta esos márgenes — el tipo toca los bordes, ese es el efecto.

Secciones de `100svh` mínimo, alineadas al centro vertical salvo el hero. Escala de espaciado 8 / 16 / 24 / 48 / 96 / 160.

Composición asimétrica, **con una excepción declarada: el contacto va centrado** (§ Components → "Contacto — eje centrado y una sola pantalla"). Sus filas siguen armando dos columnas de peso desigual **dentro de cada fila** —etiqueta Label a la izquierda, valor fluido a la derecha, sobre el divisor hairline, la misma silueta que las capacidades—, pero el bloque entero se apoya en el eje central de la página en vez de sangrar al margen izquierdo. La bio usa tres columnas — título + primer párrafo, tarjeta 3D, segundo párrafo — con el retrato al medio.

Breakpoints 640 / 900 / 1280. La bio arma sus tres columnas recién en 1280, no en 900: medido, a 900px de ancho la columna del segundo párrafo queda en 87px y a 1024 en 115px — un párrafo en una cinta. Abajo de 1280 colapsa a una columna y el retrato se alinea a la izquierda, al mismo eje que el texto (centrado ahí conviviría con un cuerpo de texto anclado a la izquierda: dos ejes en la misma columna). En mobile todo colapsa a una columna y el Display baja a `clamp(2.75rem, 13vw, 4rem)` sin perder el tracking negativo.

## Elevation & Depth

**Sistema plano. Cero sombras, en todo estado, incluido hover.**

La profundidad se construye con tres recursos: espacio negativo generoso, divisores hairline de 1px, y el cambio de campo hueso ↔ navy en la sección de contacto — el único evento de color **dentro de la página** (§ Colors → The Scarcity Rule; la tarjeta 3D de Bio no lo es: ahí el navy es la luz de una fotografía, no un campo aplicado, y las superficies de marca quedan fuera del recuento por la misma razón que en § Colors).

**The Flat Rule.** Ninguna `box-shadow`, ningún gradiente, ningún `backdrop-filter`. Si un elemento necesita separarse, se separa con espacio o con una hairline.

## Shapes

Radio cero en todo el sistema. Botones, imágenes, campos, contenedores: cuadrados.

Bordes hairline de 1px en Hairline, o de 1px en Tinta cuando el elemento es interactivo. Un solo peso de línea en todo el sitio.

Dos excepciones, ambas deliberadas y ambas cerradas — no se abren más:

Silueta recurrente: la **pill de navegación**, `border-radius: 999px`, fondo Tinta, texto Hueso, flotante y fija arriba. Es la forma firma del sistema.

La **tarjeta 3D de Bio** lleva `border-radius: 20px` (5% de su ancho, el valor medido en la referencia). Una fotografía con esquina viva se lee como un recorte pegado sobre la página en vez de como parte de ella; el radio la integra sin acercarla a la pill, que vive en el extremo opuesto de la escala. Es la única imagen del sitio con radio: las capturas de proyecto siguen en cero.

## Components

### Nav pill
- Fija arriba, centrada, `border-radius: 999px`, fondo Tinta, texto Hueso.
- Contiene el nombre y el toggle ES/EN. Sin menú desplegable — el sitio es una sola página.
- Se contrae levemente al scrollear. Nunca desaparece.

### Cards de proyecto
- Sin borde, sin sombra, sin radio. La imagen es la card.
- Nombre debajo de la imagen, fuera del recuadro, en Title. Año y rol en Label, Gris Medio.
- Hover: la imagen baja su opacidad levemente y el nombre pasa a Navy. Una sola propiedad por transición.

### Filas de capacidades
- Ancho completo, divisor hairline arriba. Nombre en Title a la izquierda, etiquetas en Label Gris Medio a la derecha.
- Sin íconos, sin cards, sin porcentajes.

### Links
- Subrayado de 1px con offset. Hover pasa a Navy.
- Foco visible con outline de 2px en Navy y offset de 3px. Nunca `outline: none` sin reemplazo.

### Formulario de contacto
- **No se ve como formulario.** Reusa la silueta que el sistema ya repite en capacidades y en las filas de contacto: divisor hairline arriba, etiqueta Label fija a la izquierda, valor fluido a la derecha. El `input` no lleva borde propio, ni fondo, ni radio — es el "valor" de esa fila, en Body. La única diferencia con una fila de texto aparece al hacer clic: el cursor. Esa continuidad es el punto; un campo con caja y radio sería el único objeto de UI del sitio.
- Vive dentro del campo Navy, así que su tinta es Hueso. El divisor hairline de estas filas no es el `#DEDAD3` del resto del sitio (invisible sobre navy) sino Hueso a baja opacidad. Es la misma hairline de 1px, tintada desde el fondo — nunca gris.
- **Ancho propio, acotado a la medida de lectura** (~560px), no el ancho de `.wrap`. Las hairlines del formulario terminan ahí y no en el margen: un campo de 1000px es una cinta.
- **La etiqueta va siempre al lado del campo, nunca encima** — también en mobile. Apilarlas duplica la altura de cada fila, y esta sección no tiene ese presupuesto (ver "una sola pantalla", abajo).
- El mensaje es un `textarea` de 3 líneas con la misma silueta. Sin resize libre en los dos ejes.
- **Submit:** el sistema no tiene botones sólidos y no los estrena acá. Es el borde hairline de 1px que § Shapes prescribe para lo interactivo: rectángulo de 1px en Hueso, radio 0, sin relleno, texto en Label. Hover rellena en Hueso con texto Navy — una sola propiedad, bajo 200ms, la excepción CSS de la regla de motion.
- **Estados obligatorios:** reposo, foco, enviando, enviado, error de red y error de validación por campo. El resultado del envío se anuncia con `aria-live="polite"`: sin eso, quien usa lector de pantalla envía y no se entera de nada.
- Placeholder y etiqueta ≥4.5:1 contra el Navy. El placeholder no reemplaza a la etiqueta: las dos son visibles.
- **Captcha invisible, nunca widget.** El envío exige hCaptcha (PRODUCT.md § Capabilities and Constraints), y su widget visible es una caja de marca ajena — logo, radio y paleta propios, dentro de un iframe que no se puede reestilar. En un formulario definido por la ausencia de cajas, eso sería el único objeto de UI de la página y vendría de otra marca. El modo invisible se ejecuta al pulsar Enviar y solo interrumpe ante un visitante sospechoso. El costo es una línea de aviso legal debajo del botón, que hCaptcha exige en ese modo: en Label, con los dos enlaces, es del sistema.
- **Lo que no se copia de la referencia:** su carta oscura flotante con `border-radius: 16px` y campos con radio 12. Ahí esa carta existe porque su sección es clara y el formulario necesita separarse; acá el campo Navy ya cubre la sección entera y una carta adentro sería una tercera capa sin trabajo que hacer.

### Contacto — eje centrado y una sola pantalla

Dos reglas que gobiernan la sección entera y ganan sobre la composición asimétrica del resto del sitio (decisión del usuario, 2026-08-05).

**Un solo eje, centrado.** Titular, frase, formulario, iconos y firma comparten el eje central de la página. Es la única sección del sitio que se compone así, y la excepción se sostiene sola: es el final del recorrido y su trabajo es concentrar la atención en una acción, no seguir empujando la lectura hacia la izquierda. Centrar el formulario dejando el titular sangrado al margen sería peor que cualquiera de las dos opciones puras — dos ejes peleando en la misma pantalla.

**Cabe en una pantalla, sin scroll.** El bloque completo —desde el titular hasta la firma— entra dentro de `100svh` en cualquier dispositivo. El piso de verificación es **390×745**, no 390×844: `svh` es el viewport con las barras del navegador visibles, y un iPhone 14 real deja ~745px útiles. Medir contra 844 da un falso positivo que reaparece como scroll en el teléfono.

Consecuencias que esto impone y no se negocian:
- El aire de esta sección es **más ajustado que en el resto del sitio**. Es deliberado: la respiración generosa del sistema se gana en las secciones de lectura, y esta es de acción.
- La etiqueta de cada campo va al lado, nunca encima.
- **El eje vale también dentro del formulario:** el botón y el aviso legal se centran igual que el titular y los iconos. Un botón anclado a la izquierda dentro de un bloque centrado deja el único elemento accionable fuera del eje que ordena todo lo demás. Lo que no se centra es el contenido *de cada fila* — ahí la etiqueta sigue a la izquierda del campo, que es la silueta del sistema.
- **El padding superior no puede bajar tanto como el inferior.** La nav pill es `position: fixed` y flota sobre todo: el contenido que quede por encima de su borde inferior le pasa por debajo. Medido con padding parejo de 16px, el titular arrancaba en y=41 sobre una pill que llega a 48 — tapado. La zona segura son 72px arriba.
- En pantallas de menos de 700px de alto la separación entre bloques baja a 8px. Es presupuesto vertical puro, por eso la condición es de **altura** y no de ancho: una ventana de escritorio achicada tiene el mismo problema que un teléfono chico.
- Cualquier elemento nuevo en contacto tiene que pagar su altura sacándola de otro lado. **Antes de agregar algo acá, medir.**

### Iconos de redes
- Cuatro glifos monocromos de 20px — LinkedIn, Instagram, GitHub, correo — en Hueso sobre el campo Navy. Reemplazan las tres filas de texto que ocupaban la mitad de la sección.
- Área clicable de 44×44 con radio 0 y **sin chip de fondo**. La referencia usa un chip translúcido con radio 8; acá el fondo del chip sería una superficie que el sistema no tiene y el radio, una tercera excepción a § Shapes.
- Reposo Hueso al 65%, hover Hueso pleno. Una sola propiedad, bajo 200ms. Ni escala, ni rotación, ni fondo que aparece.
- `aria-label` por icono: un `<a>` cuyo único hijo es un SVG no tiene nombre accesible, y cuatro enlaces sin nombre se anuncian como "enlace, enlace, enlace, enlace".
- Los glifos son los oficiales de simple-icons, no redibujados a mano. Un logo aproximado se nota.
- Un icono cuyo destino todavía no existe **no se renderiza**. Mejor ausente que apuntando a la home de la red.
- La dirección de correo sigue disponible en texto, en una sola línea Label junto a la firma — no en una fila con divisor. Un reclutador tiene que poder copiarla sin abrir su cliente de correo.

### Marca de pestaña y tarjeta de link
El sitio se ve fuera del sitio: en una barra de pestañas de 16px y en la previsualización de un link pegado en LinkedIn o WhatsApp. Las dos superficies usan campo Navy pleno — la excepción a *The Scarcity Rule* (§ Colors) vale acá por la misma razón que en contacto: no son una pantalla del sitio, son una sola pieza cerrada.

- **`app/icon.svg`** — la inicial en Hueso sobre Navy, sangrando a los bordes izquierdo y derecho. Es el hero comprimido (§ Layout: nombre a escala Display sangrando a los márgenes). El bloque Navy sólido es lo que la separa en una barra de pestañas donde casi todo es claro.
- El trazo es el **glifo real de Schibsted Grotesk instanciado en `wght` 900**, extraído del variable font que ya sirve `next/font`. *The One Voice Rule* (§ Typography) no admite una segunda letra de otra familia, ni siquiera dibujada a ojo en un favicon. El `viewBox` va en unidades del tipo (`0 0 1854 1854`) para que el trazo entre sin escalar; los 207 de arriba y abajo son `(1854 − 1440) / 2`.
- Las patas van **abiertas** — la izquierda nace en x=80 y baja hasta x=0. A 512px se lee; a 16px cae bajo el píxel y el borde queda al 75% de cobertura. Es el tipo, no un ajuste que haya que corregir.
- **`app/apple-icon.png`** lleva la misma M **al 80%, centrada**, no sangrada. iOS enmascara con un superelipse de ~22% de radio: con la M a sangre se come la cabeza de las dos patas. Es la única razón por la que los dos archivos no son el mismo dibujo.
- **`app/opengraph-image.png`** (1200×630) repite el hero centrado **sin estrenar ni un token**: Display (900/156px/`-0.035em`/lh 0.86) y Headline (700/60px/`-0.02em`/lh 1), que son los valores a los que resuelven esos dos `clamp()` al ancho fijo de la tarjeta. Entre los dos va una hairline — el segundo recurso de § Elevation, no un adorno de esta pieza.
- **Sin la hairline, el 700 competía con el Display** y los dos bloques se leían como una sola mancha negrita. La primera versión lo resolvió bajando la bajada a 500/44px, que arreglaba el síntoma estrenando un sexto tamaño fuera de la tabla de § Typography. Con la hairline puesta el token real aguanta solo. **No agregar una instancia tipográfica antes de probar el separador.**
- El texto es literal de `hero.name` y `hero.role` (`lib/i18n/locales/es.ts`). Como es un PNG horneado, esa correspondencia **no se mantiene sola**: si se editan esas dos claves, hay que rehacer la tarjeta o queda mintiendo. Es el único lugar del sitio donde el copy existe duplicado fuera de los diccionarios.
- **La tarjeta va solo en español** y está bien: el export estático sirve una sola URL con HTML en español en el primer pintado (el idioma se resuelve recién al hidratar, ver `LOCALE_HOLD` en `app/layout.tsx`). Un lector de OG es un servidor que nunca ejecuta ese JS, así que no hay variante en inglés que pudiera servirse aunque se construyera.
- Ninguna de las tres es generada por IA. A 16px un raster con degradado se deshace, y el degradado ya está prohibido por *The Flat Rule* (§ Elevation).
- `metadataBase` va **sin el basePath**: Next ya le antepone `/portfolio` a las rutas de imagen de metadata. Con la URL completa, `og:image` sale duplicado (`/portfolio/portfolio/…`) y la previsualización da 404 sin avisar en el build.

### Tarjeta 3D de Bio
- Reemplaza la mitad "imagen" de la bio (DESIGN.md § Layout). Dos caras con la misma foto — trasera en blanco y negro, frontal a color — que se revelan girando 180°→0° mientras la tarjeta crece al doble, pineada un viewport de scroll (§ Scroll).
- Cero sombra, igual que el resto del sistema: la profundidad la da la rotación 3D, no un recurso plano. El radio es la excepción cerrada de 20px (§ Shapes) — y va también en las caras y en las imágenes, no solo en el contenedor: el `overflow` no recorta un hijo que vive en su propio plano 3D.
- Las dos caras llevan la foto real del usuario (`public/media/matias-bw.jpg` y `matias-color.jpg`, 800×1072 — PRODUCT.md § Evidence on Hand). Cada cara conserva un `background-color` plano debajo (Tinta la trasera, Navy la frontal) como piso mientras la imagen decodifica: sin él la tarjeta giraría con un hueco transparente. Ese Navy no cuenta como excepción a The Scarcity Rule (§ Colors) — no es superficie visible.
- `backface-visibility: hidden` va también en las imágenes, no solo en las caras: la regla NO se hereda hacia los descendientes, y sin repetirla la cara frontal tapa a la trasera en todos los fotogramas.
- Con `prefers-reduced-motion`, nace en su estado final: cara a color, tamaño grande, sin rotación — nunca oculta, nunca a medio girar.

## Scroll

El scroll no es transporte entre secciones: es el argumento del sitio. Cuatro decisiones lo definen, y las cuatro salieron de **medir la referencia**, no de estimarla.

**Suavizado.** La referencia corre sobre Lenis: un golpe de rueda llega al 95% del recorrido recién a los ~690 ms. El scroll nativo llega en el mismo fotograma, y esa diferencia es la mitad de lo que hace que la página se sienta como se siente. Acá lo resuelve **ScrollSmoother** (GSAP, mismo paquete) con `smooth: 1.5`, calibrado hasta emparejar esa curva: 63% a 256 ms y 95% a 656 ms, contra 230 y 690 del original.

En táctil no se suaviza (`smoothTouch: 0`). La inercia sintética sobre un gesto de dedo se siente rota, y la referencia tampoco la aplica ahí.

**Pin del manifiesto.** La sección se clava en pantalla medio viewport mientras la frase se completa. En la referencia son 450 px sobre un viewport de 900. Sin el pin, la frase se llena *y además* sube: las dos cosas compiten y se lee como una sección que pasa, no como una frase que se termina de decir.

**Pin de la tarjeta de Bio.** El segundo y último pin del sitio (§ Components → Tarjeta 3D de Bio). Lo que se clava es la fila entera —título, tarjeta, párrafos—, no la tarjeta sola: pinear solo la tarjeta deja que el documento se lleve el texto y la foto gira sola en una pantalla vacía. Dura **1,7 viewports**, y al principio la tarjeta se queda quieta, de espaldas, mostrando el blanco y negro: sin esa pausa el giro arranca en el mismo fotograma en que se clava y la cara en blanco y negro pasa demasiado rápido para leerse — la revelación del color no significa nada si nunca se vio lo que había antes.

Esa pausa mide **353px sobre un viewport de 900**, el 39% de una pantalla, medido en navegador. La constante que la produce en el código es `0.3`, y no es el 30% que aparenta: es una posición de timeline sobre un tween de `duration: 1`, así que la fracción real del recorrido es `0.3 / 1.3`. La distinción importa cuando el mismo gesto se recrea sobre otro recorrido — abajo de 1280 hace falta `0.55` para conseguir ese mismo 39%.

La fila se clava **centrada** en el viewport, y el mismo número que la centra se aplica como padding superior de la sección. No es redundante: sin el padding el pin engancha antes de que el hero termine de salir y su CTA queda cortado arriba de la pantalla durante todo el recorrido. Con los dos, el arranque cae exacto donde el hero termina.

El **pin** solo existe a partir de 1280px, el ancho donde la bio arma sus tres columnas (§ Layout). Abajo de eso la fila de una columna mide 894px contra un viewport de 844: clavarla dejaría los párrafos fuera de pantalla durante todo el recorrido.

**El giro sí existe abajo de 1280**, sin pin. La tarjeta rota ligada al scroll mientras cruza la pantalla —entre `top 80%` y `bottom 20%` de su propio recorrido, 935px medidos en 390×844— y conserva la pausa en blanco y negro en la misma proporción: 331px sobre 844, otra vez el 39%. Lo que no se traslada, además del pin, es el crecimiento: sin el viewport entero que le da el pin, una escala comprimida en un recorrido corto se lee como un salto en vez de como un ascenso.

A media rotación el borde izquierdo de la tarjeta se separa del eje del texto. No es un defecto de alineación sino el escorzo de la perspectiva mientras la tarjeta pasa de canto; en reposo y al final los dos ejes coinciden exactamente.

Los dos pins no se coordinan a mano: cada uno mide su propio trigger contra el DOM real, y el de Bio ocurre primero en el documento — el manifiesto simplemente aparece más abajo de lo que aparecería sin él.

**Ritmo del llenado (manifiesto).** Palabra por palabra, con salto casi seco entre reposo y tinta — en la referencia, medido fotograma a fotograma, nunca hay dos palabras a medio camino.

**El reposo de las palabras sin llenar es Tinta al 10%**, el mismo valor que la referencia. El contraste entre lo ya dicho y lo que falta es casi todo el efecto; un gris sólido lo aplana. Es un estado transitorio —la frase termina entera en Tinta, y con motion reducido nace así— pero mientras dura queda muy por debajo del mínimo AA. Decisión explícita del usuario, tomada sobre una alternativa al 20% que se le ofreció.

**Con `prefers-reduced-motion` no se crea nada de esto**: ni suavizado, ni pin, ni reveals. El scroll vuelve a ser nativo y la página nace en su estado final.

## Do's and Don'ts

### Do:
- **Do** usar una sola familia tipográfica en todo el sitio (The One Voice Rule).
- **Do** dejar que el Display llegue hasta los márgenes del container.
- **Do** resolver jerarquía con tamaño, peso y espacio antes que con color.
- **Do** alternar densidad entre secciones: un pasaje denso se gana el silencio del siguiente.
- **Do** respetar `prefers-reduced-motion` en cada animación, sin excepción.
- **Do** suavizar el scroll y pinear el manifiesto mientras se llena — las dos cosas medidas contra la referencia, ver § Scroll.

### Don't:
- **Don't** agregar una segunda familia tipográfica, ni siquiera para números o metadatos.
- **Don't** usar `box-shadow`, gradientes ni `backdrop-filter`.
- **Don't** usar `border-radius` distinto de 0, salvo las dos excepciones cerradas de § Shapes: la nav pill (999px) y la tarjeta 3D de Bio (20px).
- **Don't** superar el 5% de navy por pantalla fuera de la sección de contacto.
- **Don't** construir secciones de testimonios, blog, métricas o logos de clientes: no existen y no se inventan.
- **Don't** usar nubes de logos ni barras de porcentaje de skill.
- **Don't** copiar copy, proyectos, imágenes ni estructura de evidencia de la referencia.
