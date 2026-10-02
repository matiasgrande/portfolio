"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

/**
 * Nav pill — la firma del sistema nuevo (DESIGN.md § Shapes, § Components).
 * Único elemento con radio en todo el sitio (`border-radius: 999px`), fija
 * arriba y centrada, fondo Tinta, texto Hueso. Contiene el nombre (ancla a
 * la cubierta) y el toggle ES/EN. Sin menú desplegable — el sitio es una
 * sola página con scroll nativo.
 *
 * La contracción al scrollear que pide DESIGN.md la resuelve
 * components/SiteMotion.tsx, que escala la pill ligado a los primeros 240px
 * de scroll. La pill nunca desaparece ni entra con reveal: vive fuera de
 * <main> y no lleva hooks de sección.
 */
export function NavPill() {
  const { t } = useLanguage();

  return (
    <nav className="nav-pill" aria-label={t("nav.ariaLabel")}>
      <a href="#hero" className="nav-pill__name">
        {t("nav.name")}
      </a>
      <LanguageToggle />
    </nav>
  );
}
