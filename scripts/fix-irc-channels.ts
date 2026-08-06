/**
 * Reescribe los `channels` de países y ciudades contra los canales que existen
 * de verdad en la red ChatZona.
 *
 * El problema: muchas salas entraban a un canal inventado con su propio nombre
 * (#miami, #cancun) o a un alias con guion que la red no usa (#estados-unidos,
 * #costa-rica, #cataluna sin ñ). Ese canal se crea vacío al entrar, así que el
 * usuario aterrizaba solo en vez de caer donde está la gente (#usa, #mexico,
 * #cataluña).
 *
 * Reglas (dictadas por el cliente, que conoce la red):
 *   - Un canal geográfico solo se conserva si aparece en el /LIST real
 *     (sql/data/irc_channels_listing.json de chatzonacom) o está en
 *     VERIFIED_EXTRA: canales que existen aunque el /LIST no los pille por
 *     estar vacíos en ese momento.
 *   - Los nombres se canonizan a como los escribe la red: #cataluña con ñ,
 *     #costa_rica con guion bajo, #usa en vez de #estados-unidos.
 *   - Ciudad: sus canales geográficos reales (ciudad/provincia/región) + los de
 *     su país. Sin canal propio inventado.
 *   - País de Latinoamérica: el suyo + #latinoamerica.
 *   - País europeo o del resto del mundo: #internacional + #ocio.
 *   - Sin #amistad: es un canal temático real y popular, pero no aporta nada
 *     geográfico a una sala de ciudad (mismo criterio que el fix de España).
 *   - #chatzona siempre al final: es el canal de red.
 *
 * Las salas temáticas NO se tocan aquí.
 *
 *   npx tsx scripts/fix-irc-channels.ts [--check]
 */
import fs from "node:fs";
import path from "node:path";
// La tabla de canales y la canonización viven en src/data/irc-canal.ts, para
// que este script y el cron de salas (scripts/cron/salas-geo.mjs) usen las
// mismas reglas. Tenerlas duplicadas ya causó un fallo: el cron publicó doce
// salas mandando a canales inexistentes.
import { COUNTRY_CHANNEL, NETWORK_CHANNEL, canon, geoCanon } from "../src/data/irc-canal";

const FILES = ["src/data/countries.ts", "src/data/cities.ts", "src/data/cities-world.ts"];

const NETWORK = NETWORK_CHANNEL;

// ── Reescritura ───────────────────────────────────────────────────────────────
const check = process.argv.includes("--check");
let changed = 0;
const samples: string[] = [];

for (const file of FILES) {
  const abs = path.join(process.cwd(), file);
  const lines = fs.readFileSync(abs, "utf8").split("\n");
  let slug = "";
  let parent = "";

  for (let i = 0; i < lines.length; i++) {
    const mSlug = /^\s*slug: "([^"]+)"/.exec(lines[i]);
    if (mSlug) {
      slug = mSlug[1];
      parent = "";
      continue;
    }
    const mParent = /^\s*parentSlug: "([^"]+)"/.exec(lines[i]);
    if (mParent) {
      parent = mParent[1];
      continue;
    }

    const mCh = /^(\s*)channels: \[([^\]]*)\],\s*$/.exec(lines[i]);
    if (!mCh) continue;

    const indent = mCh[1];
    const current = mCh[2]
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);

    const country = COUNTRY_CHANNEL[slug] ? slug : parent;
    // Sin país conocido (temáticas coladas en estos ficheros): no se toca.
    if (!COUNTRY_CHANNEL[country]) continue;

    const out: string[] = [];
    const push = (c: string) => {
      if (c && !out.includes(c)) out.push(c);
    };

    if (COUNTRY_CHANNEL[slug]) {
      // Sala de país.
      COUNTRY_CHANNEL[slug].forEach(push);
    } else {
      // Sala de ciudad: primero su propio canal, si la red lo tiene (#miami,
      // #toledo, #quito existen; #nueva-york no). Luego los que ya arrastraba y
      // sean reales (provincia, región), canonizados. Los inventados caen.
      const own = geoCanon(slug);
      if (own) push(own);
      for (const c of current) {
        if (c === NETWORK || c === "amistad") continue;
        const real = canon(c);
        if (real) push(real);
      }
      COUNTRY_CHANNEL[country].forEach(push);
    }
    push(NETWORK);

    const next = `${indent}channels: [${out.map((c) => `"${c}"`).join(", ")}],`;
    if (next !== lines[i]) {
      changed++;
      if (samples.length < 12) samples.push(`  ${slug.padEnd(22)} [${current.join(", ")}] → [${out.join(", ")}]`);
      lines[i] = next;
    }
  }

  if (!check) fs.writeFileSync(abs, lines.join("\n"));
}

console.log(`Salas geográficas con canales corregidos: ${changed}${check ? " (--check: sin escribir)" : ""}`);
console.log(samples.join("\n"));
