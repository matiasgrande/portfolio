// Espejo en JS/TS de los tokens definidos en app/globals.css. Fuente de
// verdad para cualquier agente que necesite estos valores fuera de CSS
// (matchMedia de GSAP ScrollTrigger, cálculos de layout, etc.). Si cambian
// los valores en globals.css, actualizar acá también — no hay build step
// que los sincronice automáticamente.

export const colors = {
  bone: "#FAF7F3",
  ink: "#111110",
  navy: "#16325C",
  gray: "#6B6B66",
  hairline: "#DEDAD3",
} as const;

// Módulo de espaciado — DESIGN.md § Layout: escala 8/16/24/48/96/160.
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 48,
  xl: 96,
  xxl: 160,
} as const;

// Breakpoints — 640 / 900 / 1280.
export const breakpoints = {
  sm: 640,
  md: 900,
  lg: 1280,
} as const;
