/**
 * Generador de noticias multi-LLM (Fase 2/3 del brief).
 *
 * Genera contenidos editoriales diarios por categoría con estilo humano, anti-IA,
 * y los escribe en src/data/news.ts. Usa varios proveedores con fallback: si el
 * primario (Claude) falla o no hay clave, prueba el siguiente (OpenAI).
 *
 * Uso:
 *   ANTHROPIC_API_KEY=sk-ant-...  [OPENAI_API_KEY=sk-...]  npx tsx scripts/generate-news.ts
 *
 * Requiere Node 18+ (fetch global). No añade dependencias de SDK: llama a las APIs
 * por HTTP para poder encadenar proveedores distintos como pide el brief.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

// ───────────────────────── Configuración ─────────────────────────

const CATEGORIES = [
  "Tecnología",
  "Deportes",
  "Cultura",
  "Actualidad",
  "Economía",
  "Salud",
  "Viajes",
  "Anime",
  "Esoterismo",
  "Psicología",
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
}

// ───────────────────────── Prompt (anti-IA) ─────────────────────────

const SYSTEM_PROMPT =
  "Eres redactor jefe de un portal de chat en español. Escribes titulares y entradillas " +
  "de noticias con estilo editorial humano, natural y variado. Reglas estrictas: nada de " +
  "frases típicas de IA ('en un mundo cada vez más', 'sumérgete', 'descubre', 'no esperes más'), " +
  "nada de relleno genérico, contexto real y concreto, titulares como los de un medio de verdad. " +
  "Español de España y Latinoamérica. Responde SOLO con JSON válido, sin markdown ni explicaciones.";

function userPrompt(category: string, date: string): string {
  return (
    `Genera ${ITEMS_PER_CATEGORY} noticias plausibles y actuales de la categoría "${category}" ` +
    `para la fecha ${date}. Cada una con: un titular periodístico (sin comillas internas), una ` +
    `entradilla de 2-3 frases con datos concretos, y un cuerpo de 2-3 párrafos (separa los ` +
    `párrafos con \\n\\n) con estilo editorial humano. Devuelve un array JSON con este formato exacto:\n` +
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
async function callClaude(category: string, date: string): Promise<GeneratedItem[]> {
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
      messages: [{ role: "user", content: userPrompt(category, date) }],
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
async function callOpenAI(category: string, date: string): Promise<GeneratedItem[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY no definida");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(category, date) },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return parseJsonArray(data.choices?.[0]?.message?.content ?? "");
}

/** Cadena de proveedores con fallback: el primero que responda válido gana. */
const PROVIDERS: { name: string; call: (c: string, d: string) => Promise<GeneratedItem[]> }[] = [
  { name: "Claude", call: callClaude },
  { name: "OpenAI", call: callOpenAI },
];

async function generateCategory(category: string, date: string): Promise<GeneratedItem[]> {
  const errors: string[] = [];
  for (const provider of PROVIDERS) {
    try {
      const items = await provider.call(category, date);
      if (items.length > 0) {
        console.log(`  ✓ ${category}: ${items.length} vía ${provider.name}`);
        return items;
      }
      errors.push(`${provider.name}: 0 items`);
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

  const all: NewsItem[] = [];
  for (const category of CATEGORIES) {
    const items = await generateCategory(category, date);
    items.forEach((it, idx) => {
      const slug = slugify(it.title) || `${slugify(category)}-${idx}`;
      all.push({
        slug,
        title: it.title,
        category,
        excerpt: it.excerpt,
        date,
        featured: all.length === 0 && idx === 0,
        body: it.body || undefined,
      });
    });
  }

  if (all.length === 0) {
    console.error("No se generó ninguna noticia. Revisa las claves de API. Abortando sin escribir.");
    process.exit(1);
  }

  const out = join(process.cwd(), "src", "data", "news.ts");
  writeFileSync(out, renderFile(all));
  console.log(`Escritas ${all.length} noticias en ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
