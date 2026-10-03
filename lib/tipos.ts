// Tipos compartidos del portfolio

export type Idioma = 'es' | 'en';

export type IdProyecto = 'alm' | 'hyb' | 'dec' | 'fre' | 'age';

/** Las piezas de la mesa: los cinco proyectos más la tarjeta de contacto */
export type IdPieza = IdProyecto | 'car';

export interface Imagen {
  src: string;
  alt: string;
}

export interface VideoProyecto {
  src: string;
  poster: string;
  /** Si es true, el video arranca apenas se abre el proyecto */
  autoplay: boolean;
}

export interface Proyecto {
  id: IdProyecto;
  kicker: string;
  titulo: string;
  texto: string;
  etiquetas: string[];
  enlace?: { url: string; etiqueta: string };
  imagenes: Imagen[];
  video?: VideoProyecto;
  portada?: string;
  /** Ancho máximo del panel en píxeles */
  ancho: number;
}

export interface DefinicionPieza {
  id: IdPieza;
  /** Posición en escritorio: porcentaje del ancho y píxeles desde arriba */
  izq: number;
  arr: number;
  ancho: number;
  alto: number;
  rotacion: number;
  /** Posición en móvil: centro como fracción del ancho y píxeles base */
  cx: number;
  cy: number;
}
