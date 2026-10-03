import type { Textos } from '@/lib/contenido';
import { ORDEN_PROYECTOS } from '@/lib/contenido';
import type { IdProyecto, Proyecto } from '@/lib/tipos';

interface PropsLista {
  t: Textos;
  proyectos: Record<IdProyecto, Proyecto>;
}

/** La versión rápida: todos los proyectos en una lista legible */
export function ModoLista({ t, proyectos }: PropsLista) {
  return (
    <div className="lista">
      <h2 className="h2" style={{ marginBottom: 32 }}>{t.listaTitulo}</h2>
      {ORDEN_PROYECTOS.map((id) => {
        const p = proyectos[id];
        return (
          <article key={id} className="lista-item">
            <div className="lista-portada">
              {p.portada && <img src={p.portada} alt="" />}
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
              {p.enlace && (
                <a className="cta" href={p.enlace.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24 }}>
                  {p.enlace.etiqueta}
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
