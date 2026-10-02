import type { ImageLoaderProps } from "next/image";

// Loader estático para el export de Pages: no hay servidor de optimización,
// así que servimos el archivo original y solo anteponemos el basePath para
// que /media/... resuelva bajo /portfolio/ en producción. Con
// `images.unoptimized: true` y sin loader propio, el componente de imagen
// renderiza la ruta recibida sin más — no antepone basePath por su cuenta
// (verificado en build: los assets de next/font sí lo llevan vía
// assetPrefix, pero la imagen no). Mismo problema y misma solución que en
// el repo hermano frescura-del-mar (ver su image-loader.ts).
export default function staticLoader({ src }: ImageLoaderProps): string {
  if (/^https?:\/\//.test(src)) return src; // remoto: dejar intacto
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}
