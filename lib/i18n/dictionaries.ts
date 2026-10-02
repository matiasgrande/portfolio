import type { Dict, Locale } from "./types";
import { es } from "./locales/es";
import { en } from "./locales/en";

export const dictionaries: Record<Locale, Dict> = { es, en };

export function t(dict: Dict, key: string): string {
  return dict[key] ?? key;
}

export type { Dict, Locale };
