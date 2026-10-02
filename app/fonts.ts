import { Schibsted_Grotesk } from "next/font/google";

// The One Voice Rule (DESIGN.md § Typography): una sola familia tipográfica
// en todo el sitio, sin excepción — ni mono para datos, ni serif para
// acentos. Toda la jerarquía (Display 900 a Label 500) vive en estos cinco
// pesos de Schibsted Grotesk. Variable sufijada `-src` para que el token
// `--font-sans` en globals.css componga la pila con fallback sin
// referencia circular.
export const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-sans-src",
  display: "swap",
});
