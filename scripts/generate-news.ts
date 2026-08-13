/**
 * Generador de columnas de divulgación multi-LLM (Fase 2/3 del brief).
 *
 * Genera piezas de OPINIÓN y TENDENCIA atemporales (evergreen) por categoría, con
 * estilo humano y anti-IA, y las escribe en src/data/news.ts. NO genera noticias de
 * actualidad ni hechos/cifras/citas fabricadas (riesgo de desinformación y E-E-A-T).
 * Usa varios proveedores con fallback: si el primario (Claude) falla o no hay clave,
 * prueba el siguiente (OpenAI).
 *
 * Uso:
 *   ANTHROPIC_API_KEY=sk-ant-...  [OPENAI_API_KEY=sk-...]  npx tsx scripts/generate-news.ts
 * O en local, con .env.local (GROQ_API_KEYS, CEREBRAS_API_KEYS, MISTRAL_API_KEYS,
 * OPENROUTER_API_KEYS — claves separadas por comas para rotar) sin pasar nada a mano.
 *
 * Requiere Node 18+ (fetch global). No añade dependencias de SDK: llama a las APIs
 * por HTTP para poder encadenar proveedores distintos como pide el brief.
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { detectarMuletillas, aperturaNormalizada } from "../src/lib/content/muletillas";
// La foto de cada pieza la decide el mismo módulo que usa la web. El script
// llevaba su propia copia de la tabla y ya se habían desincronizado: le faltaban
// las categorías `ia` y `entretenimiento`, así que esas piezas nacían con la foto
// genérica de actualidad.
import { getNewsImage } from "../src/lib/news-images";

// Carga .env.local a mano (sin dep de dotenv): útil en local; en CI las
// variables ya vienen del entorno (GitHub Actions secrets) y esto no hace nada.
function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

// ───────────────────────── Configuración ─────────────────────────

// Debe coincidir exactamente con el VALID set de data.test.ts (categorías
// reales del sitio, con sus propias rutas/FAQ en /noticias/[categoria]).
const CATEGORIES = [
  "Actualidad",
  "Deportes",
  "Tecnología",
  "IA",
  "Cultura",
  "Viajes",
  "Salud",
  "Economía",
  "Entretenimiento",
] as const;

const ITEMS_PER_CATEGORY = 2;
const ANTHROPIC_MODEL = "claude-opus-4-8";
const OPENAI_MODEL = "gpt-4o";

interface GeneratedItem {
  title: string;
  excerpt: string;
  body: string;
}

interface NewsItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  featured?: boolean;
  body?: string;
  image?: string;
}

// ───────────────────────── Prompt (anti-IA) ─────────────────────────

const SYSTEM_PROMPT =
  "Eres columnista de divulgación de un portal de chat en español. Escribes piezas de " +
  "OPINIÓN, TENDENCIA y DIVULGACIÓN atemporal (evergreen): reflexión cultural, guías, " +
  "claves para entender un tema, debate de fondo. Estilo editorial humano, natural y variado. " +
  "REGLAS ESTRICTAS DE VERACIDAD (no negociables): NO inventes noticias ni hechos de actualidad; " +
  "NO atribuyas cifras, estadísticas, declaraciones ni citas a personas, empresas o instituciones " +
  "reales; NO inventes resultados, fechas de eventos concretos ni 'fuentes'; NO cites a usuarios " +
  "ficticios del chat ni cierres con una fórmula tipo 'las salas de TuChat acogieron el debate'. " +
  "Escribe en términos generales y atemporales ('suele', 'tiende a', 'muchos jugadores'), no como " +
  "una crónica de un suceso fechado. Prohibidas las muletillas de IA ('en un mundo cada vez más', " +
  "'sumérgete', 'descubre', 'no esperes más') y el relleno genérico. " +
  "Español de España y Latinoamérica. Responde SOLO con JSON válido, sin markdown ni explicaciones.";

function userPrompt(category: string): string {
  return (
    `Genera ${ITEMS_PER_CATEGORY} piezas de OPINIÓN o TENDENCIA atemporales de la categoría ` +
    `"${category}". NO son noticias de actualidad: son columnas de divulgación que seguirán siendo ` +
    `válidas dentro de un año. Cada una con: un titular de columna (sin comillas internas, sin fecha), ` +
    `una entradilla de EXACTAMENTE entre 120 y 155 caracteres (ni más corta ni más larga; se usa tal cual ` +
    `como meta description, así que cuenta los caracteres antes de responder) que plantee el tema o la ` +
    `tendencia sin cifras ni citas inventadas, y un cuerpo de 4-5 párrafos (separa los párrafos con \\n\\n) ` +
    `de AL MENOS 450 palabras en total (cuenta las palabras; si te quedas corto, añade otro párrafo de ` +
    `desarrollo o de ejemplos concretos antes de responder) con estilo editorial humano y un cierre variado ` +
    `(nunca el mismo molde). Devuelve un array JSON con este formato exacto:\n` +
    `[{"title": "...", "excerpt": "...", "body": "..."}]`
  );
}

// ───────────────────────── Proveedores LLM ─────────────────────────

/** Extrae el primer array JSON de un texto, tolerando envoltorios de markdown. */
function parseJsonArray(text: string): GeneratedItem[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("respuesta sin array JSON");
  }
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(parsed)) throw new Error("JSON no es un array");
  return parsed
    .filter((it) => it && typeof it.title === "string" && typeof it.excerpt === "string")
    .map((it) => ({
      title: it.title.trim(),
      excerpt: it.excerpt.trim(),
      body: typeof it.body === "string" ? it.body.trim() : "",
    }));
}

/** Claude (Anthropic Messages API). Sin temperature/budget_tokens (rechazados en Opus 4.8). */
async function callClaude(category: string): Promise<GeneratedItem[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY no definida");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt(category) }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");
  return parseJsonArray(text);
}

/** OpenAI (Chat Completions) como fallback de resiliencia. */
async function callOpenAI(category: string): Promise<GeneratedItem[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY no definida");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(category) },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return parseJsonArray(data.choices?.[0]?.message?.content ?? "");
}

/** Cliente genérico para APIs compatibles con el formato Chat Completions de OpenAI
 *  (Groq, Cerebras, Mistral, NVIDIA NIM, OpenRouter...). Soporta rotar entre varias
 *  claves separadas por comas en la misma variable de entorno y entre varios modelos
 *  (los gratuitos de OpenRouter se saturan upstream por separado: si uno da 429,
 *  otro suele responder). */
function makeOpenAICompatibleCaller(
  name: string,
  envVar: string,
  baseURL: string,
  models: string[],
): (category: string) => Promise<GeneratedItem[]> {
  return async (category: string) => {
    const keys = (process.env[envVar] ?? "").split(",").map((k) => k.trim()).filter(Boolean);
    if (keys.length === 0) throw new Error(`${envVar} no definida`);
    let lastErr: Error | null = null;
    for (const model of models) {
      for (const key of keys) {
        try {
          const res = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt(category) },
              ],
            }),
          });
          if (!res.ok) throw new Error(`${name} ${res.status}: ${(await res.text()).slice(0, 200)}`);
          const data = await res.json();
          return parseJsonArray(data.choices?.[0]?.message?.content ?? "");
        } catch (err) {
          lastErr = err as Error;
        }
      }
    }
    throw lastErr ?? new Error(`${name}: todas las claves fallaron`);
  };
}

/** Cadena de proveedores con fallback: el primero que responda válido gana.
 *
 *  El orden lo manda la disponibilidad real, no la calidad teórica: auditoría del
 *  2026-08-06 contra las APIs (una llamada de chat por par proveedor/modelo, no solo
 *  /models) sobre las claves de toda la red. Los cuatro de arriba respondieron 200
 *  con todas sus claves; los de abajo están agotados o retirados y solo sirven como
 *  respaldo por si se recargan:
 *    · Cohere      429 — trial de 1.000 llamadas/mes consumido en las 2 claves
 *    · HuggingFace — las 2 claves viejas dan 402 (créditos agotados); la clave
 *      añadida el 2026-08-06 sí responde, así que el proveedor vuelve a servir
 *    · OpenRouter  404/429 — los :free pasaron a pago; el resto exige 10 créditos
 *    · DeepSeek    402 — saldo insuficiente
 *    · Claude      401 — las 3 claves de la red son inválidas
 *    · OpenAI      no hay ninguna clave en ningún proyecto
 *  Claude y OpenAI se quedan los primeros PORQUE dan mejor calidad y el filtro de
 *  abajo los descarta solos mientras no haya clave: en cuanto se configure una,
 *  vuelven a encabezar la cadena sin tocar código. */
const PROVIDERS: { name: string; envVar?: string; call: (c: string) => Promise<GeneratedItem[]> }[] = [
  { name: "Claude", envVar: "ANTHROPIC_API_KEY", call: callClaude },
  { name: "OpenAI", envVar: "OPENAI_API_KEY", call: callOpenAI },
  // Groq agota 100.000 tokens/día en el tier gratuito: con 8 categorías se queda
  // corto él solo, de ahí que detrás vayan varios proveedores más y no uno.
  { name: "Groq", envVar: "GROQ_API_KEYS", call: makeOpenAICompatibleCaller("Groq", "GROQ_API_KEYS", "https://api.groq.com/openai/v1", ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"]) },
  // Cerebras retiró los llama: sus modelos vigentes (verificado contra /models el
  // 2026-08-06) son gpt-oss-120b, zai-glm-4.7 y gemma-4-31b, y ninguno más.
  { name: "Cerebras", envVar: "CEREBRAS_API_KEYS", call: makeOpenAICompatibleCaller("Cerebras", "CEREBRAS_API_KEYS", "https://api.cerebras.ai/v1", ["gpt-oss-120b", "zai-glm-4.7", "gemma-4-31b"]) },
  { name: "Mistral", envVar: "MISTRAL_API_KEYS", call: makeOpenAICompatibleCaller("Mistral", "MISTRAL_API_KEYS", "https://api.mistral.ai/v1", ["mistral-large-latest", "mistral-small-latest"]) },
  // llama-3.3-70b da 503 por saturación a ratos; nemotron aguanta mejor y va primero.
  { name: "NVIDIA", envVar: "NVIDIA_API_KEYS", call: makeOpenAICompatibleCaller("NVIDIA", "NVIDIA_API_KEYS", "https://integrate.api.nvidia.com/v1", ["nvidia/nemotron-3-super-120b-a12b", "meta/llama-3.3-70b-instruct"]) },
  // gemini-2.0-flash devuelve 429 con las 4 claves de la red (el free tier del
  // modelo viejo ya no existe) y gemini-2.5-flash da 404 "no longer available to
  // new users": el que responde hoy es gemini-3.5-flash.
  { name: "Gemini", envVar: "GEMINI_API_KEYS", call: makeOpenAICompatibleCaller("Gemini", "GEMINI_API_KEYS", "https://generativelanguage.googleapis.com/v1beta/openai", ["gemini-3.5-flash", "gemini-flash-latest", "gemini-flash-lite-latest"]) },
  { name: "Cohere", envVar: "COHERE_API_KEYS", call: makeOpenAICompatibleCaller("Cohere", "COHERE_API_KEYS", "https://api.cohere.ai/compatibility/v1", ["command-a-03-2025"]) },
  // Slugs :free vigentes verificados contra /models el 2026-08-06. Los que había
  // aquí antes (gpt-oss-120b:free, qwen3-next-80b:free, llama-3.3-70b:free) ya no
  // existen como gratuitos y devolvían 404 "use the paid slug instead".
  { name: "OpenRouter", envVar: "OPENROUTER_API_KEYS", call: makeOpenAICompatibleCaller("OpenRouter", "OPENROUTER_API_KEYS", "https://openrouter.ai/api/v1", [
    "openai/gpt-oss-20b:free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
  ]) },
];

/** Un proveedor sin clave no es un fallo que reportar: es uno que no toca. Filtrarlo
 *  aquí evita que el log del cron abra cada categoría con dos errores fijos de
 *  "ANTHROPIC_API_KEY no definida" que tapan los fallos que sí importan. */
function availableProviders() {
  return PROVIDERS.filter((p) => !p.envVar || (process.env[p.envVar] ?? "").trim() !== "");
}

// Mismos límites que exige data.test.ts (excerpt ≤160, body ≥400 palabras):
// un modelo gratuito que ignore el prompt no debe colar contenido que rompe
// las reglas del sitio — se descarta la pieza en vez de escribirla.
//
// Las muletillas van aquí y no solo en el prompt porque el prompt ya las
// prohibía y aun así llegaron a publicarse: "en definitiva" en 31 artículos,
// "en la era digital" en 7. Los proveedores gratuitos de la cadena de respaldo
// ignoran esa parte de la instrucción, así que la única barrera fiable es esta.
function passesQualityBar(item: GeneratedItem): boolean {
  const words = item.body.trim().split(/\s+/).filter(Boolean).length;
  if (item.excerpt.length > 160 || words < 400) return false;
  // El límite de título también lo exige data.test.ts, y no estaba aquí: se
  // coló uno de 135 caracteres ("Alimentación consciente: más allá de la moda;
  // escuchar al cuerpo, valorar la procedencia y promover una salud integral
  // son sus pilares") que era la entradilla disfrazada de titular y que Google
  // habría cortado a la mitad en el resultado.
  if (item.title.length > 110) return false;
  return detectarMuletillas(`${item.title} ${item.excerpt} ${item.body}`).length === 0;
}

async function generateCategory(category: string): Promise<GeneratedItem[]> {
  const errors: string[] = [];
  for (const provider of availableProviders()) {
    try {
      const items = await provider.call(category);
      const valid = items.filter(passesQualityBar);
      if (valid.length > 0) {
        const dropped = items.length - valid.length;
        console.log(
          `  ✓ ${category}: ${valid.length} vía ${provider.name}` +
            (dropped > 0 ? ` (${dropped} descartadas por longitud)` : ""),
        );
        return valid;
      }
      errors.push(`${provider.name}: 0 items válidos de ${items.length}`);
    } catch (err) {
      errors.push(`${provider.name}: ${(err as Error).message}`);
    }
  }
  console.warn(`  ✗ ${category}: todos los proveedores fallaron — ${errors.join(" | ")}`);
  return [];
}

// ───────────────────────── Utilidades ─────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

function renderFile(items: NewsItem[]): string {
  // JSON.stringify produce literales de string válidos en TS (escapa comillas y
  // saltos de línea), seguro para el body multipárrafo.
  const q = (s: string) => JSON.stringify(s);
  const body = items
    .map((n) => {
      const lines = [
        `    slug: ${q(n.slug)},`,
        `    title: ${q(n.title)},`,
        `    category: ${q(n.category)},`,
        `    excerpt: ${q(n.excerpt)},`,
        `    date: ${q(n.date)},`,
      ];
      if (n.featured) lines.push("    featured: true,");
      if (n.body) lines.push(`    body: ${q(n.body)},`);
      if (n.image) lines.push(`    image: ${q(n.image)},`);
      return `  {\n${lines.join("\n")}\n  },`;
    })
    .join("\n");

  return `import type { NewsItem } from "./types";

// Generado por scripts/generate-news.ts (multi-LLM con fallback). No editar a mano.
export const NEWS: NewsItem[] = [
${body}
];
`;
}

// ───────────────────────── Main ─────────────────────────

async function main() {
  const date = process.env.NEWS_DATE ?? new Date().toISOString().slice(0, 10);
  console.log(`Generando noticias para ${date}…`);

  const out = join(process.cwd(), "src", "data", "news.ts");
  // Piezas evergreen: se AÑADEN al catálogo existente, nunca lo reemplazan.
  // (Bug real hasta 2026-07-13: writeFileSync pisaba el fichero entero con solo
  // las del día — habría borrado los 45 artículos curados en el primer cron OK.)
  const { NEWS: existing } = (await import(pathToFileURL(out).href)) as { NEWS: NewsItem[] };
  const existingSlugs = new Set(existing.map((n) => n.slug));

  const fresh: NewsItem[] = [];
  for (const category of CATEGORIES) {
    const items = await generateCategory(category);
    items.forEach((it, idx) => {
      let slug = slugify(it.title) || `${slugify(category)}-${idx}`;
      if (existingSlugs.has(slug) || fresh.some((f) => f.slug === slug)) slug = `${slug}-${date}`;
      fresh.push({
        slug,
        title: it.title,
        category,
        excerpt: it.excerpt,
        date,
        body: it.body || undefined,
        image: getNewsImage(category, slug),
      });
    });
  }

  if (fresh.length === 0) {
    console.error("No se generó ninguna noticia. Revisa las claves de API. Abortando sin escribir.");
    process.exit(1);
  }

  // Dedup de contenido (no solo de slug): data.test.ts rechaza dos piezas que
  // compartan excerpt o la misma apertura de cuerpo (100 primeros caracteres).
  // Distintos modelos/días convergen a veces en el mismo tema y la misma frase
  // inicial (p.ej. varias columnas de "economía circular"): se descarta la nueva.
  // Apertura por palabras normalizadas, no por los 100 primeros caracteres:
  // "En los últimos años, la IA ha dejado de…" y "…ha pasado de…" difieren
  // dentro de esos 100 caracteres y son el mismo arranque. Con el criterio
  // viejo se colaron tres pares de columnas que abrían igual.
  const opening = (n: NewsItem) => (n.body ? aperturaNormalizada(n.body) : "");
  const seenExcerpts = new Set(existing.map((n) => n.excerpt));
  const seenOpenings = new Set(existing.map(opening).filter(Boolean));
  const deduped = fresh.filter((n) => {
    const op = opening(n);
    if (seenExcerpts.has(n.excerpt) || (op && seenOpenings.has(op))) return false;
    seenExcerpts.add(n.excerpt);
    if (op) seenOpenings.add(op);
    return true;
  });
  const droppedDup = fresh.length - deduped.length;
  if (droppedDup > 0) console.log(`  ⓘ ${droppedDup} descartadas por duplicar excerpt/apertura`);

  // Un solo featured en todo el catálogo: se lo queda la primera de hoy (o, si
  // hoy no quedó ninguna nueva tras el dedup, la primera del catálogo).
  const merged = [...existing.map((n) => ({ ...n, featured: undefined })), ...deduped];
  if (merged.length > 0) merged[deduped.length > 0 ? existing.length : 0].featured = true;

  writeFileSync(out, renderFile(merged));
  console.log(`Añadidas ${deduped.length} noticias nuevas (${merged.length} en total) en ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
