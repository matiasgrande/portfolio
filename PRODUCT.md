# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tres audiencias que llegan al mismo sitio con lecturas distintas:

1. **Reclutadores tech** — screening de candidatos junior/semi-senior. Escanean en menos de un minuto: stack, evidencia de que algo llegó a producción, forma de contacto. Estado mental: filtrando volumen, buscando razones para descartar.
2. **Empresas de IA / ML** — buscan señal específica de trabajo con LLMs, agentes, RAG o modelos. No les alcanza con web development. Estado mental: escépticos de quien se autodenomina "AI Developer" sin artefactos.
3. **Clientes freelance** — PyMEs o founders que necesitan una web o un producto. Quieren ver trabajo terminado y capacidad de ejecución punta a punta.

Acción primaria común a las tres: **contactar a Matías**.

## Product Purpose

Portfolio personal de Matías Grande, próximo a graduarse de Ingeniería de Sistemas, posicionándose como desarrollador con foco en IA. El sitio existe para convertir una visita fría en una conversación. Éxito = el visitante entiende qué hace Matías, ve al menos una prueba concreta, y escribe.

## Positioning

Ingeniero de sistemas recién graduado que ya puso un producto en producción — no un estudiante con ejercicios de clase. La diferencia defendible hoy es **ejecución punta a punta demostrable**: diseño, build, deploy y CI/CD de un sitio real, público y verificable.

El posicionamiento como "AI Developer" es una **intención declarada, no un hecho probado todavía**. Ver Evidence on Hand.

## Operating Context

- El visitante llega desde LinkedIn, un CV, o un link enviado en una postulación. Casi nunca por búsqueda orgánica.
- Sesión corta, probablemente en desktop para reclutadores y en mobile para el resto.
- Se compara implícitamente contra otros portfolios de junior devs, que en su mayoría son plantillas.

## Capabilities and Constraints

- **Deploy:** GitHub Pages. Implica static export — sin server, sin API routes, sin base de datos.
- **Contacto:** formulario propio + iconos de redes. El static export no tiene backend, así que el envío lo hace **Web3Forms** (endpoint de terceros, plan gratuito de 250 envíos/mes) y aterriza en el Gmail del usuario. Decisión del usuario el 2026-08-04, sobre Formspree y `mailto:` puro. La `access_key` es **pública por diseño**: identifica el buzón de destino, no autentica al que envía, así que vive en el cliente y en el repo público sin ser una filtración. Lo que sí implica es que cualquiera puede usarla para mandar correo a esa bandeja — esconderla no es una defensa posible en un sitio estático, así que la defensa es el captcha. El usuario activó **hCaptcha** en el panel el 2026-08-04, lo que lo vuelve obligatorio: el endpoint rechaza cualquier envío sin token. Se implementa en modo **invisible** (sitekey compartida del plan gratuito `50b2fe65-b00b-4b9e-ad62-3ba471098be2`, token en el campo `h-captcha-response`) para no meter una caja de marca ajena en un formulario sin cajas. Si el envío falla —red, captcha no resuelto, endpoint caído— el submit degrada a `mailto:` prellenado: el formulario nunca queda sin salida.
- **Idioma:** bilingüe español / inglés, con toggle, mismo patrón que frescura-del-mar.
- **Stack:** Next.js static export + GSAP (regla global del usuario para todo motion).
- **Email:** matiasgrande06@gmail.com
- **Handle GitHub:** matiasgrande
- **Redes:** LinkedIn, Instagram, GitHub y correo, como iconos SVG. Todos con destino real, provistos por el usuario el 2026-08-04: `linkedin.com/in/matias-grande-114b88215`, `instagram.com/matiasgrander_`, `github.com/matiasgrande`, `matiasgrande06@gmail.com`.

## Brand Commitments

- **Acento:** navy blue. Constraint fijado por el usuario.
- **Tono:** sobrio y profesional. Sin humor, sin informalidad forzada.
- **Prioridad declarada:** el scroll es lo que debe hacer especial al sitio. El recorrido vertical es el vehículo narrativo, no un contenedor de secciones.
- **Anti-referencia:** el sitio NO debe leerse como plantilla de portfolio genérico.

## Evidence on Hand

**Real y verificable:**
- **Frescura del Mar** — landing de exportadora de mariscos en producción. Repo público, live en `https://matiasgrande.github.io/frescura-del-mar`. Incluye: diseño propio (no plantilla), GSAP motion, i18n ES/EN, diagramas isométricos SVG dibujados a medida, favicon y emblema, WCAG AA corregido, CI/CD a GitHub Pages. Es el único caso completo disponible.
- **Retrato del usuario** — disponible. Dos versiones en `public/media/`: `matias-bw.jpg` (blanco y negro) y `matias-color.jpg` (bañado en Navy), 800×1072, generadas con Higgsfield (`nano_banana_pro`, img2img preservando identidad) a partir de fotos reales que el usuario entregó en `Imagenes_Matias/`. Es su cara real, no una identidad fabricada. Alimentan las dos caras de la tarjeta 3D de Bio.

- **Tesis de grado** — tema confirmado por el usuario el 2026-08-04: aplicación web para la gestión operativa del banco de sangre del Hospital Clínicas del Este. Tres ejes reales: captación de donantes, notificaciones automáticas por email en emergencias, y trazabilidad de hemocomponentes desde la recepción hasta el uso transfusional. **En desarrollo, sin artefacto público** — se enuncia como trabajo en curso, nunca como entregado. No hay stack confirmado, ni fecha, ni estado de avance: no inventarlos.
- **Práctica de desarrollo asistido por IA** — verificable en los dos sitios que ya están en el portfolio (Frescura del Mar y este mismo sitio), construidos con agentes de IA bajo dirección de diseño y verificación del usuario. Es evidencia de **cómo trabaja**, no de haber construido sistemas de IA.

**Declarado pero aún no disponible — NO fabricar:**
- **Artefactos de IA propios** — no existe ningún producto con LLMs, agentes, RAG ni modelos entrenados por el usuario. El posicionamiento como "AI Developer" en el sentido de construir IA sigue sin respaldo material: lo que sí hay es la práctica de arriba, y esa es la que se muestra.
- **Testimonios / clientes / métricas** — no existen. Prohibido inventarlos.

## Product Principles

1. **Una prueba real vale más que cinco casillas llenas.** Con un solo proyecto, la estructura debe profundizar en vez de multiplicar. Nada de grillas con huecos.
2. **No prometer lo que no se puede mostrar.** Lo aspiracional se enuncia como dirección, nunca como logro.
3. **El scroll es el argumento.** El recorrido debe construir convicción progresiva, no listar secciones.
4. **Escaneable en 30 segundos, profundo si se queda.** El reclutador apurado y el que lee entero deben salir ambos satisfechos.
5. **El sitio es su propia muestra de trabajo.** Es el segundo proyecto del portfolio, aunque no aparezca listado.

## Accessibility & Inclusion

- WCAG AA en contraste y foco, mismo estándar aplicado en frescura-del-mar.
- `prefers-reduced-motion` respetado sin excepción — regla global del usuario, crítica dado que el scroll es el eje del diseño.
- Bilingüe ES/EN con `lang` correcto por idioma.
