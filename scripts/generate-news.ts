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
 *  Claude/OpenAI primero (mejor calidad, si hay clave configurada); los
 *  gratuitos/rápidos de terceros como red de seguridad para que el cron
 *  nunca se quede sin generar nada por falta de una clave de pago. */
const PROVIDERS: { name: string; call: (c: string) => Promise<GeneratedItem[]> }[] = [
  { name: "Claude", call: callClaude },
  { name: "OpenAI", call: callOpenAI },
  { name: "Groq", call: makeOpenAICompatibleCaller("Groq", "GROQ_API_KEYS", "https://api.groq.com/openai/v1", ["llama-3.3-70b-versatile"]) },
  { name: "Cerebras", call: makeOpenAICompatibleCaller("Cerebras", "CEREBRAS_API_KEYS", "https://api.cerebras.ai/v1", ["llama-3.3-70b"]) },
  { name: "Mistral", call: makeOpenAICompatibleCaller("Mistral", "MISTRAL_API_KEYS", "https://api.mistral.ai/v1", ["mistral-large-latest"]) },
  // Modelos :free vigentes verificados contra /models el 2026-07-13; si uno
  // está saturado upstream (429) se prueba el siguiente.
  { name: "OpenRouter", call: makeOpenAICompatibleCaller("OpenRouter", "OPENROUTER_API_KEYS", "https://openrouter.ai/api/v1", [
    "openai/gpt-oss-120b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
  ]) },
];

// Mismos límites que exige data.test.ts (excerpt ≤160, body ≥400 palabras):
// un modelo gratuito que ignore el prompt no debe colar contenido que rompe
// las reglas del sitio — se descarta la pieza en vez de escribirla.
function passesQualityBar(item: GeneratedItem): boolean {
  const words = item.body.trim().split(/\s+/).filter(Boolean).length;
  return item.excerpt.length <= 160 && words >= 400;
}

async function generateCategory(category: string): Promise<GeneratedItem[]> {
  const errors: string[] = [];
  for (const provider of PROVIDERS) {
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

const CATEGORY_IMAGES_SCRIPT: Record<string, string[]> = {
  tecnologia:    ["photo-1518770660439-4636190af475", "photo-1461749280684-dccba630e2f6"],
  deportes:      ["photo-1518091043644-c1d4457512c6", "photo-1540747913346-19e32dc3e97e"],
  cultura:       ["photo-1513364776144-60967b0f800f", "photo-1507842217343-583bb7270b66"],
  actualidad:    ["photo-1504711434969-e33886168f5c", "photo-1585829365295-ab7cd400c167"],
  economia:      ["photo-1611974789855-9c2a0a7236a3", "photo-1579621970588-a35d0e7ab9b6"],
  salud:         ["photo-1576091160550-2173dba999ef", "photo-1505751172876-fa1923c5c528"],
  viajes:        ["photo-1488085061387-422e29b40080", "photo-1476514525535-07fb3b4ae5f1"],
  anime:         ["photo-1578632767115-351597cf2477", "photo-1608889175250-c9b4ce5a803d"],
  esoterismo:    ["photo-1518709268805-4e9042af9f23", "photo-1532105956626-9569c03602f6"],
  psicologia:    ["photo-1554224155-6726b3ff858f", "photo-1493894473891-10fc1e5dbd22"],
};

function getScriptNewsImage(category: string, slug: string): string {
  const key = category.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const pool = CATEGORY_IMAGES_SCRIPT[key] ?? CATEGORY_IMAGES_SCRIPT.actualidad;
  const hash = slug.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const id = pool[hash % pool.length];
  return `https://images.unsplash.com/${id}?w=800&q=75&auto=format&fit=crop`;
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
        image: getScriptNewsImage(category, slug),
      });
    });
  }

  if (fresh.length === 0) {
    console.error("No se generó ninguna noticia. Revisa las claves de API. Abortando sin escribir.");
    process.exit(1);
  }

  // Un solo featured en todo el catálogo: se lo queda el primero de hoy.
  const merged = [...existing.map((n) => ({ ...n, featured: undefined })), ...fresh];
  merged[existing.length].featured = true;

  writeFileSync(out, renderFile(merged));
  console.log(`Añadidas ${fresh.length} noticias nuevas (${merged.length} en total) en ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
