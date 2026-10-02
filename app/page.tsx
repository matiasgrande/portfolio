"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";

/**
 * Las 7 secciones de "The Statement Page" (DESIGN.md). Estructura y
 * contenido — Agente F, reemplazando por completo el mundo "Engineering
 * Logbook" descartado por el usuario.
 *
 * Contrato de motion con components/SiteMotion.tsx. Cada gesto se engancha a
 * un `data-reveal`; el motion NO usa selectores de clase ni de estructura,
 * así que reordenar o reestilar una sección no rompe su animación:
 *
 *   hero-title / hero-role / hero-cta  cubierta, sin scroll de por medio
 *   title                              titular de sección, sube en máscara
 *   body                               párrafo de lectura, entra detrás
 *   word                               palabra del manifiesto — se llena
 *                                      ligada al scroll, de gris a tinta
 *   card                               card de proyecto
 *   shot                               recuadro de captura (la imagen asienta
 *                                      su escala adentro)
 *   row                                fila con divisor: la hairline se
 *                                      dibuja y el contenido entra después
 *
 * Aparte, `data-motion-hold` marca lo que el script inline de layout.tsx
 * mantiene oculto hasta que la coreografía arranca — solo la cubierta, que es
 * lo único visible antes del primer scroll.
 *
 * La tarjeta 3D de Bio (`.bio-card-stage` / `.bio-card`) queda FUERA del
 * contrato `data-reveal` a propósito: no es un reveal genérico, es un pin +
 * rotateY + scale con su propia lógica en SiteMotion.tsx (selector de
 * clase, no de `data-reveal`), para que el loop genérico de "gestos por
 * sección" no la toque dos veces.
 *
 * El manifiesto llega partido en `manifesto.pre` / `manifesto.highlight` /
 * `manifesto.post` en vez de una sola clave para poder pintar la frase clave
 * en Navy: DESIGN.md § Colors sanciona "la palabra que carga el peso en un
 * titular" como uno de los cuatro usos permitidos del acento. Las palabras se
 * separan con texto plano (" ") para que la frase se siga leyendo como una
 * sola oración en un lector de pantalla.
 */
export default function Home() {
  const { t } = useLanguage();

  const manifestoPreWords = t("manifesto.pre").split(" ");
  const manifestoHighlightWords = t("manifesto.highlight").split(" ");

  return (
    <>
      {/* 1 — Hero =========================================================== */}
      <section
        id="hero"
        className="section section--hero"
        aria-labelledby="hero-title"
      >
        <div
          className="wrap flex flex-col items-center gap-[var(--space-3)] text-center"
          data-motion-hold
        >
          <h1
            id="hero-title"
            className="text-display uppercase"
            data-reveal="hero-title"
          >
            {t("hero.name")}
          </h1>
          <p className="text-headline max-w-[24ch] mx-auto" data-reveal="hero-role">
            {t("hero.role")}
          </p>
          <a
            href="mailto:matiasgrande06@gmail.com"
            className="text-title w-fit mx-auto"
            data-reveal="hero-cta"
          >
            {t("hero.cta")} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* 2 — Bio ============================================================= */}
      <section id="bio" className="section" aria-labelledby="bio-title">
        {/* Tres columnas con el retrato al MEDIO y el texto repartido a los
            dos costados, como la referencia: título y primer párrafo a la
            izquierda, retrato al centro, segundo párrafo a la derecha. La
            fila centra verticalmente (`items-center`) contra la tarjeta, que
            sigue siendo la más alta (.bio-card-stage en globals.css,
            dimensionada para su tamaño de llegada): con `items-end` la
            diferencia de alto entre columnas se leía bien cuando la tarjeta
            forzaba una fila de 900px, pero ahora que la fila es compacta,
            bottom-alinear ya no suma nada.
            La columna de título/párrafo lleva `self-start` en vez de heredar
            ese centrado: el título tiene que arrancar en el mismo punto en ES
            y en EN (textos de largo distinto, que envuelven distinto) sin
            recalcular a mano cuánto mide la columna en cada caso. Con
            `self-start`, el título arranca siempre en el borde superior de la
            fila — que el pin centra en el viewport (`bioPinTop()`,
            SiteMotion.tsx) — sin importar cuántas líneas ocupe el título o
            el párrafo debajo. El párrafo derecho sí se beneficia de quedar
            centrado contra la tarjeta (columna más corta, sin el mismo
            requisito numérico). En mobile colapsa a una sola columna en
            orden de lectura, donde ninguna de las dos alineaciones importa
            (cada hijo es su propia fila).

            Las tres columnas arrancan en `lg` (1280px) y no en `md` (900px):
            medido, a 900px de ancho la columna de p2 queda en 87px y a 1024 en
            115px — un párrafo en una cinta. Abajo de 1280 la fila colapsa a
            una sola columna, que es donde el texto respira. El breakpoint del
            pin en SiteMotion.tsx (`isDesktop`) tiene que seguir a este: si
            pinea sin las tres columnas, clava una fila más alta que el
            viewport.

            El gap de la fila es `--space-4` (48px) y no `--space-5` (96px)
            para que las laterales queden lo más parejas posible: la palabra
            "graduating." del título fija un piso de min-content de ~343px en
            la izquierda, y a un track `1fr` no se le puede pedir menos que
            eso, así que todo lo que sobra del gap se lo come la derecha.
            Con 48px las dos laterales miden 343/341 a 1280 — el retrato queda
            centrado. Arriba de ~1600px `.wrap` se angosta (su `max-width` es
            fijo y el `padding-inline` sigue creciendo con `5vw` hasta 96px) y
            la derecha vuelve a ceder; es el límite conocido de esta medida. */}
        <div className="wrap grid grid-cols-1 items-center gap-[var(--space-4)] lg:grid-cols-[1fr_minmax(240px,340px)_1fr]">
          <div className="flex flex-col gap-[var(--space-3)] self-start">
            <h2 id="bio-title" className="text-headline" data-reveal="title">
              {t("bio.heading")}
            </h2>
            <p className="text-body" data-reveal="body">
              {t("bio.p1")}
            </p>
          </div>

          {/* Tarjeta 3D — remate del efecto de cubierta (DESIGN.md
              § Components → "Tarjeta 3D de Bio"). Coreografía de scroll
              (pin + rotateY + scale) en components/SiteMotion.tsx; caras y
              estado sin JS en app/globals.css (.bio-card-stage / .bio-card). */}
          <div className="bio-card-stage">
            <div className="bio-card">
              {/* Las dos caras son la MISMA fotografía en dos tratamientos: la
                  trasera en blanco y negro, la frontal en Navy. El giro revela
                  el color — ese es el remate del efecto.

                  La trasera va con `alt=""`: un lector de pantalla no debe
                  anunciar dos veces el mismo retrato, y la cara que queda de
                  frente al terminar el scroll es la frontal. */}
              <div className="bio-card__face bio-card__face--back">
                <Image
                  src="/media/matias-bw.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 900px) 340px, 80vw"
                  className="bio-card__img"
                />
              </div>
              <div className="bio-card__face bio-card__face--front">
                <Image
                  src="/media/matias-color.jpg"
                  alt={t("bio.portraitAlt")}
                  fill
                  sizes="(min-width: 900px) 340px, 80vw"
                  className="bio-card__img"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[var(--space-3)]">
            <p className="text-body" data-reveal="body">
              {t("bio.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Manifiesto ====================================================== */}
      <section
        id="manifesto"
        className="section"
        aria-labelledby="manifesto-title"
      >
        <div className="wrap">
          <h2
            id="manifesto-title"
            className="text-headline text-center mx-auto max-w-[26ch]"
          >
            {manifestoPreWords.map((word, i) => (
              <Fragment key={`pre-${i}`}>
                <span data-reveal="word" className="inline-block">
                  {word}
                </span>{" "}
              </Fragment>
            ))}
            {manifestoHighlightWords.map((word, i) => {
              const last = i === manifestoHighlightWords.length - 1;
              return (
                <Fragment key={`hl-${i}`}>
                  <span data-reveal="word" className="inline-block word--accent">
                    {word}
                    {/* El punto final viaja pegado a la última palabra en vez
                        de ir suelto: suelto se queda en Tinta mientras la
                        frase todavía se está llenando, y se lee como una
                        mancha negra al final de una línea gris. */}
                    {last ? (
                      <span className="word__tail">{t("manifesto.post")}</span>
                    ) : null}
                  </span>
                  {last ? "" : " "}
                </Fragment>
              );
            })}
          </h2>
        </div>
      </section>

      {/* 4 — Trabajo ========================================================= */}
      <section id="work" className="section" aria-labelledby="work-title">
        <div className="wrap flex flex-col gap-[var(--space-5)]">
          <h2 id="work-title" className="text-headline" data-reveal="title">
            {t("work.heading")}
          </h2>

          <div className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2">
            <article className="work-card" data-reveal="card">
              <div className="work-card__image" data-reveal="shot">
                <Image
                  src="/media/frescura-mobile.png"
                  alt={t("work.frescura.imageAltMobile")}
                  width={390}
                  height={844}
                  className="w-full h-auto shot-narrow"
                />
                <Image
                  src="/media/frescura-desktop.png"
                  alt={t("work.frescura.imageAltDesktop")}
                  width={1440}
                  height={727}
                  className="w-full h-auto shot-wide"
                />
              </div>
              <div className="flex flex-col gap-[var(--space-1)] mt-[var(--space-3)]">
                <h3 className="work-card__name text-title">
                  {t("work.frescura.name")}
                </h3>
                <p className="text-label text-gray">{t("work.frescura.meta")}</p>
                <p className="text-body mt-[var(--space-1)]">
                  {t("work.frescura.body")}
                </p>
                <a
                  href="https://matiasgrande.github.io/frescura-del-mar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label w-fit mt-[var(--space-1)]"
                >
                  {t("work.frescura.cta")} <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>

            <article className="work-card" data-reveal="card">
              <div className="work-card__image" data-reveal="shot">
                <Image
                  src="/media/portfolio-desktop.png"
                  alt={t("work.portfolio.imageAlt")}
                  width={2880}
                  height={1454}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex flex-col gap-[var(--space-1)] mt-[var(--space-3)]">
                <h3 className="work-card__name text-title">
                  {t("work.portfolio.name")}
                </h3>
                <p className="text-label text-gray">{t("work.portfolio.meta")}</p>
                <p className="text-body mt-[var(--space-1)]">
                  {t("work.portfolio.body")}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 5 — Capacidades ===================================================== */}
      <section
        id="capabilities"
        className="section"
        aria-labelledby="capabilities-title"
      >
        <div className="wrap flex flex-col gap-[var(--space-4)]">
          <h2 id="capabilities-title" className="text-headline" data-reveal="title">
            {t("capabilities.heading")}
          </h2>

          <div>
            {(["row1", "row2", "row3", "row4", "row5"] as const).map((row) => (
              <div key={row} className="cap-row" data-reveal="row">
                <p className="text-title">{t(`capabilities.${row}.name`)}</p>
                <div className="cap-row__tags">
                  <span className="text-label text-gray">
                    {t(`capabilities.${row}.tag1`)}
                  </span>
                  <span className="text-label text-gray">
                    {t(`capabilities.${row}.tag2`)}
                  </span>
                  <span className="text-label text-gray">
                    {t(`capabilities.${row}.tag3`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — En curso ========================================================= */}
      <section id="ongoing" className="section" aria-labelledby="ongoing-title">
        <div className="wrap flex flex-col gap-[var(--space-4)]">
          <h2 id="ongoing-title" className="text-headline" data-reveal="title">
            {t("ongoing.heading")}
          </h2>

          <div className="flex flex-col">
            <div
              className="hr-row flex flex-col gap-[var(--space-2)]"
              data-reveal="row"
            >
              <div className="flex items-baseline gap-[var(--space-2)]">
                <span className="text-label text-gray">
                  {t("ongoing.thesis.label")}
                </span>
                <span className="text-title">{t("ongoing.thesis.value")}</span>
              </div>
              <p className="text-body text-gray max-w-[60ch]">
                {t("ongoing.thesis.body")}
              </p>
            </div>

            <div
              className="hr-row flex flex-col gap-[var(--space-2)]"
              data-reveal="row"
            >
              <div className="flex items-baseline gap-[var(--space-2)]">
                <span className="text-label text-gray">
                  {t("ongoing.ai.label")}
                </span>
                <span className="text-title">{t("ongoing.ai.value")}</span>
              </div>
              <p className="text-body text-gray max-w-[60ch]">
                {t("ongoing.ai.body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Contacto ========================================================= */}
      <section
        id="contact"
        className="section section--contact"
        aria-labelledby="contact-title"
      >
        <div className="wrap flex flex-col items-center gap-[var(--space-2)]">
          <h2
            id="contact-title"
            className="text-display uppercase text-center"
            data-reveal="title"
          >
            {t("contact.heading")}
          </h2>

          <p className="text-body max-w-[60ch] text-center" data-reveal="body">
            {t("contact.body")}
          </p>

          {/* Formulario + iconos de redes reemplazan las tres filas de texto
              (Correo / GitHub / LinkedIn) que ocupaban media sección — el
              usuario pidió el cambio porque esas filas ocupaban demasiado
              espacio (DESIGN.md § Components → "Iconos de redes"). Las seis
              claves que esas filas usaban ya se borraron del diccionario. */}
          <ContactForm />

          <SocialIcons />

          <p className="text-label text-center" data-reveal="body">
            {/* La dirección sigue disponible en texto, copiable sin abrir un
                cliente de correo (DESIGN.md § Iconos de redes). Literal y no
                vía diccionario a propósito: una dirección de correo no se
                traduce, y meterla como clave de i18n obliga a mantener dos
                copias idénticas que pueden desincronizarse. Mismo criterio
                que el mailto del hero. */}
            <a href="mailto:matiasgrande06@gmail.com">matiasgrande06@gmail.com</a>
            <span aria-hidden="true"> — </span>
            {t("contact.signOff")}
          </p>
        </div>
      </section>
    </>
  );
}
