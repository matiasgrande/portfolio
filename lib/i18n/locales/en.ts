import type { Dict } from "../types";

// Shell strings (nav pill, skip link) + content for the 7 site sections
// (hero / bio / manifesto / work / capabilities / ongoing / contact). Keys
// in this file and es.ts must be identical.
//
// No pending placeholders: the user supplied the thesis topic, the AI focus
// and his social URLs on 2026-08-04. If a fact the user hasn't given ever
// comes up again, it goes in as `[...pending]` with a TODO here — never
// invented.
export const en: Dict = {
  "nav.skip": "Skip to content",
  "nav.ariaLabel": "Main navigation",
  "nav.name": "Matías Grande",
  "toggle.aria": "Cambiar idioma / Switch language",
  "toggle.es": "ES",
  "toggle.en": "EN",

  // 1 — Hero
  "hero.name": "Matías Grande",
  "hero.role": "Systems Engineering — development with a focus on AI",
  "hero.cta": "Get in touch",

  // 2 — Bio
  "bio.heading": "Systems engineer, steps from graduating.",
  "bio.p1":
    "I'm studying Systems Engineering and about to graduate. My work is moving toward development with a focus on artificial intelligence — a direction I'm declaring, not a title I already hold.",
  "bio.p2":
    "The concrete proof I have today is having taken a product end to end: design, build, and continuous deploy. Frescura del Mar is live; this site is the second one.",
  "bio.portraitAlt":
    "Portrait of Matías Grande, facing the camera with a serious expression, bathed in navy blue light.",

  // 3 — Manifesto. Split into three so the key phrase can carry Navy
  // (DESIGN.md § Colors: "the word that carries the weight in a headline"
  // is one of the four sanctioned uses of the accent) without hardcoding
  // text or breaking the word-by-word reveal.
  "manifesto.pre":
    "I design, build, and ship real software — and I'm pointing that craft toward",
  "manifesto.highlight": "artificial intelligence",
  "manifesto.post": ".",

  // 4 — Work
  "work.heading": "Work",
  "work.frescura.name": "Frescura del Mar",
  "work.frescura.meta": "Export landing — in production",
  "work.frescura.body":
    "A bilingual site for a seafood exporter, no cart or backend: one conversion, open WhatsApp with the message already written. Own design, GSAP, CI/CD to GitHub Pages on every push.",
  "work.frescura.cta": "View the live site",
  "work.frescura.imageAltDesktop":
    "Desktop screenshot of the Frescura del Mar homepage, showing the export route diagram and the design system's navy and coral palette.",
  "work.frescura.imageAltMobile":
    "Mobile screenshot of the same Frescura del Mar homepage.",
  "work.portfolio.name": "This portfolio",
  "work.portfolio.meta": "Personal portfolio — in production",
  "work.portfolio.body":
    "The site you're looking at: Next.js with static export, GSAP, bilingual ES/EN, and CI/CD to GitHub Pages on every push to main. It's its own work sample.",
  "work.portfolio.imageAlt":
    "Screenshot of this portfolio hero: the name Matías Grande set in large-scale type on a bone background.",

  // 5 — Capabilities
  "capabilities.heading": "Capabilities",
  "capabilities.row1.name": "Frontend engineering",
  "capabilities.row1.tag1": "Next.js",
  "capabilities.row1.tag2": "React",
  "capabilities.row1.tag3": "TypeScript",
  "capabilities.row2.name": "Motion & interaction",
  "capabilities.row2.tag1": "GSAP",
  "capabilities.row2.tag2": "ScrollTrigger",
  // SplitText, not DrawSVGPlugin — see the note on the Spanish dictionary:
  // this site presents itself as its own work sample, so every capability
  // listed has to be demonstrated in it.
  "capabilities.row2.tag3": "SplitText",
  "capabilities.row3.name": "Design systems",
  "capabilities.row3.tag1": "Tokens",
  "capabilities.row3.tag2": "Tailwind CSS",
  "capabilities.row3.tag3": "Fluid type",
  "capabilities.row4.name": "Internationalization",
  "capabilities.row4.tag1": "ES / EN",
  "capabilities.row4.tag2": "Typed dictionaries",
  "capabilities.row4.tag3": "No backend",
  "capabilities.row5.name": "Deploy & CI/CD",
  "capabilities.row5.tag1": "GitHub Actions",
  "capabilities.row5.tag2": "GitHub Pages",
  "capabilities.row5.tag3": "Static export",

  // 6 — In progress
  "ongoing.heading": "In progress",
  "ongoing.thesis.label": "Thesis",
  "ongoing.thesis.value": "Hospital blood bank management",
  "ongoing.thesis.body":
    "It's a web application for the blood bank at Hospital Clínicas del Este. It covers donor recruitment and automatic email notifications during emergencies. It also covers traceability of blood components, from intake through transfusion use.",
  "ongoing.ai.label": "AI focus",
  "ongoing.ai.value": "Development assisted by AI agents",
  "ongoing.ai.body":
    "I use AI agents to write code and automate development tasks, while I keep the design direction and the final check on the result. Frescura del Mar and this portfolio, both listed under Work, are built that way. Generic output gets rejected, not shipped.",

  // 7 — Contact
  "contact.heading": "Let's talk.",
  "contact.body": "If any of this is useful to you, write.",
  "contact.form.nameLabel": "Name",
  "contact.form.namePlaceholder": "Your name",
  "contact.form.emailLabel": "Email",
  "contact.form.emailPlaceholder": "you@email.com",
  "contact.form.messageLabel": "Message",
  "contact.form.messagePlaceholder": "Tell me what you're thinking",
  "contact.form.submit": "Send",
  "contact.form.sending": "Sending…",
  "contact.form.success": "Got it. I'll get back to you soon.",
  "contact.form.error":
    "Couldn't send it. Email me directly at matiasgrande06@gmail.com.",
  "contact.form.errorRequired": "This field can't be empty.",
  "contact.form.errorEmail": "Check the email format.",
  // Legal notice hCaptcha requires when it runs in invisible mode. Split
  // across four keys rather than one sentence because two fragments are
  // links: a single string would need a placeholder and a parser to put them
  // back, and the word order differs between languages.
  "contact.form.legalIntro": "Protected by hCaptcha —",
  "contact.form.legalPrivacy": "Privacy",
  "contact.form.legalAnd": "and",
  "contact.form.legalTerms": "Terms",
  "contact.social.linkedin": "Matías Grande on LinkedIn",
  "contact.social.email": "Email Matías Grande",
  "contact.social.instagram": "Matías Grande on Instagram",
  "contact.social.github": "Matías Grande on GitHub",
  "contact.signOff": "Matías Grande — 2026",
};
