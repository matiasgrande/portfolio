import type { NextConfig } from 'next';

// En producción el sitio vive en https://matiasgrande.github.io/portfolio/ (GitHub Pages)
const enProduccion = process.env.NODE_ENV === 'production';
const rutaBase = enProduccion ? '/portfolio' : '';

const configuracion: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: rutaBase,
  assetPrefix: rutaBase,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: rutaBase },
};

export default configuracion;
