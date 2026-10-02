import type { Metadata, Viewport } from "next";
import { schibstedGrotesk } from "./fonts";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { NavPill } from "@/components/NavPill";
import { SkipLink } from "@/components/SkipLink";
import { SiteMotion } from "@/components/SiteMotion";
import "./globals.css";

// Origen a secas, SIN el basePath: Next ya le antepone `/portfolio` a las
// rutas de imagen de metadata. Si acá va la URL completa, og:image sale como
// .../portfolio/portfolio/opengraph-image.png y la previsualización da 404.
const SITE_ORIGIN = "https://matiasgrande.github.io";
const SITE_URL = `${SITE_ORIGIN}/portfolio`;
const TITLE = "Matías Grande — Portfolio";
const DESCRIPTION =
  "Portfolio de Matías Grande, ingeniero de sistemas próximo a graduarse, con foco en desarrollo con IA.";

export const metadata: Metadata = {
  // og:image y og:url tienen que ser absolutas: el que las lee es un servidor
  // ajeno (LinkedIn, WhatsApp, Slack), no el navegador que ya sabe el origen.
  // Sin metadataBase, Next emite rutas relativas y la previsualización queda
  // sin imagen. El valor sigue el basePath de next.config.ts — si el repo se
  // renombra, los dos cambian juntos.
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  // La tarjeta y su alt salen de app/opengraph-image.png + .alt.txt por
  // convención de archivo de Next; no se declaran acá.
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Corre antes del primer pintado y marca <html> para que el CSS oculte la
 * cubierta (`.motion-hold [data-motion-hold]` en globals.css). Sin esto el
 * hero se pinta entero con el HTML del servidor y recién después GSAP lo
 * esconde para animarlo: se ve, desaparece y vuelve.
 *
 * La coreografía saca la clase apenas toma el control — también con motion
 * reducido, donde no anima nada. El setTimeout es la red: si el JS de la app
 * nunca llega a correr, la cubierta aparece igual y el sitio queda legible.
 */
const MOTION_HOLD = `(function(){var d=document.documentElement;d.classList.add("motion-hold");setTimeout(function(){d.classList.remove("motion-hold")},2000)})()`;

/**
 * Mismo problema que MOTION_HOLD, pero de idioma en vez de coreografía: el
 * sitio es un export estático, no hay servidor que le sirva a cada visitante
 * su HTML — SIEMPRE sale en español (DEFAULT_LOCALE en LanguageProvider.tsx).
 * Un visitante que guardó "en" en una visita anterior vería ese español en el
 * primer pintado y recién saltaría a inglés cuando el efecto de
 * LanguageProvider lea localStorage — y ese salto, al cambiar `locale`,
 * dispara `revertOnUpdate` en SiteMotion.tsx (dependencies: [locale]), que
 * reconstruye TODA la coreografía de GSAP justo después de haber arrancado.
 *
 * Este script corre antes de que exista cualquier bundle de la app, así que
 * no puede importar STORAGE_KEY/DEFAULT_LOCALE de LanguageProvider.tsx — están
 * copiados a mano acá abajo. SI CAMBIAN AHÍ, TIENEN QUE CAMBIAR ACÁ TAMBIÉN.
 *
 * Escribe `lang` de una (no esperar al efecto de React: un lector de
 * pantalla que arranca a leer con el `lang` viejo anuncia el contenido con la
 * voz equivocada, y eso es peor que el flash visual). Y solo si el guardado
 * difiere del default agrega `locale-hold`, que el CSS (`.locale-hold body`
 * en globals.css) usa para ocultar el documento ENTERO — no solo el hero,
 * como `.motion-hold [data-motion-hold]` — hasta que LanguageProvider
 * confirme el idioma. Visitante nuevo, o con "es" guardado: la condición
 * nunca se cumple, cero hold, se pinta como siempre.
 *
 * try/catch: localStorage puede LANZAR (Safari con almacenamiento bloqueado,
 * cookies deshabilitadas), y acá no hay ningún React todavía que contenga el
 * error — una excepción sin atajar se lleva el pintado entero. Mismo motivo
 * que el try/catch de LanguageProvider.tsx.
 *
 * setTimeout: misma red que MOTION_HOLD. Si el JS de la app nunca corre, el
 * hold se cae solo a los 2000ms y el sitio queda en español pero VISIBLE —
 * invisible no es un final aceptable nunca.
 */
const LOCALE_HOLD = `(function(){var d=document.documentElement;try{var s=localStorage.getItem("mg-portfolio-locale");if(s==="es"||s==="en"){d.lang=s;if(s!=="es"){d.classList.add("locale-hold");setTimeout(function(){d.classList.remove("locale-hold")},2000)}}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning`: los scripts de arriba tocan <html> ANTES de
    // que React hidrate — MOTION_HOLD le agrega la clase `motion-hold` y
    // LOCALE_HOLD puede reescribir `lang` y agregar `locale-hold` — así que el
    // className (y a veces el `lang`) del cliente no coinciden con lo que
    // sirvió el servidor. React no revierte esos atributos (avisa y sigue),
    // pero sin esto tira un error de hidratación en consola en cada carga,
    // también en producción. El flag es exactamente para este caso: atributos
    // que un script inline modifica a propósito antes de hidratar. Solo
    // silencia este nodo, no el árbol.
    <html lang="es" className={schibstedGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_HOLD }} />
        <script dangerouslySetInnerHTML={{ __html: MOTION_HOLD }} />
      </head>
      <body>
        <LanguageProvider>
          {/* SkipLink y NavPill quedan FUERA del wrapper a propósito:
              ScrollSmoother mueve #smooth-content con un transform, y un
              transform crea un contenedor de posicionamiento que rompe el
              `position: fixed` de lo que tenga adentro. La pill dejaría de
              estar fija y scrollearía con la página. */}
          <SkipLink />
          <SiteMotion />
          <NavPill />
          {/* Estructura que pide ScrollSmoother. Sin JS los dos divs son
              transparentes al layout — los estilos que los convierten en
              viewport y lienzo los aplica GSAP en runtime. */}
          <div id="smooth-wrapper">
            <div id="smooth-content">
              {/* `tabIndex={-1}`: el SkipLink apunta acá, y saltar a un
                  fragmento que no es focusable mueve el scroll pero no
                  siempre el foco — Safari/VoiceOver no lo hace. Sin esto el
                  skip link no sirve justo para quien lo necesita. */}
              <main id="main" tabIndex={-1}>
                {children}
              </main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
