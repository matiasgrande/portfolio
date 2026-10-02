import type { Dict } from "../types";

// Cadenas del shell (nav pill, skip link) + contenido de las 7 secciones
// del sitio (hero / bio / manifesto / work / capabilities / ongoing /
// contact). Las claves de este archivo y las de en.ts deben ser idénticas.
//
// Sin placeholders pendientes: el usuario entregó el tema de tesis, la línea
// de IA y las URLs de sus redes el 2026-08-04. Si vuelve a aparecer un dato
// que el usuario todavía no dio, va como `[…pendiente]` con un TODO acá —
// nunca inventado.
export const es: Dict = {
  "nav.skip": "Saltar al contenido",
  "nav.ariaLabel": "Navegación principal",
  "nav.name": "Matias Grande",
  "toggle.aria": "Cambiar idioma / Switch language",
  "toggle.es": "ES",
  "toggle.en": "EN",

  // 1 — Hero
  //
  // OJO: estas dos claves están horneadas en `app/opengraph-image.png`, la
  // tarjeta que ven LinkedIn y WhatsApp al compartir el link. Es un PNG, no
  // se regenera solo. Si cambian acá, hay que rehacer la tarjeta con los
  // tokens de DESIGN.md § Components → Marca de pestaña y tarjeta de link,
  // o la previsualización queda mostrando el texto viejo.
  "hero.name": "Matias Grande",
  "hero.role": "Ingeniería de Sistemas — desarrollo con foco en IA",
  "hero.cta": "Escríbeme",

  // 2 — Bio
  "bio.heading": "Ingeniero de sistemas, a pasos de graduarse.",
  "bio.p1":
    "Estudio Ingeniería de Sistemas y estoy por tener mi título. Mi trabajo se mueve hacia el desarrollo con foco en inteligencia artificial — una dirección que declaro, no un título que ya tengo.",
  "bio.p2":
    "La prueba concreta que tengo hoy es haber llevado un producto de punta a punta: diseño, build y despliegue continuo. Frescura del Mar está en producción; este mismo sitio es el segundo.",
  "bio.portraitAlt":
    "Retrato de Matias Grande, de frente y con expresión seria, bañado en luz azul marino.",

  // 3 — Manifiesto. Partido en tres para poder pintar la frase clave en
  // Navy (DESIGN.md § Colors: "la palabra que carga el peso en un
  // titular" es uno de los cuatro usos permitidos del acento) sin
  // hardcodear texto ni romper el reveal palabra por palabra.
  "manifesto.pre":
    "Diseño, construyo y despliego software real — y apunto ese oficio hacia",
  "manifesto.highlight": "la inteligencia artificial",
  "manifesto.post": ".",

  // 4 — Trabajo
  "work.heading": "Trabajo",
  "work.frescura.name": "Frescura del Mar",
  "work.frescura.meta": "Landing de exportación — en producción",
  "work.frescura.body":
    "Sitio bilingüe para una exportadora de mariscos, sin carrito ni backend: una sola conversión, abrir WhatsApp con el mensaje ya escrito. Diseño propio, GSAP, CI/CD a GitHub Pages en cada push.",
  "work.frescura.cta": "Ver el sitio vivo",
  "work.frescura.imageAltDesktop":
    "Captura de escritorio de la portada de Frescura del Mar, con el diagrama de la ruta de exportación y la paleta navy y coral del sistema de diseño.",
  "work.frescura.imageAltMobile":
    "Captura en mobile de la misma portada de Frescura del Mar.",
  "work.portfolio.name": "Este portfolio",
  "work.portfolio.meta": "Portfolio personal — en producción",
  "work.portfolio.body":
    "El sitio que estás mirando: Next.js con export estático, GSAP, bilingüe ES/EN, y CI/CD a GitHub Pages en cada push a main. Es su propia muestra de trabajo.",
  "work.portfolio.imageAlt":
    "Captura del hero de este portfolio: el nombre Matias Grande en tipografía de gran escala sobre fondo hueso.",

  // 5 — Capacidades
  "capabilities.heading": "Capacidades",
  "capabilities.row1.name": "Frontend engineering",
  "capabilities.row1.tag1": "Next.js",
  "capabilities.row1.tag2": "React",
  "capabilities.row1.tag3": "TypeScript",
  "capabilities.row2.name": "Motion & interacción",
  "capabilities.row2.tag1": "GSAP",
  "capabilities.row2.tag2": "ScrollTrigger",
  // SplitText y no DrawSVGPlugin: este sitio se presenta como su propia
  // muestra de trabajo, así que las capacidades listadas tienen que estar
  // demostradas en él. SplitText mueve los titulares de cada sección;
  // DrawSVGPlugin no se usa en ninguna parte del proyecto.
  "capabilities.row2.tag3": "SplitText",
  "capabilities.row3.name": "Sistemas de diseño",
  "capabilities.row3.tag1": "Tokens",
  "capabilities.row3.tag2": "Tailwind CSS",
  "capabilities.row3.tag3": "Tipografía fluida",
  "capabilities.row4.name": "Internacionalización",
  "capabilities.row4.tag1": "ES / EN",
  "capabilities.row4.tag2": "Diccionarios tipados",
  "capabilities.row4.tag3": "Sin backend",
  "capabilities.row5.name": "Despliegue & CI/CD",
  "capabilities.row5.tag1": "GitHub Actions",
  "capabilities.row5.tag2": "GitHub Pages",
  "capabilities.row5.tag3": "Static export",

  // 6 — En curso
  "ongoing.heading": "En curso",
  "ongoing.thesis.label": "Tesis",
  "ongoing.thesis.value": "Gestión de banco de sangre hospitalario",
  "ongoing.thesis.body":
    "Es una aplicación web para el banco de sangre del Hospital Clínicas del Este. Cubre la captación de donantes y el envío automático de notificaciones por email en emergencias. También la trazabilidad de los hemocomponentes, desde que se reciben hasta su uso transfusional.",
  "ongoing.ai.label": "Línea de IA",
  "ongoing.ai.value": "Desarrollo asistido por agentes de IA",
  "ongoing.ai.body":
    "Uso agentes de IA para programar y automatizar tareas de desarrollo; la dirección de diseño y la verificación final quedan de mi lado. Frescura del Mar y este portfolio, los dos en la sección Trabajo, están construidos así. Si el resultado sale genérico, no se usa.",

  // 7 — Contacto
  "contact.heading": "Hablemos.",
  "contact.body": "Si algo de esto te interesa, escríbeme.",
  "contact.form.nameLabel": "Nombre",
  "contact.form.namePlaceholder": "Tu nombre",
  "contact.form.emailLabel": "Correo",
  "contact.form.emailPlaceholder": "tu@correo.com",
  "contact.form.messageLabel": "Mensaje",
  "contact.form.messagePlaceholder": "Cuentame en qué estás pensando",
  "contact.form.submit": "Enviar",
  "contact.form.sending": "Enviando…",
  "contact.form.success": "Recibido. Te respondo pronto.",
  "contact.form.error":
    "No se pudo enviar. Escríbeme directo a matiasgrande06@gmail.com.",
  "contact.form.errorRequired": "Este campo no puede quedar vacío.",
  "contact.form.errorEmail": "Revisá el formato del correo.",
  // Aviso legal que hCaptcha exige mostrar cuando corre en modo invisible.
  // Va partido en cuatro claves y no en una sola frase porque dos de sus
  // fragmentos son enlaces: una única cadena obligaría a un marcador y a un
  // parser para reinsertarlos, y el orden de las palabras cambia entre
  // idiomas.
  "contact.form.legalIntro": "Protegido por hCaptcha —",
  "contact.form.legalPrivacy": "Privacidad",
  "contact.form.legalAnd": "y",
  "contact.form.legalTerms": "Términos",
  "contact.social.linkedin": "LinkedIn de Matias Grande",
  "contact.social.email": "Correo de Matias Grande",
  "contact.social.instagram": "Instagram de Matias Grande",
  "contact.social.github": "GitHub de Matias Grande",
  "contact.signOff": "Matias Grande — 2026",
};
