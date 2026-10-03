import type { Textos } from '@/lib/contenido';
import { ruta } from '@/lib/ruta';

// Cada pieza de la mesa tiene su propio aspecto físico: fotos, tarjeta, etiqueta, terminal...

export function VisualAlmanaque() {
  return (
    <div className="abanico">
      <img className="print p1" src={ruta('/imagenes/alm-tarjetas.webp')} alt="" draggable={false} />
      <img className="print p2" src={ruta('/imagenes/alm-calendario.webp')} alt="" draggable={false} />
      <img className="print p3" src={ruta('/imagenes/alm-noche.webp')} alt="" draggable={false} />
      <div className="cinta" />
      <div className="rotulo" style={{ left: 8, bottom: 6, transform: 'rotate(-4deg)' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '.14em' }}>SWIFTUI · IOS</span>
        <strong>Almanaque</strong>
      </div>
    </div>
  );
}

export function VisualHybrid() {
  return (
    <div className="abanico">
      <img className="print p1" src={ruta('/imagenes/hyb-entreno.webp')} alt="" draggable={false} />
      <img className="print p2" src={ruta('/imagenes/hyb-mapa.webp')} alt="" draggable={false} />
      <img className="print p3" src={ruta('/imagenes/hyb-stats.webp')} alt="" draggable={false} />
      <div className="cinta" style={{ left: 96, transform: 'rotate(2deg)' }} />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: 14, top: -14, zIndex: 7, width: 44, height: 44, borderRadius: '50%',
          background: 'var(--acento)', color: '#0B0C0E', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 8px 18px rgba(0,0,0,.5)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>
      </div>
      <div className="rotulo" style={{ right: 6, bottom: 6, transform: 'rotate(3deg)' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '.14em' }}>SWIFTUI · IOS 26</span>
        <strong>Hybrid</strong>
      </div>
    </div>
  );
}

export function VisualDecants({ t }: { t: Textos }) {
  return (
    <div style={{ position: 'relative', width: 250, height: 330, background: '#ECE6D6', color: '#0B0C0E', padding: 20, boxShadow: '0 22px 44px rgba(0,0,0,.6)', borderRadius: 4 }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em' }}>PURE DECANTS</div>
      <svg viewBox="0 0 80 150" width="84" height="158" aria-hidden="true" style={{ display: 'block', margin: '10px auto 6px' }}>
        <g className="chispa" stroke="#0B0C0E" strokeWidth="2" strokeLinecap="round"><path d="M12 14l-8-4M12 22H2M14 30l-8 4" /></g>
        <rect x="28" y="4" width="24" height="26" rx="3" fill="#0B0C0E" />
        <rect x="31" y="30" width="18" height="8" fill="#0B0C0E" />
        <rect x="35" y="38" width="10" height="14" fill="none" stroke="#0B0C0E" strokeWidth="3" />
        <rect x="12" y="52" width="56" height="94" rx="10" fill="none" stroke="#0B0C0E" strokeWidth="3" />
        <rect x="16" y="84" width="48" height="58" rx="7" fill="var(--acento)" />
        <rect x="24" y="96" width="32" height="32" fill="#ECE6D6" stroke="#0B0C0E" strokeWidth="1.5" />
        <path d="M29 105h22M29 111h22M29 117h14" stroke="#0B0C0E" strokeWidth="1.5" />
      </svg>
      <div style={{ fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 19, lineHeight: 1.08 }}>{t.decTagline}</div>
      <div className="mono" style={{ position: 'absolute', left: 20, bottom: 16, fontSize: 11, letterSpacing: '.1em' }}>NEXT.JS · TAILWIND</div>
    </div>
  );
}

export function VisualGlobalFish({ t }: { t: Textos }) {
  return (
    <div style={{ position: 'relative', width: 240, height: 340 }}>
      <svg aria-hidden="true" width="150" height="110" viewBox="0 0 150 110" style={{ position: 'absolute', left: 70, top: -84 }}>
        <path d="M50 108C48 70 30 40 70 20S120 6 140 2" fill="none" stroke="#B9B2A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0, background: '#CDAE79', color: '#1B140A',
          clipPath: 'polygon(18% 0,82% 0,100% 12%,100% 100%,0 100%,0 12%)',
          boxShadow: '0 22px 44px rgba(0,0,0,.6)', padding: '60px 22px 22px',
        }}
      >
        <div style={{ position: 'absolute', left: '50%', top: 20, width: 22, height: 22, marginLeft: -11, borderRadius: '50%', background: '#0E1013', boxShadow: '0 0 0 4px #E4CB9C' }} />
        <div className="mono" style={{ fontSize: 10, letterSpacing: '.16em' }}>{t.freSub}</div>
        <div style={{ marginTop: 8, fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 34, lineHeight: 0.98, textTransform: 'uppercase' }}>
          Global<br />Fish
        </div>
        <div className="mono" style={{ marginTop: 8, fontSize: 10, letterSpacing: '.12em' }}>PAMPATAR · MARGARITA</div>
        <div style={{ marginTop: 16, display: 'inline-block', border: '3px solid #1B140A', padding: '4px 12px', transform: 'rotate(-8deg)', fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 18, letterSpacing: '.06em' }}>
          IQF −18°C
        </div>
        <div className="mono" style={{ position: 'absolute', left: 22, bottom: 20, fontSize: 11, letterSpacing: '.1em' }}>{t.frePedido}</div>
      </div>
    </div>
  );
}

export function VisualAgente({ t }: { t: Textos }) {
  return (
    <div
      className="mono"
      style={{ width: 340, height: 200, background: '#101216', border: '1px solid #2B3038', borderRadius: 6, boxShadow: '0 22px 44px rgba(0,0,0,.6)', padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: '#C9C4B5' }}
    >
      <div style={{ color: '#7C7A72', fontSize: 11, letterSpacing: '.1em', marginBottom: 6 }}>claude — {t.termTitulo}</div>
      <div className="tipea" style={{ animationDelay: '.2s' }}>$ claude</div>
      <div className="tipea" style={{ animationDelay: '1.4s' }}>&gt; {t.term1}</div>
      <div className="tipea" style={{ animationDelay: '3s' }}>  ├─ {t.term2}</div>
      <div className="tipea" style={{ animationDelay: '4.4s' }}>  └─ {t.term3}</div>
      <div className="tipea" style={{ animationDelay: '5.8s', color: 'var(--acento)' }}>
        ok {t.term4}
        <span className="cursor-parpadeo" />
      </div>
    </div>
  );
}

export function VisualTarjeta({ t, volteada }: { t: Textos; volteada: boolean }) {
  return (
    <div style={{ width: 310, height: 190, perspective: 900 }}>
      <div
        style={{
          position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
          transition: 'transform .8s cubic-bezier(.2,.8,.2,1)',
          transform: volteada ? 'rotateY(180deg)' : 'none',
        }}
      >
        <div className="cara-c" style={{ background: '#ECE6D6', color: '#0B0C0E', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '.16em' }}>ISLA DE MARGARITA · VE</div>
          <div>
            <div style={{ fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 30, lineHeight: 1 }}>Matías Grande</div>
            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.3 }}>{t.tCargo}</div>
          </div>
        </div>
        <div
          className="cara-c mono"
          style={{ background: '#15171B', color: '#ECE6D6', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 9, fontSize: 12, lineHeight: 1.3, border: '1px solid #2B3038' }}
        >
          <div>matiasgrande06@gmail.com</div>
          <div>github.com/matiasgrande</div>
          <div>instagram.com/matiasgrander_</div>
          <div>linkedin.com/in/matias-grande-114b88215</div>
        </div>
      </div>
    </div>
  );
}
