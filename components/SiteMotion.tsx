"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

/* ==========================================================================
   Coreografía de scroll de "The Statement Page".

   El scroll no es transporte entre secciones: es el argumento del sitio
   (DESIGN.md § Overview). Por eso cada sección tiene su propio gesto en vez
   del mismo fade genérico repetido siete veces:

     1 Cubierta   — el Display sube desde una máscara, línea por línea.
     2 Bio        — titular en máscara, párrafos detrás; entre los dos, la
                    tarjeta 3D gira 180°→0° — el remate del efecto de
                    cubierta (DESIGN.md § Components → "Tarjeta 3D de Bio").
                    Arriba de 1280px se PINEA un viewport de scroll y crece
                    al doble; abajo, el giro sigue pero scrubbed sin pin ni
                    escala (ver el JSDoc de `choreograph` y el bloque "2
                    Bio" en el cuerpo de la función).
     3 Manifiesto — LA pieza: la frase se llena palabra por palabra ligada a
                    la posición del scroll (scrub), de gris a tinta, y la
                    frase clave aterriza en Navy.
     4 Trabajo    — las cards suben escalonadas, la captura asienta su escala.
     5 Capacidades— la hairline se dibuja de izquierda a derecha y la fila
                    entra detrás.
     6 En curso   — mismo gesto de fila.
     7 Contacto   — el campo Navy se derrama de arriba hacia abajo conforme
                    la sección entra. Es el único evento de color del sistema
                    (DESIGN.md § Elevation: el cambio de campo hueso ↔ navy es
                    uno de los tres recursos de profundidad).

   Reglas que no se negocian:
   - Scroll nativo. Nada de secuestro de rueda ni de scroll suavizado global.
   - `prefers-reduced-motion` corta TODO. Nada se oculta desde el CSS base, así
     que la rama reducida no hace nada y el contenido ya está en su estado
     final.
   - La clave especial `all: ""` en matchMedia es obligatoria: sin ella el
     callback no corre cuando NINGUNA media query matchea, y el sitio queda
     entero sin animación para quien no tiene motion reducido.
   ========================================================================== */

/** Clase que el script inline de app/layout.tsx pone en <html> antes del
 *  primer pintado. Oculta la cubierta hasta que la coreografía toma el
 *  control, para que el hero no se vea entero y después desaparezca de golpe.
 *  Si el JS nunca llega, un setTimeout en ese mismo script la saca igual. */
const HOLD_CLASS = "motion-hold";

/**
 * Parte un titular en líneas enmascaradas y las hace subir.
 *
 * El sistema usa line-height 0.86 (Display) y 1.0 (Headline): la caja de
 * línea es MÁS BAJA que los glifos, así que la máscara que agrega SplitText
 * recorta acentos y tildes ("MATÍAS"). Se compensa dándole padding a la
 * máscara y cancelándolo con un margen negativo igual — la caja de recorte
 * crece, el layout no se mueve.
 *
 * Al terminar se hace `split.revert()`: el titular vuelve a ser texto plano,
 * sin divs por línea, y recupera su reflow natural al cambiar el ancho.
 */
function revealLines(
  el: Element,
  scrollTrigger: ScrollTrigger.Vars,
): gsap.core.Tween | null {
  const split = SplitText.create(el, { type: "lines", mask: "lines" });
  if (split.lines.length === 0) return null;

  split.lines.forEach((line) => {
    const mask = line.parentElement;
    if (mask && mask !== el) {
      gsap.set(mask, {
        paddingTop: "0.18em",
        marginTop: "-0.18em",
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
      });
    }
  });

  return gsap.from(split.lines, {
    yPercent: 118,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.08,
    onComplete: () => split.revert(),
    scrollTrigger,
  });
}

/** Filas con divisor: primero se dibuja la hairline (custom property --rule,
 *  consumida por el ::before de .cap-row / .hr-row en globals.css), después
 *  entra el contenido. No se anima el border directamente porque un borde no
 *  se puede escalar. */
function revealRows(rows: HTMLElement[]) {
  if (rows.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: rows[0], start: "top 88%", once: true },
  });

  tl.from(rows, {
    "--rule": 0,
    duration: 0.55,
    ease: "power2.out",
    stagger: 0.08,
  }).from(
    rows,
    {
      autoAlpha: 0,
      y: 14,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
    },
    0.12,
  );
}

/**
 * @param animateHero  false cuando la cubierta ya se mostró por su cuenta —
 *   el fallback por timeout del script inline la destapó antes de que las
 *   fuentes estuvieran listas (red lenta). Animarla igual la haría
 *   desaparecer y volver a entrar delante de alguien que ya la estaba
 *   leyendo. El resto de la coreografía corre normal: vive abajo del
 *   pliegue y nadie la vio todavía.
 * @param pinBioCard   false debajo de los 1280px (breakpoint `lg` del
 *   proyecto, DESIGN.md § Layout): en táctil, pinear un viewport entero para
 *   un giro 3D no suma — el efecto quiere un gesto de mouse/scroll de
 *   escritorio, y en teléfono compite con la fluidez que el scroll quiere
 *   ahí (medido: `#bio .wrap` pineado mide más que el viewport en 390×844 y
 *   deja párrafos atrapados fuera de pantalla durante todo el pin). Eso NO
 *   significa que la tarjeta se quede quieta: sin pin igual gira 180°→0°
 *   ligada al scroll (scrub puro, sin spacer) mientras `.bio-card` cruza la
 *   pantalla — ver el bloque "2 Bio" más abajo, rama `else if`.
 */
function choreograph(animateHero: boolean, pinBioCard: boolean) {
  const qa = <T extends HTMLElement>(sel: string, root: ParentNode = document) =>
    gsap.utils.toArray<T>(root.querySelectorAll(sel));

  /* --- Scroll suavizado ---------------------------------------------------
     La referencia (majd-portfolio.framer.website) corre sobre Lenis, y ese
     arrastre es la mitad de lo que la hace sentirse como se siente: el scroll
     nativo llega al destino en el mismo fotograma, el suavizado lo persigue.
     Medido en la referencia: un golpe de rueda alcanza el 95% del recorrido
     recién a los ~690 ms, un lerp de ~0.07 por fotograma. Con `smooth: 1`
     esa marca caía en 450 ms — más nervioso que el original; 1.5 la deja
     encima.

     ScrollSmoother es el equivalente oficial de GSAP y viene en el mismo
     paquete, así que el motor de motion sigue siendo uno solo.

     `smoothTouch: 0` deja el scroll táctil intacto: en teléfono, arrastrar
     con inercia sintética se siente roto, y la referencia tampoco lo suaviza
     ahí. */
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    smoothTouch: 0,
    // Unifica el scroll de rueda/teclado con el suavizado en vez de dejar dos
    // sistemas peleando por la misma posición.
    normalizeScroll: true,
    ignoreMobileResize: true,
  });

  /* --- Nav pill: se contrae al scrollear, nunca desaparece ---------------
     (DESIGN.md § Components). El xPercent lo fija GSAP en vez de heredar el
     translateX(-50%) del CSS, para que al componer la escala el centrado no
     se pierda. El CSS conserva su transform como estado sin-JS. */
  const pill = document.querySelector<HTMLElement>(".nav-pill");
  if (pill) {
    gsap.set(pill, { xPercent: -50, x: 0, transformOrigin: "50% 0%" });
    gsap.to(pill, {
      scale: 0.92,
      y: -3,
      ease: "none",
      scrollTrigger: { start: 0, end: 240, scrub: 0.4 },
    });
  }

  /* --- 1 Cubierta -------------------------------------------------------
     Sin ScrollTrigger: ya está en pantalla al cargar. */
  const heroTitle = document.querySelector('[data-reveal="hero-title"]');
  const heroRole = document.querySelector('[data-reveal="hero-role"]');
  const heroCta = document.querySelector('[data-reveal="hero-cta"]');

  if (heroTitle && animateHero) {
    const split = SplitText.create(heroTitle, { type: "lines", mask: "lines" });
    split.lines.forEach((line) => {
      const mask = line.parentElement;
      if (mask && mask !== heroTitle) {
        gsap.set(mask, {
          paddingTop: "0.18em",
          marginTop: "-0.18em",
          paddingBottom: "0.12em",
          marginBottom: "-0.12em",
        });
      }
    });

    const tl = gsap.timeline({ onComplete: () => split.revert() });
    tl.from(split.lines, {
      yPercent: 118,
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
    });
    if (heroRole) {
      tl.from(heroRole, { autoAlpha: 0, y: 18, duration: 0.7, ease: "power3.out" }, "-=0.5");
    }
    if (heroCta) {
      tl.from(heroCta, { autoAlpha: 0, y: 14, duration: 0.6, ease: "power3.out" }, "-=0.45");
    }
  }

  /* --- 2 Bio: la tarjeta 3D -----------------------------------------------
     Replica el hero-card de majd-portfolio.framer.website, medido por el
     usuario en el navegador (viewport de referencia: 900px):

       rotateY   180° → 0°, lineal con el scroll.
       tamaño    ~2x — la proporción que usamos es la de la foto futura
                 (400×536, 0.746 — ver .bio-card en globals.css), no la
                 medida en la referencia (202×231 → 400×456: es otra foto).

     El borde INFERIOR de la tarjeta casi no se mueve mientras crece — está
     anclado por `bottom: 2.2vh` en globals.css, no por `top`. Por eso
     alcanza con animar `scale`: con el origen de transformación anclado
     abajo (CSS), crecer desde ahí reproduce el ascenso sin tocar `top` en
     ningún momento — layout thrash prohibido por la consigna, y acá ni
     hace falta rodearlo con `y`/`yPercent`.

     scale inicial = 25.7vh / 50.7vh: los altos relativos medidos por el
     usuario para el estado inicial y final (no los 202/231 px, que
     corresponden a la proporción de otra foto). `.bio-card-stage` mide
     exactamente ese alto final más el `bottom: 2.2vh` (globals.css), así
     que al llegar a `scale: 1` la tarjeta llena la franja de punta a punta
     — el borde superior toca el top de la fila pineada, sin sobrante
     arriba ni recorte.

     La tarjeta vive DENTRO de la grid de Bio (título / tarjeta / párrafos,
     app/page.tsx) y no en un elemento aparte: así no hace falta que
     "aterrice" en ningún lado al terminar — es, sin más, el contenido de
     Bio desde el primer render, incluso sin JS. Lo único que el scroll le
     agrega, y SOLO a partir de 1280px de ancho (`pinBioCard`, ver el JSDoc
     de `choreograph` arriba), es que se PINEA (queda fija en pantalla)
     mientras gira y crece; al soltarse ya está en su estado final y la
     página sigue scrolleando normal, sin salto que reparar. Debajo de
     1280px este `if` no corre — pinear un viewport entero para un giro 3D
     no aporta en táctil y compite con la fluidez que el scroll quiere ahí
     (medido: `#bio .wrap` pineado mide más que el viewport en 390×844 y
     deja párrafos atrapados fuera de pantalla durante todo el pin). Eso no
     significa que la tarjeta se quede quieta ahí abajo: el giro sigue
     corriendo, ligado al scroll igual que acá, en la rama `else if` más
     abajo — sin pin y sin `scale`, ver esa rama para el porqué de cada
     diferencia.

     Lo que se PINEA (en desktop) es `#bio .wrap` — la grid entera (título /
     tarjeta / párrafos), no solo `.bio-card-stage`. Título y párrafos son
     hermanos de la tarjeta dentro de esa misma grid de una sola fila
     (`items-center`, app/page.tsx): si solo se pinea la tarjeta, el resto
     de la fila sigue su lugar en el flujo normal y el documento la
     arrastra hacia arriba mientras la tarjeta se queda quieta girando —
     título y párrafos salen de pantalla antes de que la tarjeta termine su
     giro. Pineando la fila entera, título/tarjeta/párrafos quedan clavados
     juntos todo el recorrido: la composición final — foto al centro, texto
     a los lados, todo en una pantalla — es la que se ve durante TODO el
     pin, no solo en el instante en que se suelta.

     El punto de pin (`start: "top top"`) es donde `.wrap` toca el top del
     viewport en el scroll natural: `.bio-card-stage` es el miembro más alto
     de esa fila (su alto deriva del tamaño final de la tarjeta, ver arriba)
     y no tiene padding-block propio, así que su alto es también el de
     `.wrap`. Se pinea 1.7 viewports MÁS de scroll (`end`, abajo: el giro es
     el momento más largo de la página y comprimirlo en un solo viewport lo
     volvía un parpadeo) — ese spacer es lo único que gsap agrega; ningún
     alto queda hardcodeado en ningún lado. Sin este pin (motion reducido, o
     debajo de 1280px) no hay spacer y la fila nunca pasa de su alto
     natural, compacto.

     Dos pins conviven en la página en desktop (este y el del manifiesto,
     que va DESPUÉS en el documento — ver DESIGN.md § Scroll). No hace falta
     coordinarlos a mano: cada uno mide su propio trigger contra el DOM
     real, y el spacer de este ya existe cuando ScrollTrigger calcula la
     posición del otro — el manifiesto simplemente aparece más abajo de lo
     que aparecería sin este pin, automático. */
  const bioRow = document.querySelector<HTMLElement>("#bio .wrap");
  const bioCard = document.querySelector<HTMLElement>(".bio-card");
  if (pinBioCard && bioRow && bioCard) {
    // `#bio` pasa de `center` (el default de `.section`) a `flex-start`
    // para el resto de la sesión en desktop — no solo mientras el pin está
    // activo, y no se revierte al soltarlo (si el viewport cruza el
    // breakpoint hacia abajo, matchMedia sí lo revierte, como con el resto
    // de este bloque). Motivo técnico, no de diseño: DESIGN.md § Layout pide
    // centrado vertical acá, pero centrar con flexbox exige que el flexbox
    // pueda calcular sobrante de forma ESTABLE, y acá no puede. Con
    // `center`, el espacio "sobrante" que el flexbox reparte arriba/abajo de
    // `.wrap` depende del alto TOTAL de `#bio`, y ese alto cambia en el
    // instante exacto en que gsap inserta el pin-spacer — de un alto acotado
    // por el `min-height: 100svh` de `.section` (la fila de Bio, compacta,
    // no lo supera) a uno mucho mayor gobernado por el spacer (fila + rango
    // de scroll pineado). ScrollTrigger mide dónde arranca el pin ANTES de
    // insertar el spacer, con ese primer alto; la posición real después de
    // insertarlo es otra. Verificado en navegador: con `center`, la fila
    // quedaba pineada ~100px arriba del top real del viewport, empujando el
    // título fuera de pantalla por arriba — el defecto que este bloque
    // existe para evitar. `flex-start` no reparte sobrante, así que la
    // posición no depende del alto total de la sección y las dos mediciones
    // siempre coinciden. El aire visual arriba del bloque lo da
    // `bioPinTop()` (abajo, offset del pin) y no el centrado de la sección.
    const bioSection = bioRow.closest<HTMLElement>("#bio");
    if (bioSection) gsap.set(bioSection, { justifyContent: "flex-start" });
    // El centrado que `flex-start` deja de hacer lo hace `bioPinTop()` como
    // padding explícito (aplicado abajo, y en cada refresh): mismo número que
    // el offset del pin, así la fila ya está centrada ANTES de engancharlo y
    // no salta al engancharlo. Un padding fijo no tiene el problema del
    // `center`: no depende del alto total de la sección, así que el spacer no
    // lo mueve.

    // 25.7 / 50.7: alto inicial sobre alto final, en las mismas unidades
    // relativas (vh) que .bio-card en globals.css — así la proporción se
    // mantiene si ese alto cambia ahí. El ancho no hace falta calcularlo
    // aparte: `aspect-ratio` en CSS lo deriva del alto solo.
    const BIO_CARD_START_SCALE = 25.7 / 50.7;

    // Centrado horizontal fijado por fuera del tween scrubbed, igual que
    // la nav pill arriba: gsap compone xPercent/transformOrigin con el
    // rotateY/scale de abajo en una sola matriz de transform, sin pisarse.
    gsap.set(bioCard, { xPercent: -50, x: 0, transformOrigin: "50% 100%" });

    // `fromTo` y no `to`, misma razón que el manifiesto más abajo: con
    // `to`, el primer `ScrollTrigger.refresh()` (el de las capturas de
    // proyecto, al final de este archivo) puede releer el valor de arranque
    // con el scroll ya adelantado y dejar la tarjeta animando de 1 a 1.
    // El giro no arranca apenas engancha el pin: primero la tarjeta se
    // queda quieta un tramo, de espaldas, mostrando la foto en blanco y
    // negro. Sin esa pausa el giro empieza en el mismo fotograma en que la
    // tarjeta se clava y la cara en blanco y negro pasa demasiado rápido
    // para leerse — que era justamente el punto del efecto: la revelación
    // del color no significa nada si nunca se vio lo que había antes.
    //
    // En una timeline scrubbed, el tramo previo al arranque del tween no es
    // tiempo muerto: `immediateRender` del `fromTo` ya dejó la tarjeta en su
    // estado inicial al construirse, así que durante ese tramo se ve —
    // quieta y de espaldas — la cara en blanco y negro.
    const BIO_CARD_HOLD = 0.3; // proporción del recorrido antes de girar

    // La fila NO se pinea a ras del top ("top top" congelaría su borde
    // superior en el y=0 exacto del viewport, pegada contra `.nav-pill`,
    // fija ahí con `z-index: 80`). Se pinea CENTRADA verticalmente: la fila
    // mide una fracción del viewport (≈476px sobre 900), así que sin repartir
    // ese sobrante la composición queda clavada arriba con un hueco muerto
    // debajo.
    //
    // Medido en la referencia (majd-portfolio.framer.website, 1440×900): su
    // contenedor sticky mide el viewport completo y la caja de la foto vive
    // en y 424→880 dentro de él — o sea el bloque queda abajo, con el aire
    // ARRIBA, no debajo. Anclar al fondo exacto acá no traduce: la referencia
    // no tiene texto al costado de la foto en ese momento y nosotros sí
    // (título + p1 a la izquierda, p2 a la derecha, pedido explícito), así
    // que bajar la fila a 880 mandaría el título a y≈404 y abriría 400px de
    // vacío arriba. Centrar reparte el mismo sobrante en dos y deja la
    // composición equilibrada con texto de los dos lados.
    //
    // `Math.max(96, …)` es el piso: 96px (`--space-5`) es lo mínimo que
    // despeja la nav pill. Solo manda si el viewport es tan bajo que el
    // centrado daría menos que eso.
    //
    // Se recalcula en cada refresh y no una vez al construir: el alto de la
    // fila cambia con el ancho (reflow del texto) y `innerHeight` con el
    // viewport.
    const BIO_PIN_MIN_TOP = 96;
    const bioPinTop = () =>
      Math.max(
        BIO_PIN_MIN_TOP,
        Math.round((window.innerHeight - bioRow.offsetHeight) / 2),
      );

    // El mismo número va al padding superior de `#bio`, no solo al offset del
    // pin. Sin esto el pin engancha ANTES de que el hero termine de salir:
    // con `#bio` arrancando a los 900px (un viewport) y su padding base de
    // 96px, la fila vive en y=996 del documento, así que un offset de 212
    // pone el arranque del pin en 996−212 = 784 — 116px antes del borde del
    // hero, y su CTA queda cortado arriba de la pantalla durante los 1,7
    // viewports que dura el pin. Empujando la fila con el mismo offset, el
    // arranque cae exacto donde el hero termina y cada sección se lee en su
    // propia pantalla.
    const applyBioPinTop = () => {
      if (bioSection) gsap.set(bioSection, { paddingTop: bioPinTop() });
    };
    applyBioPinTop();

    const bioTl = gsap.timeline({
      scrollTrigger: {
        // El trigger (y lo que se pinea) es la fila entera, no la
        // tarjeta sola — ver comentario arriba.
        trigger: bioRow,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // Corre antes de que ScrollTrigger mida: el padding tiene que estar
        // puesto cuando lee la posición de la fila, o el arranque queda
        // calculado contra el layout viejo.
        onRefreshInit: applyBioPinTop,
        start: () => "top " + bioPinTop() + "px",
        // 1.7 viewports en vez de 1: el giro es el momento más largo de la
        // página y comprimirlo en un solo viewport lo volvía un parpadeo.
        end: () => "+=" + window.innerHeight * 1.7,
        scrub: 0.5,
      },
    });

    // `fromTo` y no `to`, misma razón que el manifiesto más abajo: con
    // `to`, el primer `ScrollTrigger.refresh()` (el de las capturas de
    // proyecto, al final de este archivo) puede releer el valor de arranque
    // con el scroll ya adelantado y dejar la tarjeta animando de 1 a 1.
    bioTl.fromTo(
      bioCard,
      { rotateY: 180, scale: BIO_CARD_START_SCALE },
      { rotateY: 0, scale: 1, ease: "none", duration: 1 },
      BIO_CARD_HOLD,
    );
  } else if (bioCard) {
    /* --- 2 Bio (mobile, sin pin): el mismo giro, ligado al scroll --------
       Debajo de 1280px `#bio .wrap` nunca se pinea (ver el `if` de arriba,
       su comentario, y el JSDoc de `choreograph`): pinear un viewport
       entero para un giro 3D no aporta en táctil y atrapa los párrafos
       fuera de pantalla. Pero eso no es motivo para que el giro desaparezca
       — pedido explícito del usuario, y sigue siendo el remate del efecto
       de cubierta acá también. La diferencia con la rama de arriba es
       nomás el mecanismo: sin pin, scrubbed contra la posición de
       `.bio-card` en la página. El documento nunca deja de scrollear; lo
       único que el scroll gobierna es la rotación.

       Trigger: `.bio-card`, no `#bio .wrap`. En desktop se pinea la FILA
       entera (no solo la tarjeta) porque, pineando solo la tarjeta, el
       resto de la fila seguiría su lugar en el flujo normal y saldría de
       pantalla antes de que el giro termine (ver el comentario de la rama
       de arriba). Acá no hay pin, así que ese riesgo no existe: toda la
       fila — título, tarjeta y párrafos — scrollea siempre junta, a la
       misma velocidad. Lo único que hay que garantizar es que el giro pase
       mientras LA TARJETA está a la vista, y atarlo a su propio trigger
       (no al de la fila, mucho más alta por el título y los dos párrafos)
       es lo que lo garantiza directamente, sin cálculos indirectos.

       Rango start/end medido en 390×844 con la página en su estado actual
       (antes de este cambio): `.bio-card` mide ahí 427.9px de alto (clamp
       de 50.7vh contra un viewport de 844) y su borde superior cae a
       1207.7px de scroll. "top 80%" → "bottom 20%" arrancan y terminan el
       giro con ~168.8px de la tarjeta ya visible en cada extremo (39% de su
       alto) — nunca menos. Con "top bottom" → "bottom top" (el rango
       completo en el que la tarjeta roza el viewport, de "recién asoma" a
       "ya se fue entera") medio giro pasaría con la tarjeta parcial o
       totalmente fuera de cuadro — exactamente el defecto que el pedido
       original señaló. Porcentajes y no píxeles fijos: se recalculan solos
       contra el viewport real en cada refresh, sin depender de este número
       puntual.

       Sin `xPercent`/`x`: en este ancho `.bio-card` va con `left: 0;
       transform: none` (globals.css, `@media (max-width: 1279px)`),
       compartiendo eje con el párrafo — no centrada como en desktop. Tocar
       x acá reintroduciría el centrado que esa media query saca a
       propósito, y rompería el borde compartido (verificado en navegador:
       coincide en 390 y en 1024). No hace falta: `rotateY` es una rotación
       pura sobre un eje vertical que pasa por `transform-origin: 50% 100%`
       (globals.css, aplica a todos los anchos) — girar alrededor de un eje
       no desplaza el eje mismo, así que el borde izquierdo mide lo mismo
       por `getBoundingClientRect` a rotateY 180 que a rotateY 0.

       Sin `scale`: a diferencia de la rama de arriba, acá no hay un
       viewport extra de pin regalando recorrido — crecer Y girar a la vez
       en ~1 viewport de scroll compiten por el mismo tramo corto y se leen
       como un salto, no como una revelación. Además el origen de
       transformación es horizontal-CENTRADO (50%, no 0%): escalar desde
       <1 movería el borde izquierdo hacia ADENTRO del borde del párrafo
       durante todo el tramo con scale<1, rompiendo justo el eje compartido
       que este bloque tiene la obligación de conservar. La tarjeta ya nace
       a su tamaño final por CSS en este ancho — a diferencia de desktop,
       acá no existe un estado "chico" fuera de JS — así que no hay nada
       que crecer.

       BIO_CARD_HOLD_MOBILE: la pausa en blanco y negro tiene que seguir
       siendo legible acá — es el punto del efecto (ver el comentario de la
       rama de arriba). Es un número de POSICIÓN dentro de una timeline con
       un solo hijo de `duration: 1`, igual que `BIO_CARD_HOLD` arriba — no
       una fracción directa del rango: como el hijo tiene duración propia,
       la timeline completa dura `BIO_CARD_HOLD_MOBILE + 1`, así que la
       fracción REAL de meseta es `BIO_CARD_HOLD_MOBILE / (BIO_CARD_HOLD_MOBILE
       + 1)`, no el número tal cual. Con eso en cuenta, copiar el 0.3 de
       desktop sería un error: ese 0.3 corre sobre un rango PINEADO de 1.7
       viewports (1530px medidos a 1440×900 — 900 · 1.7), así que su meseta
       real mide 0.3/1.3 · 1530 ≈ 353px de scroll — un 39% de un viewport
       de alto. Acá el rango entero (sin pin) mide ~934px, y ES ese rango
       el que hay que repartir entre meseta y giro, no un pin extra. Se
       iguala la meseta como fracción de UN viewport — la unidad que ya usa
       el resto del archivo ("1.7 viewports" arriba, "medio viewport" en el
       manifiesto más abajo) — y no como fracción del propio rango: mismo
       39% aplicado a 844px de viewport da ≈330px de meseta objetivo, y
       despejando `BIO_CARD_HOLD_MOBILE` de la fracción real de arriba
       (330 / (934 − 330) ≈ 0.55) da este valor. Medido en navegador con
       este valor puesto: la meseta mide ~331px en 390×844 contra ~353px en
       1440×900 — 39% del viewport en los dos casos, comparable. */
    const BIO_CARD_HOLD_MOBILE = 0.55;

    // `fromTo` y no `to`, misma razón que la rama de arriba y que el
    // manifiesto más abajo: con `to`, el primer `ScrollTrigger.refresh()`
    // (capturas de proyecto, al final de este archivo) puede releer el
    // valor de arranque con el scroll ya adelantado y dejar el giro
    // animando de 1 a 1.
    const bioTlMobile = gsap.timeline({
      scrollTrigger: {
        trigger: bioCard,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });

    bioTlMobile.fromTo(
      bioCard,
      { rotateY: 180 },
      { rotateY: 0, ease: "none", duration: 1 },
      BIO_CARD_HOLD_MOBILE,
    );
  }

  /* --- 3 Manifiesto: el momento ------------------------------------------
     Cada palabra se llena de gris a su color final ligada a la posición del
     scroll. Lo que se anima es --fill (0 → 1); el color de destino lo declara
     el CSS por palabra, así que la frase clave llega a Navy sin que el JS
     tenga que saber cuál es (DESIGN.md § Colors).

     La sección se PINEA mientras dura el llenado. Medido en la referencia: su
     manifiesto vive en un contenedor de 1350 px con un hijo pegado de 900 px
     — o sea 450 px de recorrido, medio viewport, en los que la frase queda
     clavada en pantalla y solo cambian las palabras. Sin el pin, la frase se
     llena mientras además sube, y las dos cosas compiten: se lee como una
     sección que pasa, no como una frase que se completa.

     El pin es scroll nativo — la página sigue scrolleando, solo que esta
     sección se queda quieta un tramo. No hay secuestro de la rueda. */
  const manifesto = document.querySelector<HTMLElement>("#manifesto");
  if (manifesto) {
    const words = qa('[data-reveal="word"]', manifesto);
    if (words.length > 0) {
      // El reposo se fija con un `set` aparte en vez de con `fromTo`: bajo
      // `scrub`, ScrollTrigger renderiza el tween en progreso 0, y en tiempo
      // 0 los sub-tweens escalonados todavía no arrancaron — el estado
      // inicial le llegaba SOLO a la primera palabra y las otras quince se
      // quedaban en tinta hasta que les tocaba el turno. Verificado en
      // navegador, no es teórico.
      gsap.set(words, { "--fill": 0 });

      // `fromTo` y no `to`: con `to`, el valor de arranque lo lee GSAP del
      // DOM, y el primer `ScrollTrigger.refresh()` — el que dispara la carga
      // de las capturas — lo volvía a leer con el scroll ya dentro del rango.
      // El tween quedaba animando de 1 a 1: la frase entera nacía en tinta y
      // el llenado no ocurría nunca. Declarado explícitamente, ningún refresh
      // lo puede reinterpretar.
      gsap.fromTo(
        words,
        { "--fill": 0 },
        {
          "--fill": 1,
          ease: "none",
          // Ritmo de la referencia: ahí las palabras saltan de reposo a tinta
          // una por una, sin fundido entre estados — medido fotograma a
          // fotograma, nunca hay dos palabras a medio camino. Con `duration`
          // muy corta contra un `stagger` de 1, cada palabra ocupa apenas un
          // 25% del hueco de la siguiente: se lee como el mismo barrido duro,
          // sin el parpadeo que daría un salto instantáneo con menos palabras
          // que las 27 de la referencia.
          duration: 0.25,
          stagger: { each: 1 },
          scrollTrigger: {
            trigger: manifesto,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            start: "top top",
            // 450 px sobre un viewport de 900 en la referencia: medio
            // viewport. Relativo, no fijo, para que el ritmo se sostenga en
            // pantallas de otra altura.
            end: () => "+=" + window.innerHeight * 0.5,
            scrub: 0.5,
          },
        },
      );
    }
  }

  /* --- 7 Contacto: el campo Navy se derrama ------------------------------
     El ::before de .section--contact escala en Y desde el borde superior,
     leyendo la custom property --field. El rango termina mucho antes de que
     la sección esté leíble (top 45%), así que el área cubierta siempre va por
     delante del área visible — nunca hay tinta Hueso sobre fondo Hueso. */
  const contact = document.querySelector<HTMLElement>("#contact");
  if (contact) {
    gsap.fromTo(
      contact,
      { "--field": 0 },
      {
        "--field": 1,
        ease: "none",
        scrollTrigger: {
          trigger: contact,
          start: "top bottom",
          end: "top 45%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  /* --- Gestos por sección ------------------------------------------------ */
  qa<HTMLElement>("main > section").forEach((section) => {
    if (section.id === "hero" || section.id === "manifesto") return;

    const title = section.querySelector('[data-reveal="title"]');
    if (title) {
      revealLines(title, { trigger: title, start: "top 88%", once: true });
    }

    const bodies = qa('[data-reveal="body"]', section);
    if (bodies.length > 0) {
      gsap.from(bodies, {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: bodies[0], start: "top 88%", once: true },
      });
    }

    const cards = qa('[data-reveal="card"]', section);
    if (cards.length > 0) {
      gsap.from(cards, {
        autoAlpha: 0,
        y: 42,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: cards[0], start: "top 85%", once: true },
      });

      // La captura asienta su escala dentro del recuadro (que recorta el
      // sobrante). Es el único movimiento de imagen del sitio y se queda en
      // 6% a propósito: más se lee como carrusel de plantilla.
      qa('[data-reveal="shot"] img', section).forEach((img) => {
        gsap.from(img, {
          scale: 1.06,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: img, start: "top 92%", once: true },
        });
      });
    }

    revealRows(qa<HTMLElement>('[data-reveal="row"]', section));
  });
}

export function SiteMotion() {
  const { locale } = useLanguage();
  const runId = useRef(0);

  useGSAP(
    (_context, contextSafe) => {
      // El montaje doble de Strict Mode en desarrollo dispara el efecto dos
      // veces, y como la construcción es asíncrona (espera a las fuentes),
      // las dos corridas llegaban a construir la coreografía entera: dos
      // juegos de ScrollTriggers sobre los mismos nodos. Cada corrida se
      // queda con su número; solo la última sigue viva.
      const run = ++runId.current;

      // Todo se construye DESPUÉS de que las fuentes estén listas: SplitText
      // calcula los cortes de línea contra la tipografía real, no contra la
      // fallback, o el titular se reacomoda a la vista.
      const build = contextSafe!(() => {
        if (run !== runId.current) return;

        const mm = gsap.matchMedia();
        mm.add(
          {
            all: "",
            reduce: "(prefers-reduced-motion: reduce)",
            // Breakpoint `lg` del proyecto (DESIGN.md § Layout, --bp-lg en
            // globals.css — literal acá por la misma razón que los @media de
            // ese archivo: una media query de JS no puede leer un custom
            // property). Gobierna si la tarjeta 3D de Bio pinea (ver el
            // JSDoc de `choreograph` y el bloque "2 Bio" más abajo). Vive en
            // el mismo `mm.add` que `all`/`reduce` — no uno aparte — para
            // que cruzar el breakpoint revierta y reconstruya toda la
            // coreografía de una, sin dos matchMedia peleando por el mismo
            // DOM.
            //
            // 1280 y no 900: tiene que coincidir EXACTO con el `lg:` de la
            // grid de Bio en app/page.tsx, que es donde la fila pasa de una
            // columna a tres. Medido a 900px de ancho, las tres columnas
            // entran pero la de p2 queda en 87px — un párrafo en una cinta —
            // y a 1024 en 115px. Si el pin arrancara antes que las tres
            // columnas, además clavaría una fila de una sola columna más alta
            // que el viewport, con los párrafos fuera de pantalla.
            isDesktop: "(min-width: 1280px)",
          },
          (ctx) => {
            // Se lee ANTES de destapar: si la clase ya no está, la cubierta la
            // destapó el fallback por timeout y el visitante la viene mirando.
            const heroStillHidden =
              document.documentElement.classList.contains(HOLD_CLASS);
            document.documentElement.classList.remove(HOLD_CLASS);
            // Rama reducida: no hay nada que restaurar. El CSS base ya deja
            // todo en su estado final, así que no animar es literalmente no
            // hacer nada.
            if (ctx.conditions?.reduce) return;
            choreograph(heroStillHidden, Boolean(ctx.conditions?.isDesktop));
          },
        );
      });

      void document.fonts.ready.then(() => build());

      // Las capturas de proyecto cambian la altura del documento al
      // decodificarse; sin este refresh los disparadores de abajo quedan
      // calculados contra un layout viejo.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        // Destapar acá es la red de último recurso: si el componente se
        // desmonta antes de que la coreografía tome el control, el hero no
        // puede quedar oculto.
        //
        // Se probó sacarlo por sospecha de que el cleanup del doble montaje de
        // React Strict Mode (mount → cleanup → mount, síncrono) destapara el
        // hero antes de que la corrida sobreviviente leyera `heroStillHidden`,
        // dejándolo sin animar. Medido en navegador con y sin esta línea: la
        // entrada del hero corre igual en los dos casos (las líneas de
        // SplitText van de yPercent 118 a 0). No reproduce — la línea se
        // queda.
        //
        // Ojo al medir esto: SplitText anida línea dentro de máscara, y la
        // MÁSCARA nunca lleva transform. Leer el primer `div` da `none` esté
        // animando o no. Hay que leer el hijo de adentro.
        document.documentElement.classList.remove(HOLD_CLASS);
      };
    },
    // El cambio de idioma reemplaza el texto de cada titular y cada palabra
    // del manifiesto: hay que revertir los splits y volver a medir todo.
    { dependencies: [locale], revertOnUpdate: true },
  );

  return null;
}
