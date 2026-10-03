import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Los plugins se registran una sola vez, solo en el navegador
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/** Respeta la preferencia del sistema de reducir el movimiento */
export function prefiereMovimientoReducido(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Detecta si el dispositivo tiene un puntero fino (ratón o trackpad) */
export function tienePunteroFino(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

/** Comprueba que el navegador pueda crear un contexto WebGL */
export function soportaWebGL(): boolean {
  try {
    const lienzo = document.createElement('canvas');
    return !!(lienzo.getContext('webgl2') || lienzo.getContext('webgl'));
  } catch {
    return false;
  }
}
