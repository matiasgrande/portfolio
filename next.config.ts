import type { NextConfig } from "next";

// GitHub Pages sirve el sitio bajo /<repo>/. En producción prefijamos rutas
// y assets con ese basePath; en dev local queda en la raíz. Mismo patrón
// que frescura-del-mar (repo hermano, mismo stack y mismo deploy).
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/portfolio" : "";

const nextConfig: NextConfig = {
  output: "export", // exporta HTML/CSS/JS estático a ./out
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // /ruta -> /ruta/index.html (amigable con Pages)
  images: {
    // Pages no corre el optimizador de Next: loader estático que sirve el
    // archivo original y le antepone el basePath (ver image-loader.ts).
    // `unoptimized: true` a secas NO alcanza: el componente de imagen
    // renderiza la ruta tal cual llega, sin el prefijo /portfolio que sí
    // reciben los assets de next/font vía assetPrefix — las imágenes
    // rompían en producción. Mismo fix que frescura-del-mar.
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
  // Exponer el basePath al cliente por si algún asset se referencia a mano.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
