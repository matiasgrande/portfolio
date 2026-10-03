'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useMedidas } from '@/hooks/useMedidas';
import { ScrollTrigger } from '@/lib/gsap';
import { ACENTOS, obtenerProyectos, obtenerTextos } from '@/lib/contenido';
import type { Idioma } from '@/lib/tipos';
import { Cabecera } from './Cabecera';
import { Contacto } from './Contacto';
import { Cursor } from './Cursor';
import { Marquesina } from './Marquesina';
import { Mesa } from './Mesa';
import { ModoLista } from './ModoLista';

const CLAVE_IDIOMA = 'idioma';
const CODIGO_KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function Portafolio() {
  const [idioma, setIdioma] = useState<Idioma>('es');
  const [lista, setLista] = useState(false);
  const [indiceAcento, setIndiceAcento] = useState(0);
  const [aviso, setAviso] = useState(false);
  const medidas = useMedidas();

  const t = useMemo(() => obtenerTextos(idioma), [idioma]);
  const proyectos = useMemo(() => obtenerProyectos(idioma), [idioma]);
  const acento = ACENTOS[indiceAcento % ACENTOS.length] ?? ACENTOS[0];

  // ScrollTrigger recalcula posiciones cuando cambia la altura de la página: al cargar las fuentes,
  // al pasar entre mesa y lista y al redimensionar la mesa
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
  }, []);
  useEffect(() => {
    const cuadro = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(cuadro);
  }, [lista, medidas.alto]);

  // Idioma inicial: el guardado por la persona o, si no hay, el del navegador
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_IDIOMA);
      if (guardado === 'es' || guardado === 'en') {
        setIdioma(guardado);
      } else if (navigator.language.toLowerCase().startsWith('en')) {
        setIdioma('en');
      }
    } catch {
      // El almacenamiento puede estar bloqueado: se queda en español
    }
  }, []);

  const cambiarIdioma = (nuevo: Idioma) => {
    setIdioma(nuevo);
    document.documentElement.lang = nuevo;
    try {
      window.localStorage.setItem(CLAVE_IDIOMA, nuevo);
    } catch {
      // Sin almacenamiento no se recuerda la elección, pero todo sigue funcionando
    }
  };

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Easter egg: el código Konami rota el color de acento de toda la página
  useEffect(() => {
    let avance = 0;
    let temporizador = 0;
    const alTeclear = (e: KeyboardEvent) => {
      const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      avance = tecla === CODIGO_KONAMI[avance] ? avance + 1 : tecla === CODIGO_KONAMI[0] ? 1 : 0;
      if (avance === CODIGO_KONAMI.length) {
        avance = 0;
        setIndiceAcento((i) => i + 1);
        setAviso(true);
        window.clearTimeout(temporizador);
        temporizador = window.setTimeout(() => setAviso(false), 1800);
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      window.clearTimeout(temporizador);
    };
  }, []);

  // Otro secreto para quien abre la consola
  useEffect(() => {
    console.log(
      '%cHola 👋 Si estás leyendo esto, probablemente te guste mirar por dentro. Prueba el código Konami.',
      'font:600 13px ui-monospace,monospace;color:#D2FF3F;background:#0B0C0E;padding:6px 10px;border-radius:4px',
    );
  }, []);

  const estiloRaiz = { ['--acento' as string]: acento } as CSSProperties;

  return (
    <div className="raiz" style={estiloRaiz}>
      <Cursor etiquetas={{ pieza: t.cursorPieza, tarjeta: t.cursorTarjeta, telefono: t.cursorTelefono }} />

      {/* Grano de papel sobre toda la página */}
      <svg aria-hidden="true" className="grano">
        <filter id="grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>

      <Cabecera
        t={t}
        idioma={idioma}
        lista={lista}
        alCambiarIdioma={cambiarIdioma}
        alAlternarLista={() => setLista((v) => !v)}
      />
      <Marquesina texto={t.marquesina} />

      {lista ? (
        <section id="mesa" style={{ position: 'relative', zIndex: 2 }}>
          <ModoLista t={t} proyectos={proyectos} />
        </section>
      ) : (
        <Mesa t={t} proyectos={proyectos} medidas={medidas} acento={acento} />
      )}

      <Contacto t={t} />

      {aviso && <div className="aviso mono">{t.acentoCambiado}</div>}
    </div>
  );
}
