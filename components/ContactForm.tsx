"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Formulario de contacto (DESIGN.md § Components → "Formulario de
 * contacto"). No se ve como formulario: reusa la silueta de fila —
 * hairline arriba, Label fija de 100px a la izquierda, valor fluido a la
 * derecha — que ya usan capacidades y "En curso" (`.hr-row`). Cada campo
 * lleva `data-reveal="row"`, el mismo atributo que esas filas, así que
 * entra con la coreografía que ya existe en components/SiteMotion.tsx (la
 * engancha por atributo, no por selector de estructura — no hace falta
 * tocar ese archivo).
 *
 * Envío: Web3Forms (PRODUCT.md § Capabilities and Constraints). El sitio es
 * un export estático sin servidor propio, así que el POST va directo al
 * endpoint de terceros. Se manda como `FormData` (no JSON): es el contrato
 * que la documentación oficial de Web3Forms cubre, evita mantener a mano el
 * mapeo campo-por-campo, y hace que el honeypot `botcheck` viaje solo por
 * estar en el markup.
 *
 * hCaptcha: el usuario lo activó en su panel de Web3Forms, así que el
 * endpoint ahora RECHAZA cualquier envío sin `h-captcha-response`. Modo
 * invisible (`size="invisible"`) y no el widget visible: el widget trae su
 * propia caja con logo, radio y paleta — exactamente el objeto de UI que
 * DESIGN.md § Formulario de contacto evita, y no se puede reestilar por ser
 * un iframe de terceros. Con "invisible" no hay nodo visual que respetar el
 * sistema: se dispara con `execute({ async: true })` recién después de que
 * la validación de campos pasó (no gastar un desafío en un formulario
 * incompleto) y se resetea con `resetCaptcha()` al final de cada intento —
 * un token de hCaptcha es de un solo uso, sin el reset el segundo envío de
 * la sesión falla con un error que parece de red y no lo es.
 *
 * Si el `fetch` falla (sin red, endpoint caído), el endpoint responde
 * `success: false`, o el captcha no entrega token (expira, error, o el
 * usuario lo cierra), el estado de error ofrece un `mailto:` prellenado con
 * los mismos valores como salida real — no solo un texto que nombra la
 * dirección.
 */

// Access key pública de Web3Forms — no es un secreto, viaja en el cliente
// por diseño del servicio (PRODUCT.md § Capabilities and Constraints).
// Generada en web3forms.com, registrada con matiasgrande06@gmail.com: los
// envíos del formulario aterrizan en ese correo.
export const WEB3FORMS_ACCESS_KEY = "364f50da-64ba-4c71-93d4-9f5be7482ef7";

// Sitekey compartida de hCaptcha para el plan gratuito de Web3Forms
// (docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha).
// Pública por el mismo motivo que la access key de arriba: hCaptcha valida
// del lado del servidor con el secret de Web3Forms, no con este sitekey.
const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

const EMAIL = "matiasgrande06@gmail.com";

// Formato de correo suficiente para validación de cliente (no es el
// validador exhaustivo de RFC 5322 — esto solo atrapa errores de tipeo
// obvios antes de gastar la cuota de envíos de Web3Forms; el servidor de
// destino es un buzón real, no un sistema que dependa de este regex).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = { name?: string; email?: string; message?: string };

export function ContactForm() {
  const { t } = useLanguage();
  const captchaRef = useRef<HCaptcha>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  // Valores del último intento fallido — alimentan el `mailto:` de
  // recuperación. No hace falta un state por campo controlado: el error
  // solo LEE esto, nunca repinta los inputs (siguen siendo no controlados).
  const [lastValues, setLastValues] = useState({ name: "", email: "", message: "" });

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrorId = `${nameId}-error`;
  const emailErrorId = `${emailId}-error`;
  const messageErrorId = `${messageId}-error`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Se guarda la CLAVE del diccionario, no el texto ya traducido: si se
    // guardara el texto, un error visible quedaría congelado en el idioma que
    // estaba activo al fallar la validación, y togglear idioma cambiaría toda
    // la página menos ese mensaje. Traducir al renderizar lo mantiene atado al
    // idioma actual, igual que el resto del formulario.
    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "contact.form.errorRequired";
    if (!email) nextErrors.email = "contact.form.errorRequired";
    else if (!EMAIL_RE.test(email)) nextErrors.email = "contact.form.errorEmail";
    if (!message) nextErrors.message = "contact.form.errorRequired";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setLastValues({ name, email, message });
    setStatus("sending");

    // El botón se queda en "enviando" durante TODO este bloque: el desafío
    // invisible de hCaptcha es espera real (puede tardar, puede fallar), no
    // un trámite instantáneo — el usuario no puede quedar mirando un botón
    // inerte mientras tanto.
    try {
      if (!captchaRef.current) {
        setStatus("error");
        return;
      }

      let token: string;
      try {
        // `Promise.race` con un plazo, y no un `await` pelado: leyendo el
        // bundle de @hcaptcha/react-hcaptcha, TODO el cuerpo de
        // `resetCaptcha()` está detrás de un `isReady()` (`isApiReady &&
        // !isRemoved`), incluida la única llamada a `_cancelPendingExecute()`
        // — que es lo que resuelve la promesa pendiente de `execute()`. Si el
        // script de hCaptcha nunca llegó a cargar, `isApiReady` queda en
        // false, `resetCaptcha()` es un no-op completo, y la promesa de
        // `execute()` espera para siempre un `_onReady` que no va a llegar.
        //
        // No es un caso de laboratorio: `js.hcaptcha.com` está en las listas
        // de bloqueo de uBlock, Brave Shields y Privacy Badger, y en muchos
        // firewalls corporativos. Ese visitante llena el formulario, aprieta
        // Enviar, y el botón se queda en "Enviando…" hasta que recargue la
        // página — sin mensaje, sin `mailto:` de recuperación, sin nada.
        //
        // El plazo convierte ese cuelgue en el estado de error normal, que sí
        // ofrece salida por correo. 20s es holgado para un desafío real
        // resuelto a mano (hCaptcha da 120s para responderlo, pero acá el modo
        // es invisible: si aparece un desafío visual, el usuario lo resuelve o
        // lo cierra, y cerrarlo dispara `onClose` → `resetCaptcha()`, que en
        // ese punto SÍ está listo y cancela la promesa antes del plazo).
        const result = await Promise.race([
          captchaRef.current.execute({ async: true }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("hcaptcha-timeout")), 20_000),
          ),
        ]);
        token = result.response;
      } catch {
        // Rechazo del captcha: expiró, el usuario lo cerró, o falló su
        // propio script. Los tres casos llegan acá porque onExpire/onClose/
        // onError (abajo, en el JSX) llaman resetCaptcha(), y resetCaptcha()
        // es lo único que cancela la promesa pendiente de execute() — sin
        // esa llamada el await de arriba cuelga para siempre.
        setStatus("error");
        return;
      }

      data.set("subject", `Portfolio — mensaje de ${name}`);
      data.set("from_name", name);
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("h-captcha-response", token);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json: { success?: boolean } | null = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      // Un token de hCaptcha es de un solo uso. Sin este reset, un segundo
      // envío en la misma sesión vuelve con un error del lado de hCaptcha
      // que se ve idéntico a un fallo de red pero no lo es. Corre siempre —
      // envío exitoso, rechazado, o captcha nunca resuelto — así el próximo
      // intento arranca limpio.
      captchaRef.current?.resetCaptcha();
    }
  }

  const mailtoHref =
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(`Portfolio — mensaje de ${lastValues.name}`)}` +
    `&body=${encodeURIComponent(`${lastValues.message}\n\n${lastValues.email}`)}`;

  // contact.form.error ya nombra la dirección en texto plano, en los dos
  // idiomas ("...matiasgrande06@gmail.com."). Se parte la traducción en ese
  // punto para convertir solo la dirección en un link con el mailto: real,
  // sin hardcodear una segunda copia del mensaje ni pedir una clave nueva
  // al diccionario (que no se puede tocar en esta tarea).
  const errorText = t("contact.form.error");
  const errorParts = errorText.split(EMAIL);
  const [errorPre, errorPost] = [errorParts[0] ?? errorText, errorParts[1] ?? ""];

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot anti-spam de Web3Forms. Oculto de lectores de pantalla y
          del tabulado sin `display: none`: la consigna pide que quede fuera
          de pantalla (clip) en vez de simplemente ausente del layout, así
          que la técnica es "visually hidden" (.contact-form__honeypot en
          globals.css) + tabIndex -1 + aria-hidden. Un bot que llena todos
          los campos sin mirar CSS lo completa igual, y eso es justo lo que
          lo delata. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="contact-form__honeypot"
      />

      {/* Invisible: sin tamaño, sin caja, sin logo — no hay nada que
          reconciliar con el sistema visual. onExpire/onClose/onError llaman
          resetCaptcha() para destrabar la promesa pendiente de execute()
          (ver el comentario en handleSubmit); sin eso el await queda
          colgado si el desafío expira o el usuario lo cierra.

          Sin `languageOverride`: el paquete reinicia el widget entero
          (`removeCaptcha` + `renderCaptcha`) cada vez que esa prop cambia
          de valor (ver `componentDidUpdate` en la librería) — atarla a
          `locale` reiniciaría el captcha en cada toggle de idioma,
          cancelando de paso cualquier `execute()` en curso. El idioma del
          desafío en sí (que casi nadie ve, al ser invisible) no vale ese
          riesgo. */}
      <HCaptcha
        ref={captchaRef}
        sitekey={HCAPTCHA_SITEKEY}
        size="invisible"
        reCaptchaCompat={false}
        onExpire={() => captchaRef.current?.resetCaptcha()}
        onClose={() => captchaRef.current?.resetCaptcha()}
        onError={() => captchaRef.current?.resetCaptcha()}
      />

      <div className="flex flex-col">
        <div
          className="hr-row flex flex-row items-baseline gap-[var(--space-3)]"
          data-reveal="row"
        >
          <label htmlFor={nameId} className="text-label w-[100px] shrink-0">
            {t("contact.form.nameLabel")}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            className="contact-form__field text-body"
            placeholder={t("contact.form.namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? nameErrorId : undefined}
          />
        </div>
        {errors.name && (
          <p id={nameErrorId} className="text-label contact-form__error">
            {t(errors.name)}
          </p>
        )}

        <div
          className="hr-row flex flex-row items-baseline gap-[var(--space-3)]"
          data-reveal="row"
        >
          <label htmlFor={emailId} className="text-label w-[100px] shrink-0">
            {t("contact.form.emailLabel")}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            className="contact-form__field text-body"
            placeholder={t("contact.form.emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? emailErrorId : undefined}
          />
        </div>
        {errors.email && (
          <p id={emailErrorId} className="text-label contact-form__error">
            {t(errors.email)}
          </p>
        )}

        <div
          className="hr-row flex flex-row items-start gap-[var(--space-3)]"
          data-reveal="row"
        >
          {/* items-start y no items-baseline (a diferencia de nombre/correo,
              de una sola línea): contra un textarea de 3 líneas, baseline
              alinea la etiqueta con el borde inferior del control en vez de
              con el renglón de arriba — se lee descolgada. pt fino para que
              el tope del texto Label calce con el tope del texto tipeado. */}
          <label
            htmlFor={messageId}
            className="text-label w-[100px] shrink-0 pt-[3px]"
          >
            {t("contact.form.messageLabel")}
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={3}
            // El tope existe por el `mailto:` de recuperación, no por el
            // formulario: cuando Web3Forms falla, esa URL es la única salida
            // que le queda al visitante, y varios manejadores de `mailto:`
            // —el ShellExecute de Windows entre ellos— truncan o fallan en
            // silencio pasando los ~2000 caracteres. Un mensaje larguísimo
            // rompería la vía de escape justo en el momento en que es lo
            // único que hay. 1500 deja aire para el asunto y la dirección ya
            // codificados en la misma URL.
            maxLength={1500}
            className="contact-form__field contact-form__field--textarea text-body"
            placeholder={t("contact.form.messagePlaceholder")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? messageErrorId : undefined}
          />
        </div>
        {errors.message && (
          <p id={messageErrorId} className="text-label contact-form__error">
            {t(errors.message)}
          </p>
        )}
      </div>

      <button type="submit" className="contact-form__submit text-label" disabled={status === "sending"}>
        {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
      </button>

      {/* Aviso legal que hCaptcha exige mostrar cuando corre en modo
          invisible: sin widget visible, esta línea es lo único que le avisa
          al visitante que hay un tercero mirando el envío. Armado desde
          cuatro claves y no desde una sola frase porque dos fragmentos son
          enlaces — ver el comentario en lib/i18n/locales/es.ts. */}
      <p className="text-label contact-form__legal">
        {t("contact.form.legalIntro")}{" "}
        <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">
          {t("contact.form.legalPrivacy")}
        </a>{" "}
        {t("contact.form.legalAnd")}{" "}
        <a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer">
          {t("contact.form.legalTerms")}
        </a>
        .
      </p>

      {/* Único anuncio de resultado, aria-live="polite": sin esto, quien usa
          lector de pantalla envía y no se entera de nada (reposo/foco los
          cubre el foco nativo, enviando/enviado/error los cubre este
          bloque). aria-atomic para que se lea el bloque entero en cada
          cambio de estado y no solo el fragmento que difiere. */}
      <div aria-live="polite" aria-atomic="true" className="text-label contact-form__status">
        {status === "success" && t("contact.form.success")}
        {status === "error" && (
          <>
            {errorPre}
            <a href={mailtoHref}>{EMAIL}</a>
            {errorPost}
          </>
        )}
      </div>
    </form>
  );
}
