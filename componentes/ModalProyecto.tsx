'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, prefiereMovimientoReducido } from '@/lib/gsap';
import type { Textos } from '@/lib/contenido';
import type { Proyecto } from '@/lib/tipos';

interface PropsModal {
  proyecto: Proyecto;
  t: Textos;
  /** Rectángulo de la pieza de la que sale la ventana, para animar desde ahí */
  origen: DOMRect | null;
  alCerrar: () => void;
}

/** Ventana de proyecto: crece desde la pieza que se pulsó y vuelve a ella al cerrar */
export function ModalProyecto({ proyecto, t, origen, alCerrar }: PropsModal) {
  const panel = useRef<HTMLDivElement>(null);
  const fondo = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cerrando = useRef(false);

  // Calcula el desplazamiento y la escala para que el panel parezca nacer de la pieza
  const desdeOrigen = useCallback((): gsap.TweenVars => {
    const el = panel.current;
    if (!el || !origen) return { opacity: 0, y: 30, scale: 0.94 };
    const r = el.getBoundingClientRect();
    return {
      x: origen.left + origen.width / 2 - (r.left + r.width / 2),
      y: origen.top + origen.height / 2 - (r.top + r.height / 2),
      scale: Math.max(0.18, Math.min(origen.width / r.width, origen.height / r.height)),
      opacity: 0,
    };
  }, [origen]);

  // Apertura
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reducido = prefiereMovimientoReducido();
    if (!reducido) {
      gsap.fromTo(fondo.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(el, desdeOrigen(), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'expo.out' });
      gsap.fromTo(el.querySelectorAll('[data-revela]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.25, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
    botonCerrar.current?.focus({ preventScroll: true });

    // El video de Hybrid arranca apenas se abre; si el navegador bloquea el sonido, sigue en silencio
    const v = video.current;
    if (v && proyecto.video?.autoplay) {
      const intento = v.play();
      if (intento) {
        intento.catch(() => {
          v.muted = true;
          v.play().catch(() => undefined);
        });
      }
    }
    return () => {
      gsap.killTweensOf([el, fondo.current, ...Array.from(el.querySelectorAll('[data-revela]'))]);
    };
    // Solo al montar: cada proyecto crea su propia instancia del modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cierre animado: el panel vuelve a la pieza y luego se desmonta
  const cerrar = useCallback(() => {
    const el = panel.current;
    if (cerrando.current) return;
    cerrando.current = true;
    video.current?.pause();
    if (!el || prefiereMovimientoReducido()) {
      alCerrar();
      return;
    }
    gsap.to(fondo.current, { opacity: 0, duration: 0.35 });
    gsap.to(el, { ...desdeOrigen(), duration: 0.5, ease: 'power3.in', onComplete: alCerrar });
  }, [alCerrar, desdeOrigen]);

  // Esc cierra; el scroll de la página se bloquea mientras la ventana está abierta
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    window.addEventListener('keydown', alTeclear);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
    };
  }, [cerrar]);

  const tieneGaleria = proyecto.imagenes.length > 0;
  const tieneIzquierda = tieneGaleria || !!proyecto.video;

  // El modal se monta en la raíz de la página (no dentro de la mesa) para quedar por encima de todas las secciones
  // y conservar las variables de color de acento, que viven en .raiz
  const destino = document.querySelector<HTMLElement>('.raiz') ?? document.body;

  return createPortal(
    <div className="modal-fijo" role="dialog" aria-modal="true" aria-label={proyecto.titulo}>
      <button ref={fondo} type="button" className="modal-fondo" aria-label={t.cerrar} onClick={cerrar} />
      <div ref={panel} className="panel" style={{ maxWidth: proyecto.ancho }}>
        {tieneIzquierda && (
          <div className={`panel-izq${tieneGaleria ? '' : ' solo-video'}`} data-revela>
            {proyecto.video && (
              <video
                ref={video}
                src={proyecto.video.src}
                poster={proyecto.video.poster}
                controls
                playsInline
                preload="auto"
              />
            )}
            {tieneGaleria && (
              <>
                <div className="galeria" style={{ ['--alto' as string]: `${proyecto.video ? 400 : 560}px` }}>
                  {proyecto.imagenes.map((im) => (
                    <img key={im.src} src={im.src} alt={im.alt} loading="lazy" />
                  ))}
                </div>
                <div className="mono nota-ejemplo">{t.ejemplo}</div>
              </>
            )}
          </div>
        )}
        <div className="panel-der">
          <div className="mono panel-kicker" data-revela>{proyecto.kicker}</div>
          <h3 className="panel-titulo" data-revela>{proyecto.titulo}</h3>
          <p className="panel-texto" data-revela>{proyecto.texto}</p>
          <div className="etiquetas" data-revela>
            {proyecto.etiquetas.map((e) => (
              <span key={e} className="etiqueta-tag">{e}</span>
            ))}
          </div>
          {proyecto.enlace && (
            <a className="cta" href={proyecto.enlace.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 32 }} data-revela>
              {proyecto.enlace.etiqueta}
            </a>
          )}
        </div>
      </div>
      <button ref={botonCerrar} type="button" className="chip modal-cerrar" onClick={cerrar}>
        {t.cerrar}
      </button>
    </div>,
    destino,
  );
}
