"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Enlace "saltar al contenido" — visualmente oculto hasta que recibe foco
 * de teclado. No es parte del contrato visual de DESIGN.md (no aparece en
 * ninguna captura), pero es accesibilidad real de línea de base: sin él,
 * un visitante de teclado tiene que tabular a través de la nav pill en
 * cada carga antes de llegar al contenido.
 */
export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a href="#main" className="skip-link">
      {t("nav.skip")}
    </a>
  );
}
