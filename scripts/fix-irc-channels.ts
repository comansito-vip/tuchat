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
import { REAL_CHANNELS, ES_CHANNELS, LATAM_CHANNELS } from "../src/data/irc-real-channels";

const FILES = ["src/data/countries.ts", "src/data/cities.ts", "src/data/cities-world.ts"];

const NETWORK = "chatzona";
const LATAM_FALLBACK = "latinoamerica";
const WORLD_FALLBACK = ["internacional", "ocio"];

// Canal de país tal y como lo escribe la red. La clave es nuestro slug.
const COUNTRY_CHANNEL: Record<string, string[]> = {
  espana: ["españa"],
  mexico: ["mexico", LATAM_FALLBACK],
  argentina: ["argentina", LATAM_FALLBACK],
  colombia: ["colombia", LATAM_FALLBACK],
  chile: ["chile", LATAM_FALLBACK],
  peru: ["peru", LATAM_FALLBACK],
  uruguay: ["uruguay", LATAM_FALLBACK],
  venezuela: ["venezuela", LATAM_FALLBACK],
  ecuador: ["ecuador", LATAM_FALLBACK],
  bolivia: ["bolivia", LATAM_FALLBACK],
  paraguay: ["paraguay", LATAM_FALLBACK],
  cuba: ["cuba", LATAM_FALLBACK],
  guatemala: ["guatemala", LATAM_FALLBACK],
  honduras: ["honduras", LATAM_FALLBACK],
  nicaragua: ["nicaragua", LATAM_FALLBACK],
  panama: ["panama", LATAM_FALLBACK],
  "costa-rica": ["costa_rica", LATAM_FALLBACK],
  "el-salvador": ["el_salvador", LATAM_FALLBACK],
  "republica-dominicana": ["republica_dominicana", LATAM_FALLBACK],
  "puerto-rico": ["puerto_rico", LATAM_FALLBACK],
  // Hispanos en EE. UU.: la red los tiene en #usa, no en un #estados-unidos
  // que no existe.
  "estados-unidos": ["usa", "internacional"],
  belice: WORLD_FALLBACK,
  canada: WORLD_FALLBACK,
  francia: WORLD_FALLBACK,
  italia: WORLD_FALLBACK,
  portugal: WORLD_FALLBACK,
  alemania: WORLD_FALLBACK,
  "reino-unido": WORLD_FALLBACK,
  marruecos: WORLD_FALLBACK,
  "guinea-ecuatorial": WORLD_FALLBACK,
};

// ── Canales reales ────────────────────────────────────────────────────────────
const realNames = [...REAL_CHANNELS];

/** Clave de comparación: sin acentos y con guion/guion bajo unificados. */
const key = (c: string) =>
  c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[-_]/g, "");

// key → nombre tal cual lo escribe la red ("cataluna" → "cataluña").
const CANON = new Map<string, string>();
for (const n of realNames) if (!CANON.has(key(n))) CANON.set(key(n), n);

/** Nombre real del canal, o null si la red no lo tiene. */
const canon = (c: string): string | null => CANON.get(key(c)) ?? null;

// Solo se le devuelve a una ciudad su canal propio si es geográfico: así un
// pueblo llamado "Trivial" o "Amor" no acabaría en el canal temático homónimo.
const GEO = new Set<string>([...ES_CHANNELS, ...LATAM_CHANNELS]);
const geoCanon = (c: string): string | null => {
  const real = canon(c);
  return real && GEO.has(real) ? real : null;
};

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
