'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefiereMovimientoReducido } from '@/lib/gsap';

interface PropsMarquesina {
  texto: string;
}

/** Cinta con el stack que corre sola y se acelera según la velocidad del scroll */
export function Marquesina({ texto }: PropsMarquesina) {
  const caja = useRef<HTMLDivElement>(null);
  const cinta = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cinta.current || prefiereMovimientoReducido()) return;
      const desplazamiento = gsap.to(cinta.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });

      const disparador = ScrollTrigger.create({
        trigger: caja.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // La velocidad del scroll empuja la cinta y luego vuelve a su ritmo
          const impulso = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
          gsap.to(desplazamiento, {
            timeScale: 1 + Math.abs(impulso),
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(desplazamiento, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
            },
          });
        },
      });
      return () => disparador.kill();
    },
    { scope: caja },
  );

  return (
    <div ref={caja} className="marquesina-caja">
      <div ref={cinta} className="marquesina mono">
        <span>{texto}</span>
        <span>{texto}</span>
        <span>{texto}</span>
        <span>{texto}</span>
      </div>
    </div>
  );
}
