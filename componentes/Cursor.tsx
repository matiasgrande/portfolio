'use client';

import { useEffect, useRef } from 'react';
import { gsap, tienePunteroFino } from '@/lib/gsap';

interface PropsCursor {
  /** Texto que muestra el anillo según el valor de data-cursor del elemento */
  etiquetas: Record<string, string>;
}

/** Anillo que sigue al cursor y se agranda con una etiqueta sobre los elementos interactivos */
export function Cursor({ etiquetas }: PropsCursor) {
  const anillo = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLSpanElement>(null);
  const etiquetasRef = useRef(etiquetas);
  etiquetasRef.current = etiquetas;

  useEffect(() => {
    const el = anillo.current;
    const rotulo = texto.current;
    if (!el || !rotulo || !tienePunteroFino()) return;

    const moverX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const moverY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      el.classList.add('visible');
      moverX(e.clientX);
      moverY(e.clientY);
    };

    const alEntrar = (e: PointerEvent) => {
      const objetivo = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cursor]') : null;
      if (objetivo) {
        rotulo.textContent = etiquetasRef.current[objetivo.dataset.cursor ?? ''] ?? '';
        el.classList.add('activo');
      } else {
        el.classList.remove('activo');
      }
    };

    const alSalirVentana = () => el.classList.remove('visible');

    window.addEventListener('pointermove', alMover, { passive: true });
    window.addEventListener('pointerover', alEntrar, { passive: true });
    document.documentElement.addEventListener('pointerleave', alSalirVentana);
    return () => {
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerover', alEntrar);
      document.documentElement.removeEventListener('pointerleave', alSalirVentana);
    };
  }, []);

  return (
    <div ref={anillo} className="cursor-anillo mono" aria-hidden="true">
      <span ref={texto} />
    </div>
  );
}
