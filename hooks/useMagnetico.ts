'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, tienePunteroFino } from '@/lib/gsap';

/** Hace que un elemento se incline hacia el cursor cuando está cerca (efecto imán) */
export function useMagnetico<T extends HTMLElement>(fuerza = 0.35): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !tienePunteroFino()) return;

    const moverX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const moverY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const alMover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      moverX((e.clientX - (r.left + r.width / 2)) * fuerza);
      moverY((e.clientY - (r.top + r.height / 2)) * fuerza);
    };
    const alSalir = () => {
      moverX(0);
      moverY(0);
    };

    el.addEventListener('pointermove', alMover);
    el.addEventListener('pointerleave', alSalir);
    return () => {
      el.removeEventListener('pointermove', alMover);
      el.removeEventListener('pointerleave', alSalir);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [fuerza]);

  return ref;
}
