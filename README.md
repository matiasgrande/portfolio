# portfolio-v2 · La Mesa

Portfolio de Matías Grande: una mesa de trabajo oscura con linterna, piezas que se arrastran y se lanzan, y un teléfono 3D real.

## Stack

Next.js (App Router) · React · TypeScript estricto · GSAP + ScrollTrigger · Three.js con React Three Fiber y drei.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm run tipos    # revisión de tipos
```

## Estructura

- `app/` rutas, estilos globales y metadatos.
- `componentes/` interfaz: `Portafolio` (orquesta todo), `Cabecera`, `Mesa`, `Pieza` (arrastre con inercia), `Telefono3D`, `ModalProyecto`, `Contacto`, `Cursor`, `Marquesina`.
- `lib/contenido.ts` **todos los textos ES/EN y los proyectos**: es el único archivo que hay que tocar para cambiar contenido.
- `hooks/` medidas responsivas y efecto imán.
- `public/imagenes` y `public/video` capturas (con datos de ejemplo) y video de Hybrid.

## Easter eggs

- Mueve la linterna: hay cosas escondidas en la oscuridad.
- El interruptor «luz» enciende la mesa.
- Código Konami (↑ ↑ ↓ ↓ ← → ← → B A): cambia el color de acento.

## Notas

- Se respeta `prefers-reduced-motion`.
- Si el navegador no tiene WebGL, el teléfono se muestra como imagen estática.
- El video de Hybrid está en H.264 para que lo reproduzca cualquier navegador.
