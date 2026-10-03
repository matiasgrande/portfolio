'use client';

import { useEffect, useState } from 'react';

export interface Medidas {
  ancho: number;
  movil: boolean;
  /** Escala de las piezas */
  k: number;
  /** Alto del escenario en píxeles */
  alto: number;
  /** Escala del teléfono 3D */
  kTel: number;
  /** Centro del teléfono dentro del escenario */
  telCx: number;
  telCy: number;
  /** Posición vertical de la pista debajo del teléfono */
  pistaTop: number;
  /** Factor vertical del diseño móvil */
  f: number;
}

export const UMBRAL_MOVIL = 760;
const MEDIA_ALTO_TEL = 275.5;

/** Calcula el diseño de la mesa según el ancho de la ventana */
export function calcularMedidas(ancho: number): Medidas {
  const movil = ancho <= UMBRAL_MOVIL;
  const kEscritorio = Math.min(1, Math.max(0.62, ancho / 1280));
  const kMovil = Math.min(0.68, (0.62 * ancho) / 390);
  const f = kMovil / 0.62;
  const k = movil ? kMovil : kEscritorio;
  const kTel = movil ? Math.min(0.95, (0.78 * ancho) / 390) : kEscritorio;
  const telCy = movil ? 285 * f : 365.5;
  return {
    ancho,
    movil,
    k,
    alto: movil ? Math.round(1780 * f) : 1000,
    kTel,
    telCx: movil ? ancho / 2 : ancho * 0.41 + 130,
    telCy,
    pistaTop: Math.round(telCy + MEDIA_ALTO_TEL * kTel + 16),
    f,
  };
}

/** Hook que vuelve a calcular las medidas cuando cambia el tamaño de la ventana */
export function useMedidas(): Medidas {
  // Se arranca con un ancho de escritorio para que servidor y cliente coincidan
  const [medidas, setMedidas] = useState<Medidas>(() => calcularMedidas(1440));

  useEffect(() => {
    let cuadro = 0;
    const actualizar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => setMedidas(calcularMedidas(window.innerWidth)));
    };
    setMedidas(calcularMedidas(window.innerWidth));
    window.addEventListener('resize', actualizar);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener('resize', actualizar);
    };
  }, []);

  return medidas;
}
