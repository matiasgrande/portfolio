"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Toggle ES/EN. Muestra el idioma AL QUE se cambiaría (mismo patrón que
 * frescura-del-mar): en "es" muestra "EN", en "en" muestra "ES".
 * Sin contenido de secciones — solo el mecanismo de cambio de idioma.
 */
export function LanguageToggle() {
  const { locale, toggle, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle.aria")}
      className="language-toggle"
    >
      {locale === "es" ? t("toggle.en") : t("toggle.es")}
    </button>
  );
}
