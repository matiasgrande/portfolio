/** Prefijo de despliegue (p. ej. "/portfolio" en GitHub Pages). Vacío en desarrollo. */
export const RUTA_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Antepone el prefijo de despliegue a una ruta absoluta de /public */
export function ruta(destino: string): string {
  return `${RUTA_BASE}${destino}`;
}
