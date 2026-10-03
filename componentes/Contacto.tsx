'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefiereMovimientoReducido } from '@/lib/gsap';
import { useMagnetico } from '@/hooks/useMagnetico';
import { CORREO, REDES, type Textos } from '@/lib/contenido';
import { Palabras } from './Dividir';
import { IconoGitHub, IconoInstagram, IconoLinkedIn } from './IconosRedes';

interface PropsContacto {
  t: Textos;
}

export function Contacto({ t }: PropsContacto) {
  const raiz = useRef<HTMLElement>(null);
  const refCta = useMagnetico<HTMLAnchorElement>(0.3);
  const refGit = useMagnetico<HTMLAnchorElement>(0.45);
  const refLin = useMagnetico<HTMLAnchorElement>(0.45);
  const refIns = useMagnetico<HTMLAnchorElement>(0.45);

  // Las palabras del título suben al entrar en pantalla y lo demás aparece después
  useGSAP(
    () => {
      if (prefiereMovimientoReducido()) return;
      const linea = gsap.timeline({ scrollTrigger: { trigger: raiz.current, start: 'top 70%', once: true } });
      linea
        .fromTo('.palabra-sube', { yPercent: 115, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.09, clearProps: 'transform' })
        .fromTo('.entra-contacto', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' }, '-=0.5');
    },
    { scope: raiz, dependencies: [t.contactoTitulo], revertOnUpdate: true },
  );

  return (
    <section ref={raiz} id="contacto" className="contacto">
      <div style={{ maxWidth: 1328, margin: '0 auto' }}>
        <h2 className="contacto-titulo" aria-label={t.contactoTitulo}>
          <Palabras texto={t.contactoTitulo} />
        </h2>
        <p className="contacto-sub entra-contacto">{t.contactoSub}</p>
        <div className="contacto-acciones entra-contacto">
          <a ref={refCta} className="cta" href={`mailto:${CORREO}`}>
            {t.contactoCta}
          </a>
          <a className="mono enlace" href={`mailto:${CORREO}`} style={{ fontSize: 15, display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>
            {CORREO}
          </a>
        </div>
        <div className="redes entra-contacto">
          <a ref={refGit} className="red" href={REDES.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <IconoGitHub />
          </a>
          <a ref={refLin} className="red" href={REDES.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <IconoLinkedIn />
          </a>
          <a ref={refIns} className="red" href={REDES.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <IconoInstagram />
          </a>
        </div>
        <div className="mono pie">
          <span>© 2026 Matías Grande</span>
          <span>{t.pie}</span>
        </div>
      </div>
    </section>
  );
}
