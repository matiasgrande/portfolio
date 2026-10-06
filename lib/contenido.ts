import type { DefinicionPieza, Idioma, IdProyecto, Proyecto } from './tipos';
import { ruta } from './ruta';

export const CORREO = 'matiasgrande06@gmail.com';
export const REDES = {
  github: 'https://github.com/matiasgrande',
  linkedin: 'https://www.linkedin.com/in/matias-grande-114b88215',
  instagram: 'https://www.instagram.com/matiasgrander_/',
} as const;

/** Colores de acento; el easter egg del código Konami va rotando entre ellos */
export const ACENTOS = ['#D2FF3F', '#FF7A45', '#7FE3FF'] as const;

/** Textos de la interfaz en ambos idiomas */
function construirTextos(es: boolean) {
  return {
    eyebrow: 'Matías Grande · Isla de Margarita, Venezuela',
    h1a: es ? 'Ingeniero de Sistemas.' : 'Systems Engineer.',
    h1b1: es ? 'Ingeniero ' : '',
    h1b2: es ? 'de IA' : 'AI',
    h1b3: es ? '.' : ' Engineer.',
    h1Completo: es ? 'Ingeniero de Sistemas. Ingeniero de IA.' : 'Systems Engineer. AI Engineer.',
    sub: es
      ? 'Diseño, construyo y publico productos completos, de la interfaz a la base de datos. Mi especialidad es dirigir a la IA para que el resultado se note, y las decisiones las tomo yo.'
      : 'I design, build and ship complete products, from the interface to the database. My specialty is directing AI so the result stands out, and I make the calls.',
    cta: es ? 'Entrar a la mesa' : 'Step up to the desk',
    verLista: es ? 'Ver como lista' : 'View as list',
    verMesa: es ? 'Ver la mesa' : 'View the desk',
    marquesina: es
      ? 'REACT · REACT NATIVE · NEXT.JS · TYPESCRIPT · SWIFTUI · SQL · SUPABASE · GSAP · THREE.JS · AGENTES DE IA ·'
      : 'REACT · REACT NATIVE · NEXT.JS · TYPESCRIPT · SWIFTUI · SQL · SUPABASE · GSAP · THREE.JS · AI AGENTS ·',
    mesaTitulo: es ? 'La mesa' : 'The desk',
    mesaHint: es
      ? 'Arrastra las piezas, lánzalas, ábrelas. Mueve la linterna: hay cosas escondidas en la oscuridad.'
      : 'Drag the pieces, throw them, open them. Move the flashlight: there are things hidden in the dark.',
    girarHint: es ? '↺ toca el teléfono' : '↺ tap the phone',
    cerrar: es ? 'Cerrar' : 'Close',
    verDetalle: es ? 'Ver fotos y video' : 'See photos and video',
    verVideo: es ? 'Ver video' : 'Watch video',
    listaTitulo: es ? 'Proyectos' : 'Projects',
    contactoTitulo: es ? '¿Construimos algo?' : 'Shall we build something?',
    contactoSub: es
      ? 'Cuéntame qué necesitas: una app, un sitio o un producto que aún es una idea. Escríbeme en español o en inglés.'
      : 'Tell me what you need: an app, a site, or a product that is still an idea. Write to me in English or Spanish.',
    contactoCta: es ? 'Escríbeme' : 'Write to me',
    ejemplo: es ? 'Capturas con datos de ejemplo.' : 'Screenshots use sample data.',
    pie: es ? 'Diseñado y dirigido desde la Isla de Margarita.' : 'Designed and directed from Margarita Island.',
    s1: es ? 'ya pasaste los 30 segundos: ahora sí, mira todo' : 'you made it past 30 seconds: go on, look around',
    s2: es ? 'sin suscripción' : 'no subscription',
    s3: 'git commit -m "más animaciones"',
    luz: es ? 'luz' : 'light',
    ariaLuz: es ? 'Encender la lámpara de la mesa' : 'Turn on the desk lamp',
    ariaTel: es ? 'Dar vuelta al teléfono: Almanaque y Hybrid' : 'Flip the phone: Almanaque and Hybrid',
    decTagline: es ? 'Grandes aromas, pequeñas dosis.' : 'Big aromas, small doses.',
    freSub: es ? 'PULPO · CAMARÓN' : 'OCTOPUS · SHRIMP',
    frePedido: es ? 'COTIZA → WHATSAPP' : 'QUOTE → WHATSAPP',
    tCargo: es ? 'Ingeniero de Sistemas · Ingeniero de IA' : 'Systems Engineer · AI Engineer',
    termTitulo: es ? 'subagentes' : 'subagents',
    term1: es ? 'lanzando 2 subagentes' : 'launching 2 subagents',
    term2: es ? 'inventario (solo lectura)' : 'inventory (read-only)',
    term3: es ? 'capturas en paralelo' : 'screenshots in parallel',
    term4: es ? 'notas guardadas en el vault' : 'notes saved to the vault',
    ariaAlm: es ? 'Abrir Almanaque' : 'Open Almanaque',
    ariaHyb: es ? 'Abrir Hybrid' : 'Open Hybrid',
    ariaDec: es ? 'Abrir Pure Decants' : 'Open Pure Decants',
    ariaFre: es ? 'Abrir Global Fish' : 'Open Global Fish',
    ariaAge: es ? 'Abrir: resultados sobresalientes con IA' : 'Open: outstanding results with AI',
    ariaCar: es ? 'Girar la tarjeta de contacto' : 'Flip the contact card',
    cursorPieza: es ? 'arrastra · abre' : 'drag · open',
    cursorTarjeta: es ? 'arrastra · gira' : 'drag · flip',
    cursorTelefono: es ? 'girar' : 'flip',
    acentoCambiado: es ? 'acento cambiado' : 'accent changed',
  };
}

export type Textos = ReturnType<typeof construirTextos>;

export function obtenerTextos(idioma: Idioma): Textos {
  return construirTextos(idioma === 'es');
}

const VIDEO_ALMANAQUE = ruta('/video/almanaque-video.mp4');
const POSTER_ALMANAQUE = ruta('/imagenes/almanaque-poster.jpg');
const VIDEO_HYBRID = ruta('/video/hybrid-video.mp4');
const POSTER_HYBRID = ruta('/imagenes/hybrid-poster.jpg');

/** Contenido de cada proyecto en ambos idiomas */
export function obtenerProyectos(idioma: Idioma): Record<IdProyecto, Proyecto> {
  const es = idioma === 'es';
  const img = (archivo: string) => ruta(`/imagenes/${archivo}.webp`);

  return {
    alm: {
      id: 'alm',
      kicker: es ? 'App de iPhone · en desarrollo' : 'iPhone app · in development',
      titulo: 'Almanaque',
      texto: es
        ? 'Responde una sola pregunta: ¿con qué tarjeta pago hoy? Pone el corte y la fecha de pago de tus dos tarjetas en un calendario, te dice cuántos días tienes para pagar cada compra, muestra las tasas BCV y USDT en vivo y te da una puntuación de qué tan bien vas pagando. Nativa en SwiftUI y sin una sola dependencia.'
        : 'It answers one question: which card do I use today? It puts the cut-off and due dates of your two credit cards on a calendar, tells you how many days you have to pay for each purchase, shows live BCV and USDT rates, and gives you a score for how well you are paying. Native SwiftUI, with zero dependencies.',
      etiquetas: es ? ['SwiftUI', 'SwiftData', 'Sin dependencias'] : ['SwiftUI', 'SwiftData', 'No dependencies'],
      imagenes: [
        { src: img('alm-tarjetas'), alt: 'Almanaque: tarjetas' },
        { src: img('alm-ciclo'), alt: 'Almanaque: ciclo en curso' },
        { src: img('alm-calendario'), alt: 'Almanaque: calendario' },
        { src: img('alm-tasas'), alt: 'Almanaque: tasas' },
        { src: img('alm-historial'), alt: 'Almanaque: historial' },
        { src: img('alm-noche'), alt: 'Almanaque: modo oscuro' },
      ],
      video: { src: VIDEO_ALMANAQUE, poster: POSTER_ALMANAQUE, autoplay: true },
      portada: img('alm-tarjetas'),
      ancho: 1060,
    },
    hyb: {
      id: 'hyb',
      kicker: es ? 'App de iPhone · en desarrollo avanzado' : 'iPhone app · advanced development',
      titulo: 'Hybrid',
      texto: es
        ? 'Fuerza y carrera en una sola app, sin suscripción. Registras una serie con un toque y ves sobre un cuerpo qué músculos trabajaste, en vez de una lista de números. Las carreras traen GPS, parciales y ritmo ajustado por pendiente. Todo se calcula en el teléfono. El video de arriba lo hice con Remotion.'
        : 'Strength and running in a single app, no subscription. You log a set with one tap and see on a body which muscles you worked, instead of a list of numbers. Runs come with GPS, splits and slope-adjusted pace. Everything is computed on the phone. The video above was made with Remotion.',
      etiquetas: ['SwiftUI', 'SwiftData', 'iOS 26'],
      imagenes: [
        { src: img('hyb-entreno'), alt: 'Hybrid: entreno' },
        { src: img('hyb-mapa'), alt: 'Hybrid: carrera con mapa' },
        { src: img('hyb-stats'), alt: 'Hybrid: estadísticas' },
        { src: img('hyb-sesion'), alt: 'Hybrid: resumen de sesión' },
        { src: img('hyb-historial'), alt: 'Hybrid: historial' },
        { src: img('hyb-perfil'), alt: 'Hybrid: perfil' },
      ],
      video: { src: VIDEO_HYBRID, poster: POSTER_HYBRID, autoplay: true },
      portada: img('hyb-entreno'),
      ancho: 1060,
    },
    dec: {
      id: 'dec',
      kicker: es ? 'Sitio web · en producción' : 'Website · live',
      titulo: 'Pure Decants',
      texto: es
        ? 'Muestrario de perfumes para un emprendimiento real. El visitante arma su bandeja de decants y manda el pedido por WhatsApp; el dueño administra el catálogo desde su propio panel.'
        : 'A perfume showcase for a real small business. Visitors build their tray of decants and send the order over WhatsApp; the owner manages the catalog from their own panel.',
      etiquetas: es ? ['Next.js', 'Tailwind', 'Exportación estática'] : ['Next.js', 'Tailwind', 'Static export'],
      enlace: { url: 'https://pure-decants.vercel.app/', etiqueta: es ? 'Ver el sitio' : 'Visit the site' },
      imagenes: [],
      ancho: 640,
    },
    fre: {
      id: 'fre',
      kicker: es ? 'Sitio de exportación · en producción' : 'Export website · live',
      titulo: 'Global Fish',
      texto: es
        ? 'Sitio de una exportadora de pulpo y camarón congelados de la Isla de Margarita. Cuenta el recorrido del producto, del mar al puerto, y la cotización se pide por WhatsApp: sin carrito y sin intermediarios. Diseño propio, pensado para que un comprador entienda en segundos qué se vende y cómo pedirlo.'
        : 'Website for a frozen octopus and shrimp exporter from Margarita Island. It tells the product route from sea to port, and quotes are requested over WhatsApp: no cart, no middlemen. Custom design, built so a buyer understands in seconds what is sold and how to order.',
      etiquetas: es ? ['Diseño propio', 'WhatsApp', 'Vercel'] : ['Custom design', 'WhatsApp', 'Vercel'],
      enlace: { url: 'https://global-fish.vercel.app/', etiqueta: es ? 'Ver el sitio' : 'Visit the site' },
      imagenes: [],
      ancho: 640,
    },
    age: {
      id: 'age',
      kicker: es ? 'Ingeniería de IA' : 'AI engineering',
      titulo: es ? 'Resultados sobresalientes con IA' : 'Outstanding results with AI',
      texto: es
        ? 'No me limito a usar IA: la dirijo. Yo pongo la dirección de diseño y la arquitectura; el trabajo se reparte entre subagentes (uno inventaría el proyecto en solo lectura, otros sacan capturas en paralelo); reviso todo antes de publicar y dejo el contexto por escrito para no perderlo. Dos ejemplos que puedes ver aquí: el video de Hybrid, hecho con Remotion, y esta misma mesa, que construí con Claude a partir de una idea y una dirección de arte mías, decidiendo yo qué se quedaba y qué no.'
        : 'I do not just use AI: I direct it. I set the design direction and the architecture; the work is split across subagents (one inventories the project read-only, others take screenshots in parallel); I review everything before it ships and keep the context written down so it is not lost. Two examples you can see here: the Hybrid video, made with Remotion, and this very desk, which I built with Claude from my own idea and art direction, deciding what stayed and what did not.',
      etiquetas: es
        ? ['Dirección con IA', 'Subagentes', 'Revisión humana', 'Remotion']
        : ['AI direction', 'Subagents', 'Human review', 'Remotion'],
      imagenes: [],
      video: { src: VIDEO_HYBRID, poster: POSTER_HYBRID, autoplay: false },
      ancho: 1060,
    },
  };
}

/** Orden en el que se listan los proyectos en el modo lista */
export const ORDEN_PROYECTOS: IdProyecto[] = ['alm', 'hyb', 'dec', 'fre', 'age'];

/** Posición de cada pieza sobre la mesa */
export const PIEZAS: DefinicionPieza[] = [
  { id: 'alm', izq: 5, arr: 150, ancho: 340, alto: 490, rotacion: -3, cx: 0.28, cy: 660 },
  { id: 'hyb', izq: 69, arr: 120, ancho: 340, alto: 490, rotacion: 2.5, cx: 0.72, cy: 900 },
  { id: 'dec', izq: 27, arr: 600, ancho: 250, alto: 330, rotacion: -2, cx: 0.28, cy: 1140 },
  { id: 'fre', izq: 48, arr: 640, ancho: 240, alto: 340, rotacion: 3, cx: 0.72, cy: 1210 },
  { id: 'age', izq: 70.5, arr: 640, ancho: 340, alto: 200, rotacion: -2, cx: 0.5, cy: 1450 },
  { id: 'car', izq: 6, arr: 700, ancho: 310, alto: 190, rotacion: 4, cx: 0.5, cy: 1625 },
];
