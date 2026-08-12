/**
 * Auditoría de accesibilidad sobre el HTML realmente servido.
 *
 * Se audita la SALIDA y no el JSX a propósito: el linter de jsx-a11y no ve lo
 * que compone el layout con la página —encabezados que saltan de h2 a h4 al
 * juntarse dos componentes, un aria-labelledby que apunta a un id que solo
 * existe en otra plantilla— y esos son justo los fallos que llegan al usuario.
 *
 *   npx tsx scripts/auditar-a11y.ts                  # contra el sitio en producción
 *   BASE=http://127.0.0.1:3001 npx tsx scripts/auditar-a11y.ts
 *
 * Sale con código 1 si encuentra algo, para poder encadenarlo a un cron.
 */
import { JSDOM } from "jsdom";

const BASE = process.env.BASE ?? "https://www.tuchat.org";
const RUTAS = [
  "/", "/chat", "/chat/madrid", "/chat/chachipen", "/chat/gay-coruna",
  "/tiempo/madrid", "/noticias", "/ranking",
];

const problemas: string[] = [];
const add = (p: string, m: string) => problemas.push(`${p}: ${m}`);

const nombreAccesible = (el: Element): string =>
  (el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.textContent ||
    (el.querySelector("img")?.getAttribute("alt") ?? "")).trim();

function auditar(ruta: string, html: string) {
  const { document } = new JSDOM(html).window;

  if (!document.documentElement.getAttribute("lang")) add(ruta, "<html> sin atributo lang");

  // Presencia de alt. Que esté VACÍO es correcto y deliberado en las banderas,
  // que van junto al nombre de la sala en texto: repetirlo sería ruido para el
  // lector de pantalla. Lo que se persigue aquí es el alt ausente.
  for (const img of document.querySelectorAll("img")) {
    if (img.getAttribute("alt") === null)
      add(ruta, `<img> sin alt: ${img.getAttribute("src")?.slice(0, 60)}`);
  }

  const sinNombre = [...document.querySelectorAll("a[href]")].filter((a) => !nombreAccesible(a));
  if (sinNombre.length)
    add(ruta, `${sinNombre.length} enlaces sin texto accesible (p.ej. ${sinNombre[0].getAttribute("href")})`);
  const btn = [...document.querySelectorAll("button")].filter((b) => !nombreAccesible(b));
  if (btn.length) add(ruta, `${btn.length} botones sin nombre accesible`);

  for (const inp of document.querySelectorAll("input, select, textarea")) {
    const tipo = inp.getAttribute("type");
    if (tipo === "hidden" || tipo === "submit") continue;
    const id = inp.getAttribute("id");
    const etiquetado =
      (id && document.querySelector(`label[for="${id}"]`)) ||
      inp.closest("label") ||
      inp.getAttribute("aria-label") ||
      inp.getAttribute("aria-labelledby");
    if (!etiquetado) add(ruta, `<${inp.tagName.toLowerCase()}> sin etiqueta (name=${inp.getAttribute("name")})`);
  }

  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  const h1 = hs.filter((h) => h.tagName === "H1");
  if (h1.length !== 1) add(ruta, `${h1.length} <h1> (debe haber exactamente uno)`);
  let previo = 0;
  for (const h of hs) {
    const n = Number(h.tagName[1]);
    if (previo && n > previo + 1)
      add(ruta, `salto de encabezado h${previo} → h${n} en "${h.textContent?.trim().slice(0, 40)}"`);
    previo = n;
  }

  if (!document.querySelector("main")) add(ruta, "sin <main>");
  if (!document.querySelector("nav")) add(ruta, "sin <nav>");
  const salto = [...document.querySelectorAll("a[href^='#']")].some((a) =>
    /salt|conten|principal|skip/i.test(nombreAccesible(a)),
  );
  if (!salto) add(ruta, "sin enlace para saltar al contenido");

  for (const fr of document.querySelectorAll("iframe"))
    if (!fr.getAttribute("title")) add(ruta, "<iframe> sin title");

  for (const el of document.querySelectorAll("[aria-labelledby]"))
    for (const id of el.getAttribute("aria-labelledby")!.split(/\s+/))
      if (!document.getElementById(id)) add(ruta, `aria-labelledby apunta a #${id}, que no existe`);
}

// En una función y no arriba del todo: tsx compila estos scripts a CommonJS y
// el await de nivel superior no le vale.
async function main() {
  let auditadas = 0;
  for (const ruta of RUTAS) {
    const res = await fetch(BASE + ruta);
    if (!res.ok) {
      console.log(`  ⚠ ${ruta} devolvió ${res.status}, no se audita`);
      continue;
    }
    auditar(ruta, await res.text());
    auditadas++;
  }

  console.log(`\n${auditadas} páginas auditadas · ${problemas.length} problemas`);
  for (const p of problemas) console.log("  " + p);
  if (problemas.length) process.exit(1);
}

main();
