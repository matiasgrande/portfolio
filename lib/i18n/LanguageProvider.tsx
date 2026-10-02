"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Locale } from "./types";
import { dictionaries, t as translate } from "./dictionaries";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

// Clave propia: GitHub Pages sirve /portfolio y /frescura-del-mar bajo el
// mismo origen (matiasgrande.github.io), y localStorage es por origen, no
// por ruta — una clave compartida con frescura-del-mar pisaría su locale.
const STORAGE_KEY = "mg-portfolio-locale";
const DEFAULT_LOCALE: Locale = "es";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // localStorage puede TIRAR, no solo devolver null: Safari con almacenamiento
  // bloqueado y cualquier navegador con cookies deshabilitadas lanzan al
  // tocarlo. Sin el try/catch la excepción sube desde el efecto y se lleva la
  // página entera — el sitio es un export estático sin `error.tsx`, así que lo
  // que se ve es la pantalla de error de Next, no el portfolio. El idioma
  // guardado es una comodidad; que falle tiene que degradar al default, no
  // tumbar el sitio.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    // El render extra que `react-hooks/set-state-in-effect` quiere evitar es
    // acá el mecanismo, no el defecto: el sitio es un export estático, el HTML
    // servido nace SIEMPRE en DEFAULT_LOCALE, y el idioma guardado solo se
    // puede leer cuando ya hay `window`. Lo que impide que ese segundo render
    // se vea es el hold de app/layout.tsx, que mantiene el body oculto hasta
    // que este commit pasó. La corrección que la regla sugiere —inicializar el
    // `useState` leyendo localStorage— rompe la hidratación: React compararía
    // texto en inglés contra el español del HTML servido y tiraría un mismatch
    // por cada nodo traducido.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "es" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    // El hold (LOCALE_HOLD en app/layout.tsx, `.locale-hold body` en
    // globals.css) solo se agrega cuando el guardado difiere del default —
    // acá se saca bajo la misma condición. Al montar, este efecto corre
    // primero con `locale` todavía en su valor inicial DEFAULT_LOCALE (el
    // useEffect de arriba, que lee localStorage y puede cambiarlo, corre en
    // la misma tanda pero el cambio de estado que dispara no se refleja acá
    // hasta la commit SIGUIENTE) — así que la condición de abajo no se
    // cumple todavía y no hay destape prematuro con texto en español. Recién
    // se cumple cuando `locale` ya vale lo guardado, y React solo vuelve a
    // correr este efecto DESPUÉS de que el DOM ya renderizó con el
    // diccionario correspondiente: el destape cae en el mismo commit en que
    // el texto ya cambió, nunca antes. Si no había hold (guardado "es", o
    // nada guardado), esto es un no-op inofensivo.
    if (locale !== DEFAULT_LOCALE) {
      document.documentElement.classList.remove("locale-hold");
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // Mismo motivo que arriba, pero este camino corre en cada click del
    // toggle, no solo al montar: el idioma igual cambia en pantalla, lo único
    // que se pierde es recordarlo entre visitas.
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* almacenamiento no disponible — el cambio de idioma no se persiste */
    }
  }, []);

  const toggle = useCallback(
    () => setLocale(locale === "es" ? "en" : "es"),
    [locale, setLocale]
  );

  const t = useCallback((key: string) => translate(dictionaries[locale], key), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
