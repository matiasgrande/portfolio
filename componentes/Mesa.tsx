'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type PointerEvent as EventoPuntero } from 'react';
import { gsap, useGSAP, prefiereMovimientoReducido, soportaWebGL } from '@/lib/gsap';
import type { Medidas } from '@/hooks/useMedidas';
import { PIEZAS, type Textos } from '@/lib/contenido';
import type { IdPieza, IdProyecto, Proyecto } from '@/lib/tipos';
import type { PunteroNormalizado } from './Telefono3D';
import { ruta } from '@/lib/ruta';
import { ModalProyecto } from './ModalProyecto';
import { Pieza } from './Pieza';
import { VisualAgente, VisualAlmanaque, VisualDecants, VisualGlobalFish, VisualHybrid, VisualTarjeta } from './visuales';

// Three.js solo se descarga en el navegador y cuando la mesa se monta
const Telefono3D = dynamic(() => import('./Telefono3D'), { ssr: false });

interface PropsMesa {
  t: Textos;
  proyectos: Record<IdProyecto, Proyecto>;
  medidas: Medidas;
  acento: string;
}

interface Abierto {
  id: IdProyecto;
  origen: DOMRect | null;
}

const BASE_LIENZO_ANCHO = 440;
const BASE_LIENZO_ALTO = 640;

export function Mesa({ t, proyectos, medidas, acento }: PropsMesa) {
  const { ancho, movil, k, alto, kTel, telCx, telCy, pistaTop, f } = medidas;

  const raiz = useRef<HTMLElement>(null);
  const interior = useRef<HTMLDivElement>(null);
  const puntero = useRef<PunteroNormalizado>({ x: 0, y: 0 });
  const sobreTelefono = useRef(false);
  const luz = useRef({ objX: 0, objY: 0, x: 0, y: 0, lista: false });

  const [abierto, setAbierto] = useState<Abierto | null>(null);
  const [girado, setGirado] = useState(false);
  const [volteada, setVolteada] = useState(false);
  const [lampara, setLampara] = useState(false);
  const [telVisible, setTelVisible] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(soportaWebGL());
  }, []);

  // La linterna sigue al cursor con un pequeño retraso, como si pesara
  useEffect(() => {
    const el = interior.current;
    if (!el) return;
    const l = luz.current;
    const paso = () => {
      if (!l.lista) return;
      const dx = l.objX - l.x;
      const dy = l.objY - l.y;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      l.x += dx * 0.2;
      l.y += dy * 0.2;
      el.style.setProperty('--lx', `${l.x.toFixed(1)}px`);
      el.style.setProperty('--ly', `${l.y.toFixed(1)}px`);
    };
    gsap.ticker.add(paso);
    return () => gsap.ticker.remove(paso);
  }, []);

  // Solo se dibuja el 3D mientras el escenario está en pantalla
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setTelVisible(true);
      return;
    }
    const observador = new IntersectionObserver(([entrada]) => setTelVisible(!!entrada?.isIntersecting), { rootMargin: '120px' });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Entrada con el scroll: las piezas caen sobre la mesa una tras otra
  useGSAP(
    () => {
      if (prefiereMovimientoReducido()) return;
      gsap.fromTo(
        '[data-entrada]',
        { y: 110, scale: 0.86, rotate: (i: number) => (i % 2 ? 7 : -7), opacity: 0 },
        {
          y: 0, scale: 1, rotate: 0, opacity: 1,
          duration: 1.15,
          stagger: 0.13,
          ease: 'back.out(1.25)',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: raiz.current, start: 'top 72%', once: true },
        },
      );
      gsap.fromTo(
        '.tel-caja',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1.3,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: raiz.current, start: 'top 72%', once: true },
        },
      );
    },
    { scope: raiz },
  );

  const alMoverPuntero = useCallback((e: EventoPuntero<HTMLDivElement>) => {
    const el = interior.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const l = luz.current;
    l.objX = x;
    l.objY = y;
    if (!l.lista) {
      l.x = x;
      l.y = y;
      l.lista = true;
    }
    puntero.current.x = (x / r.width) * 2 - 1;
    puntero.current.y = (y / r.height) * 2 - 1;
  }, []);

  const alActivar = useCallback((id: IdPieza, elemento: HTMLElement) => {
    if (id === 'car') {
      setVolteada((v) => !v);
      return;
    }
    setAbierto({ id, origen: elemento.getBoundingClientRect() });
  }, []);

  const colocar = (def: (typeof PIEZAS)[number]) => ({
    izq: movil ? Math.round(def.cx * ancho - def.ancho / 2) : `${def.izq}%`,
    arr: movil ? Math.round(def.cy * f - def.alto / 2) : def.arr,
  });

  const contenidoPieza = (id: IdPieza) => {
    switch (id) {
      case 'alm': return <VisualAlmanaque />;
      case 'hyb': return <VisualHybrid />;
      case 'dec': return <VisualDecants t={t} />;
      case 'fre': return <VisualGlobalFish t={t} />;
      case 'age': return <VisualAgente t={t} />;
      case 'car': return <VisualTarjeta t={t} volteada={volteada} />;
    }
  };

  const etiquetaPieza = (id: IdPieza): string => {
    switch (id) {
      case 'alm': return t.ariaAlm;
      case 'hyb': return t.ariaHyb;
      case 'dec': return t.ariaDec;
      case 'fre': return t.ariaFre;
      case 'age': return t.ariaAge;
      case 'car': return t.ariaCar;
    }
  };

  const proyectoAbierto = abierto ? proyectos[abierto.id] : null;
  const lienzoAncho = BASE_LIENZO_ANCHO * kTel;
  const lienzoAlto = BASE_LIENZO_ALTO * kTel;

  return (
    <section ref={raiz} id="mesa" style={{ position: 'relative', zIndex: 2 }}>
      <div className="mesa-cabecera">
        <h2 className="h2">{t.mesaTitulo}</h2>
        <p className="mono mesa-hint">{t.mesaHint}</p>
      </div>

      <div className="escenario" style={{ height: alto }}>
        <div ref={interior} className="escenario-interior" onPointerMove={alMoverPuntero} onPointerDown={alMoverPuntero}>
          {/* Secretos: solo aparecen bajo la luz */}
          <div className={`secretos${lampara ? ' encendida' : ''}`}>
            <div className="secretos-capa">
              <div className="mano sec-1" style={{ left: '31%', top: 830, transform: 'rotate(-3deg)' }}>{t.s1}</div>
              <div className="mano sec-2" style={{ left: '60.5%', top: 360, transform: 'rotate(-6deg)' }}>← {t.s2}</div>
              <div className="mono sec-3" style={{ position: 'absolute', left: '3%', top: 944, fontSize: 12, letterSpacing: '.04em', color: '#9A9486' }}>{t.s3}</div>
              <div className="sec-4" style={{ position: 'absolute', left: '83%', top: 850, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--acento)' }}>
                <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
                  <circle cx="23" cy="23" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M23 2v12M23 32v12M2 23h12M32 23h12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className="mono" style={{ fontSize: 12, letterSpacing: '.1em' }}>10°57′N<br />63°51′O</div>
              </div>
              <svg className="sec-5" aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', left: '57%', top: 770, opacity: 0.7 }}>
                <circle cx="60" cy="60" r="44" fill="none" stroke="#7A5C3C" strokeWidth="5" />
                <circle cx="60" cy="60" r="38" fill="none" stroke="#7A5C3C" strokeWidth="1.5" strokeDasharray="40 14" />
              </svg>
              <button type="button" className="interruptor sec-6" aria-label={t.ariaLuz} onClick={() => setLampara((v) => !v)} style={{ left: '93.5%', top: 900, zIndex: 3 }}>
                <svg width="40" height="22" viewBox="0 0 40 22" aria-hidden="true">
                  <rect x="1" y="1" width="38" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="11" cy="11" r="6" fill="currentColor" />
                </svg>
                <span className="mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>{t.luz}</span>
              </button>
            </div>
          </div>

          {/* Teléfono 3D real */}
          <div
            className="tel-caja"
            style={{ left: telCx - lienzoAncho / 2, top: telCy - lienzoAlto / 2, width: lienzoAncho, height: lienzoAlto }}
          >
            <div className="tel-sombra" />
            <div className="tel-lienzo">
              {webgl ? (
                <Telefono3D puntero={puntero} girado={girado} sobre={sobreTelefono} acento={acento} visible={telVisible} />
              ) : (
                <div className="tel-estatico">
                  <img src={ruta('/imagenes/tel-alm.webp')} alt="Almanaque" />
                </div>
              )}
            </div>
            <button
              type="button"
              className="tel-btn"
              aria-label={t.ariaTel}
              data-cursor="telefono"
              style={{ left: '20.45%', top: '6.95%', width: '59.1%', height: '86.1%', inset: 'auto', position: 'absolute' }}
              onClick={() => setGirado((g) => !g)}
              onPointerEnter={() => { sobreTelefono.current = true; }}
              onPointerLeave={() => { sobreTelefono.current = false; }}
            />
          </div>
          <div className="mono tel-pista" style={{ left: telCx - 130, top: pistaTop }}>{t.girarHint}</div>

          {/* Piezas arrastrables */}
          {PIEZAS.map((def, n) => {
            const { izq, arr } = colocar(def);
            return (
              <Pieza
                key={def.id}
                def={def}
                izq={izq}
                arr={arr}
                k={k}
                zInicial={10 + n}
                etiqueta={etiquetaPieza(def.id)}
                claveCursor={def.id === 'car' ? 'tarjeta' : 'pieza'}
                retardoFlote={-n * 1.7}
                alActivar={alActivar}
              >
                {contenidoPieza(def.id)}
              </Pieza>
            );
          })}

          {/* Oscuridad con linterna */}
          <div className={`oscuridad${lampara ? ' apagada' : ''}`} />

          {/* Ventana de proyecto */}
          {abierto && proyectoAbierto && (
            <ModalProyecto
              key={abierto.id}
              proyecto={proyectoAbierto}
              t={t}
              origen={abierto.origen}
              alCerrar={() => setAbierto(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
