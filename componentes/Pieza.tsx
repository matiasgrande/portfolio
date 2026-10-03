'use client';

import { useEffect, useRef, type PointerEvent as EventoPuntero, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import type { DefinicionPieza } from '@/lib/tipos';

interface PropsPieza {
  def: DefinicionPieza;
  /** Posición inicial en píxeles dentro del escenario */
  izq: number | string;
  arr: number;
  /** Escala según el ancho de pantalla */
  k: number;
  zInicial: number;
  etiqueta: string;
  /** Texto del cursor personalizado */
  claveCursor: string;
  retardoFlote: number;
  alActivar: (id: DefinicionPieza['id'], elemento: HTMLElement) => void;
  children: ReactNode;
}

interface Fisica {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotExtra: number;
  arrastrando: boolean;
  movido: boolean;
  inicio: { x: number; y: number };
  base: { x: number; y: number };
  muestras: { x: number; y: number; t: number }[];
}

// Contador compartido para que la última pieza tocada quede siempre encima
let zTope = 30;

const FRICCION = 0.94;
const UMBRAL_ARRASTRE = 5;
const VELOCIDAD_MINIMA = 0.02;

/** Pieza de la mesa: se arrastra, se lanza con inercia, rebota en los bordes y se abre con un clic */
export function Pieza({ def, izq, arr, k, zInicial, etiqueta, claveCursor, retardoFlote, alActivar, children }: PropsPieza) {
  const ref = useRef<HTMLButtonElement>(null);
  const levanta = useRef<HTMLDivElement>(null);
  const f = useRef<Fisica>({
    x: 0, y: 0, vx: 0, vy: 0, rotExtra: 0, arrastrando: false, movido: false,
    inicio: { x: 0, y: 0 }, base: { x: 0, y: 0 }, muestras: [],
  });
  // La escala puede cambiar al redimensionar la ventana: el bucle lee siempre el valor actual
  const escala = useRef(k);
  escala.current = k;

  const aplicar = () => {
    const el = ref.current;
    if (!el) return;
    const e = f.current;
    el.style.transform = `translate3d(${e.x.toFixed(2)}px,${e.y.toFixed(2)}px,0) rotate(${(def.rotacion + e.rotExtra).toFixed(2)}deg) scale(${escala.current.toFixed(3)})`;
  };

  const limites = () => {
    const el = ref.current;
    const padre = el?.offsetParent;
    if (!el || !(padre instanceof HTMLElement)) return null;
    return {
      minX: -el.offsetLeft - def.ancho * 0.6,
      maxX: padre.clientWidth - el.offsetLeft - def.ancho * 0.4,
      minY: -el.offsetTop - def.alto * 0.4,
      maxY: padre.clientHeight - el.offsetTop - def.alto * 0.35,
    };
  };

  // Bucle de física: inercia tras soltar y rotación según la velocidad
  useEffect(() => {
    const paso = () => {
      const e = f.current;
      const dt = Math.min(gsap.ticker.deltaRatio(), 3);
      const enMovimiento = Math.abs(e.vx) > VELOCIDAD_MINIMA || Math.abs(e.vy) > VELOCIDAD_MINIMA;

      if (!e.arrastrando && enMovimiento) {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        const roce = Math.pow(FRICCION, dt);
        e.vx *= roce;
        e.vy *= roce;
        const lim = limites();
        if (lim) {
          if (e.x < lim.minX) { e.x = lim.minX; e.vx = Math.abs(e.vx) * 0.55; }
          if (e.x > lim.maxX) { e.x = lim.maxX; e.vx = -Math.abs(e.vx) * 0.55; }
          if (e.y < lim.minY) { e.y = lim.minY; e.vy = Math.abs(e.vy) * 0.55; }
          if (e.y > lim.maxY) { e.y = lim.maxY; e.vy = -Math.abs(e.vy) * 0.55; }
        }
      } else if (!e.arrastrando) {
        e.vx = 0;
        e.vy = 0;
      }

      // La pieza se inclina hacia donde la lanzas y vuelve a su ángulo al frenar
      const objetivo = gsap.utils.clamp(-14, 14, e.vx * 0.6);
      const antes = e.rotExtra;
      e.rotExtra += (objetivo - e.rotExtra) * Math.min(0.16 * dt, 1);
      if (e.arrastrando || enMovimiento || Math.abs(antes - e.rotExtra) > 0.01) aplicar();
    };
    gsap.ticker.add(paso);
    return () => gsap.ticker.remove(paso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Coloca la pieza cuando cambian su escala o su posición base
  useEffect(() => {
    aplicar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, izq, arr]);

  const alBajar = (e: EventoPuntero<HTMLButtonElement>) => {
    try {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = ref.current;
      if (!el) return;
      const est = f.current;
      est.arrastrando = true;
      est.movido = false;
      est.inicio = { x: e.clientX, y: e.clientY };
      est.base = { x: est.x, y: est.y };
      est.vx = 0;
      est.vy = 0;
      est.muestras = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      zTope += 1;
      el.style.zIndex = String(zTope);
      el.setPointerCapture(e.pointerId);
      gsap.to(levanta.current, { scale: 1.05, duration: 0.25, ease: 'power2.out' });
    } catch (err) {
      console.warn('No se pudo iniciar el arrastre', err);
    }
  };

  const alMover = (e: EventoPuntero<HTMLButtonElement>) => {
    const est = f.current;
    if (!est.arrastrando) return;
    const ddx = e.clientX - est.inicio.x;
    const ddy = e.clientY - est.inicio.y;
    if (!est.movido && Math.hypot(ddx, ddy) < UMBRAL_ARRASTRE) return;
    est.movido = true;

    const lim = limites();
    est.x = lim ? gsap.utils.clamp(lim.minX, lim.maxX, est.base.x + ddx) : est.base.x + ddx;
    est.y = lim ? gsap.utils.clamp(lim.minY, lim.maxY, est.base.y + ddy) : est.base.y + ddy;

    // Velocidad estimada con las últimas muestras (píxeles por cuadro a 60 fps)
    const ahora = performance.now();
    est.muestras.push({ x: e.clientX, y: e.clientY, t: ahora });
    while (est.muestras.length > 2 && ahora - (est.muestras[0]?.t ?? ahora) > 90) est.muestras.shift();
    const primera = est.muestras[0];
    if (primera && ahora > primera.t) {
      const ms = ahora - primera.t;
      est.vx = ((e.clientX - primera.x) / ms) * 16.7;
      est.vy = ((e.clientY - primera.y) / ms) * 16.7;
    }
    aplicar();
  };

  const alSoltar = (e: EventoPuntero<HTMLButtonElement>) => {
    const est = f.current;
    if (!est.arrastrando) return;
    est.arrastrando = false;
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {
      // El puntero ya se había liberado
    }
    gsap.to(levanta.current, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
    // Si fue un simple toque, no hay lanzamiento
    if (!est.movido) {
      est.vx = 0;
      est.vy = 0;
    } else {
      est.vx = gsap.utils.clamp(-40, 40, est.vx);
      est.vy = gsap.utils.clamp(-40, 40, est.vy);
    }
  };

  const alClic = () => {
    const est = f.current;
    if (est.movido) {
      est.movido = false;
      return;
    }
    if (ref.current) alActivar(def.id, ref.current);
  };

  return (
    <button
      ref={ref}
      type="button"
      className="pieza"
      aria-label={etiqueta}
      data-cursor={claveCursor}
      style={{ left: izq, top: arr, width: def.ancho, height: def.alto, zIndex: zInicial }}
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
      onClick={alClic}
    >
      <div className="entrada" data-entrada>
        <div ref={levanta} className="levanta">
          <div className="flota" style={{ animationDelay: `${retardoFlote.toFixed(1)}s` }}>
            {children}
          </div>
        </div>
      </div>
    </button>
  );
}
