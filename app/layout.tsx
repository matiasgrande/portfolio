import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/syne';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/caveat';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matías Grande · Ingeniero de Sistemas e Ingeniero de IA',
  description:
    'Portfolio de Matías Grande: apps, sitios y productos completos, de la interfaz a la base de datos, construidos dirigiendo a la IA.',
  authors: [{ name: 'Matías Grande' }],
  openGraph: {
    title: 'Matías Grande · Ingeniero de Sistemas e Ingeniero de IA',
    description: 'Una mesa de trabajo interactiva con mis proyectos.',
    type: 'website',
    locale: 'es_VE',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0E',
  width: 'device-width',
  initialScale: 1,
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
