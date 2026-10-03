'use client';

import { useRef, type MouseEvent as EventoClic, type PointerEvent as EventoPuntero } from 'react';
import { gsap, useGSAP, prefiereMovimientoReducido, tienePunteroFino } from '@/lib/gsap';
import { useMagnetico } from '@/hooks/useMagnetico';
import type { Textos } from '@/lib/contenido';
import type { Idioma } from '@/lib/tipos';
import { Letras } from './Dividir';

interface PropsCabecera {
  t: Textos;
  idioma: Idioma;
  lista: boolean;
  alCambiarIdioma: (idioma: Idioma) => void;
  alAlternarLista: () => void;
}

export function Cabecera({ t, idioma, lista, alCambiarIdioma, alAlternarLista }: PropsCabecera) {
  const raiz = useRef<HTMLElement>(null);
  const linea1 = useRef<HTMLSpanElement>(null);
  const linea2 = useRef<HTMLSpanElement>(null);
  const mover1 = useRef<((valor: number) => void) | null>(null);
  const mover2 = useRef<((valor: number) => void) | null>(null);
  const refCta = useMagnetico<HTMLAnchorElement>(0.3);

  useGSAP(
    () => {
      if (prefiereMovimientoReducido() || !raiz.current) return;

      // Entrada: las letras suben una a una desde la máscara de su línea
      gsap.fromTo('.letra', { yPercent: 118, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.026, clearProps: 'transform' });
      gsap.fromTo('.entra-cabecera', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.55, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' });

      // Parallax opuesto con el cursor (suavizado)
      if (linea1.current && linea2.current) {
        mover1.current = gsap.quickTo(linea1.current, 'x', { duration: 0.7, ease: 'power3.out' });
        mover2.current = gsap.quickTo(linea2.current, 'x', { duration: 0.7, ease: 'power3.out' });
      }

      // Narrativa de scroll: las dos líneas se abren en direcciones contrarias y el resto se desvanece
      // Se anima un contenedor distinto al de la entrada y con valores iniciales explícitos
      // (immediateRender: false) para que el scrub nunca capture un estado intermedio de la entrada
      const desplazar = () => ({ trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: 0.6 });
      gsap.fromTo('.sc-1', { xPercent: 0 }, { xPercent: -3, immediateRender: false, scrollTrigger: desplazar() });
      gsap.fromTo('.sc-2', { xPercent: 0 }, { xPercent: 3, immediateRender: false, scrollTrigger: desplazar() });
      gsap.fromTo('.cabecera-resto', { y: 0, opacity: 1 }, { y: -40, opacity: 0.1, immediateRender: false, scrollTrigger: desplazar() });
    },
    { scope: raiz, dependencies: [idioma], revertOnUpdate: true },
  );

  // El desplazamiento suave se hace a mano: con scroll-behavior:smooth en CSS, ScrollTrigger.refresh() hace viajes visibles
  const alIrALaMesa = (e: EventoClic<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('mesa')?.scrollIntoView({ behavior: prefiereMovimientoReducido() ? 'auto' : 'smooth' });
  };

  const alMoverRaton = (e: EventoPuntero<HTMLElement>) => {
    if (!tienePunteroFino() || !raiz.current) return;
    const r = raiz.current.getBoundingClientRect();
    const hx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mover1.current?.(hx * -16);
    mover2.current?.(hx * 16);
  };

  return (
    <header ref={raiz} className="cabecera" onPointerMove={alMoverRaton}>
      <div className="cabecera-barra">
        <div className="mono entra-cabecera" style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9A9486' }}>
          {t.eyebrow}
        </div>
        <div className="entra-cabecera" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <button type="button" className="chip" aria-pressed={idioma === 'es'} onClick={() => alCambiarIdioma('es')}>
            ES
          </button>
          <button type="button" className="chip" aria-pressed={idioma === 'en'} onClick={() => alCambiarIdioma('en')}>
            EN
          </button>
          <button type="button" className="chip" onClick={alAlternarLista}>
            {lista ? t.verMesa : t.verLista}
          </button>
        </div>
      </div>

      <div className="cabecera-cuerpo">
        <h1 className="h1" aria-label={t.h1Completo}>
          <span className="linea sc-1">
            <span ref={linea1} className="linea-interior">
              <Letras texto={t.h1a} />
            </span>
          </span>
          <span className="linea sc-2">
            <span ref={linea2} className="linea-interior">
              <Letras texto={t.h1b1} />
              <span className="marcador" aria-hidden="true">
                <Letras texto={t.h1b2} />
              </span>
              <Letras texto={t.h1b3} />
            </span>
          </span>
        </h1>
        <div className="cabecera-resto">
          <p className="sub entra-cabecera">{t.sub}</p>
          <div className="cabecera-acciones entra-cabecera">
            <a ref={refCta} className="cta" href="#mesa" onClick={alIrALaMesa}>
              {t.cta}
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M9 2v13M3 9.5l6 6 6-6" fill="none" stroke="#0B0C0E" strokeWidth="2.4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
