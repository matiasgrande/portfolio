import type { ReactNode } from 'react';

interface PropsLetras {
  texto: string;
  /** Clase de cada letra, para que GSAP las anime */
  clase?: string;
}

/** Parte un texto en palabras y letras (ocultas a lectores de pantalla) para animarlas una por una */
export function Letras({ texto, clase = 'letra' }: PropsLetras): ReactNode {
  const palabras = texto.split(/(\s+)/);
  return palabras.map((trozo, i) => {
    if (/^\s+$/.test(trozo)) return ' ';
    if (trozo === '') return null;
    return (
      <span key={i} className="palabra" aria-hidden="true">
        {Array.from(trozo).map((c, j) => (
          <span key={j} className={clase}>
            {c}
          </span>
        ))}
      </span>
    );
  });
}

interface PropsPalabras {
  texto: string;
}

/** Parte un texto en palabras, cada una dentro de una máscara que la deja subir al aparecer */
export function Palabras({ texto }: PropsPalabras): ReactNode {
  return texto.split(/\s+/).map((p, i, todas) => (
    <span key={i} aria-hidden="true">
      <span className="linea" style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <span className="palabra-sube linea-interior" style={{ display: 'inline-block' }}>
          {p}
        </span>
      </span>
      {i < todas.length - 1 ? ' ' : ''}
    </span>
  ));
}
