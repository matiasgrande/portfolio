'use client';

import { useCallback, useState } from 'react';
import type { Textos } from '@/lib/contenido';
import { ORDEN_PROYECTOS } from '@/lib/contenido';
import type { IdProyecto, Proyecto } from '@/lib/tipos';
import { ModalProyecto } from './ModalProyecto';

interface PropsLista {
  t: Textos;
  proyectos: Record<IdProyecto, Proyecto>;
}

interface Abierto {
  id: IdProyecto;
  origen: DOMRect | null;
}

/** La versión rápida: todos los proyectos en una lista legible */
export function ModoLista({ t, proyectos }: PropsLista) {
  const [abierto, setAbierto] = useState<Abierto | null>(null);

  // Un proyecto tiene vista previa si trae fotos o video
  const tienePrevia = (p: Proyecto) => p.imagenes.length > 0 || !!p.video;

  const abrir = useCallback((id: IdProyecto, elemento: HTMLElement) => {
    setAbierto({ id, origen: elemento.getBoundingClientRect() });
  }, []);

  const proyectoAbierto = abierto ? proyectos[abierto.id] : null;

  return (
    <div className="lista">
      <h2 className="h2" style={{ marginBottom: 32 }}>{t.listaTitulo}</h2>
      {ORDEN_PROYECTOS.map((id) => {
        const p = proyectos[id];
        const previa = tienePrevia(p);
        const etiquetaPrevia = p.imagenes.length > 0 ? t.verDetalle : t.verVideo;
        return (
          <article key={id} className="lista-item">
            <div className="lista-portada">
              {p.portada &&
                (previa ? (
                  <button
                    type="button"
                    className="lista-portada-btn"
                    aria-label={`${etiquetaPrevia}: ${p.titulo}`}
                    onClick={(e) => abrir(id, e.currentTarget)}
                  >
                    <img src={p.portada} alt="" />
                    {p.video && (
                      <span className="play" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7-4.5z" fill="currentColor" /></svg>
                      </span>
                    )}
                  </button>
                ) : (
                  <img src={p.portada} alt="" />
                ))}
            </div>
            <div className="lista-cuerpo">
              <div className="mono panel-kicker">{p.kicker}</div>
              <h3 className="lista-titulo">{p.titulo}</h3>
              <p className="lista-texto">{p.texto}</p>
              <div className="etiquetas" style={{ marginTop: 18 }}>
                {p.etiquetas.map((e) => (
                  <span key={e} className="etiqueta-tag">{e}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                {previa && (
                  <button type="button" className="cta" onClick={(e) => abrir(id, e.currentTarget)}>
                    {etiquetaPrevia}
                  </button>
                )}
                {p.enlace && (
                  <a className="cta" href={p.enlace.url} target="_blank" rel="noopener noreferrer">
                    {p.enlace.etiqueta}
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {/* Vista previa con todas las fotos y el video, igual que en la mesa */}
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
  );
}
