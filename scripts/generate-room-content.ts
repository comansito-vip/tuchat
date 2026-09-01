/**
 * Redactor multi-LLM de contenido de salas (ciudades/temáticas), con cadena de
 * proveedores de terceros y rotación de claves para resiliencia.
 *
 * IMPORTANTE — este script NO INVESTIGA NADA. Solo escribe prosa a partir de
 * hechos YA VERIFICADOS que le pasas en el JSON de entrada (fiesta patronal,
 * monumento, geografía, etc. — sacados de Wikipedia/fuente real por otro medio,
 * como los agentes de investigación de este proyecto). Un LLM sin acceso a
 * herramientas de búsqueda que "recuerda" datos de un pueblo de 8.000
 * habitantes se los inventa: por eso la verificación es un paso ANTERIOR y
 * separado, nunca responsabilidad de este script.
 *
 * Cadena de proveedores (todas gratuitas/baratas, se prueban en orden; dentro
 * de cada proveedor rota entre las claves separadas por comas en el .env):
 *   Groq → Gemini → NVIDIA NIM → OpenRouter → Hugging Face → Cohere
 *
 * Uso:
 *   npx tsx scripts/generate-room-content.ts entrada.json salida.json
 *
 * Formato de entrada (array): { slug, name, kind, parentSlug?, parentName?,
 *   channels: string[], related: string[], users, votes, tag?, activity,
 *   datos: string[] }  — "datos" son las 2-5 frases YA VERIFICADAS a partir de
 *   las que se escribe (fiesta, monumento, geografía, gastronomía, hito...).
 *
 * Formato de salida: mismos campos + { icon, intro, about }, listos para
 * fusionar con el resto del catálogo (mismo shape que usa el resto del
 * proyecto en src/data/*.ts).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

// Carga .env.local a mano (sin dep de dotenv): tsx no la auto-carga como Next.js.
// No pisa variables ya definidas en el entorno (útil para pasar una clave suelta
// por línea de comandos, como hace generate-news.ts).
function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

// ───────────────────────── Tipos ─────────────────────────

interface RoomInput {
  slug: string;
  name: string;
  kind: "ciudad" | "tematica" | "pais";
  parentSlug?: string;
  parentName?: string;
  channels: string[];
  related: string[];
  users: number;
  votes: number;
  tag?: string;
  activity: "Alta" | "Media" | "Baja";
  datos: string[];
}

interface RoomOutput extends RoomInput {
  icon: string;
  intro: string;
  about: string;
}

interface Generated {
  icon: string;
  intro: string;
  about: string;
}

// ───────────────────────── Prompt (mismas reglas anti-IA del proyecto) ─────────────────────────

const SYSTEM_PROMPT =
  "Eres redactor de contenido local para un portal de chat en español (TuChat). Escribes la " +
  "landing de UNA sala. Usas EXCLUSIVAMENTE los datos verificados que te dan; no añades ni un " +
  "solo dato, fecha, cifra o nombre propio que no esté en la lista de datos. Si no tienes datos " +
  "suficientes, escribes con lo que hay, sin inventar para rellenar.\n\n" +
  "PROHIBIDO (plantilla ya detectada y penalizada en este proyecto):\n" +
  "- Abrir con \"Un espacio para/donde…\" o \"La sala de X es…\"\n" +
  "- La tríada \"Conviven A, B y C que…\"\n" +
  "- La enumeración \"En la sala se habla de A, de B y de C\"\n" +
  "- Cerrar con \"sin registro\", \"elige un nick\" o cualquier llamada a la acción — eso ya está " +
  "en el botón de la página, sobra en el texto\n" +
  "- Relleno de folleto turístico (\"un lugar con encanto lleno de historia y tradición\")\n\n" +
  "Español de España neutro, entendible en Latinoamérica (o con voseo si el lugar es rioplatense y " +
  "los datos lo sugieren). Responde SOLO con JSON válido: " +
  '{"icon": "<un emoji>", "intro": "<máx 160 caracteres>", "about": "<mín 500 caracteres, 1 párrafo>"}, ' +
  "sin markdown ni explicaciones.";

function userPrompt(room: RoomInput): string {
  return (
    `Sala: "${room.name}" (${room.kind}).\n` +
    `Datos verificados (usa SOLO estos, no añadas nada más):\n` +
    room.datos.map((d) => `- ${d}`).join("\n") +
    `\n\nEscribe el intro (gancho, ≤160 caracteres, sin llamada a la acción) y el about ` +
    `(≥500 caracteres, un párrafo, anclado en los datos de arriba, sin plantilla). Elige también ` +
    `un emoji evocador para "icon".`
  );
}

// ───────────────────────── Utilidades ─────────────────────────

function keysFor(envVar: string): string[] {
  return (process.env[envVar] ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

// Filtro de calidad: los modelos gratuitos/rápidos (Llama vía Groq, etc.) tienden
// al relleno genérico de folleto turístico aunque se les prohíba explícitamente.
// Lo detectamos y lo tratamos como fallo del proveedor (pasa al siguiente).
const BANNED_PATTERNS: RegExp[] = [
  /^Un espacio (para|donde)/i,
  /^La sala de .{1,30} es/i,
  /Conviven .+?, .+? y .+? que/i,
  /rica (historia|cultura)/i,
  /experiencia (única|inolvidable)/i,
  /refleja la esencia/i,
  /(lugar|ciudad|pueblo) (con encanto|lleno de)/i,
  /(resiliencia|compromiso) de la comunidad/i,
  /join us|descubr|sumérgete|no esperes más/i,
  /no (te )?(lo )?puedes perder/i,
  /te invita a/i,
  /viaje por|un recorrido por/i,
];

function hasBannedPattern(text: string): string | null {
  for (const re of BANNED_PATTERNS) if (re.test(text)) return re.source;
  return null;
}

function parseJsonObject(text: string): Generated {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("respuesta sin objeto JSON");
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (typeof parsed.intro !== "string" || typeof parsed.about !== "string") {
    throw new Error("faltan campos intro/about");
  }
  return {
    icon: typeof parsed.icon === "string" ? parsed.icon.trim() : "📍",
    intro: parsed.intro.trim(),
    about: parsed.about.trim(),
  };
}

// ───────────────────────── Proveedores (llamadas HTTP directas, sin SDKs) ─────────────────────────

/** La mayoría son compatibles con el formato Chat Completions de OpenAI. */
async function callOpenAICompatible(
  baseURL: string,
  model: string,
  apiKey: string,
  room: RoomInput,
): Promise<Generated> {
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(room) },
      ],
      temperature: 0.8,
    }),
  });
  if (!res.ok) throw new Error(`${baseURL} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return parseJsonObject(data.choices?.[0]?.message?.content ?? "");
}

async function callGemini(apiKey: string, room: RoomInput): Promise<Generated> {
  // gemini-2.5-flash devuelve 404 "no longer available to new users" con las claves
  // de la red (verificado el 2026-08-06); el vigente es gemini-3.5-flash.
  const model = "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt(room) }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
  return parseJsonObject(text);
}

async function callCohere(apiKey: string, room: RoomInput): Promise<Generated> {
  const res = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      // command-a-03-2025 es el buque insignia vigente; command-r-plus-08-2024 sigue
      // en catálogo pero es la generación anterior.
      model: "command-a-03-2025",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(room) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Cohere ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = (data.message?.content ?? []).map((b: { text?: string }) => b.text ?? "").join("");
  return parseJsonObject(text);
}

// ───────────────────────── Cadena de proveedores con rotación de claves ─────────────────────────

type ProviderCall = (key: string, room: RoomInput) => Promise<Generated>;

/** Orden por disponibilidad medida el 2026-08-06 (una llamada de chat real por par
 *  proveedor/modelo con todas las claves de la red), no por calidad teórica. Los
 *  cuatro primeros respondieron 200; los tres últimos están agotados hoy
 *  (Cohere 429 de trial, OpenRouter 404/429 porque los :free pasaron a pago) y se
 *  quedan de respaldo por si se recargan. HuggingFace volvió a servir el mismo día
 *  al añadirse una clave con créditos; sus dos claves viejas siguen dando 402. */
const PROVIDERS: { name: string; envVar: string; call: ProviderCall }[] = [
  {
    name: "Groq",
    envVar: "GROQ_API_KEYS",
    call: (key, room) => callOpenAICompatible("https://api.groq.com/openai/v1", "openai/gpt-oss-120b", key, room),
  },
  {
    // Cerebras retiró todos los llama: llama-3.3-70b devolvía 404 "model does not
    // exist". Sus únicos modelos vigentes son gpt-oss-120b, zai-glm-4.7 y gemma-4-31b.
    name: "Cerebras",
    envVar: "CEREBRAS_API_KEYS",
    call: (key, room) => callOpenAICompatible("https://api.cerebras.ai/v1", "gpt-oss-120b", key, room),
  },
  {
    name: "Mistral",
    envVar: "MISTRAL_API_KEYS",
    call: (key, room) => callOpenAICompatible("https://api.mistral.ai/v1", "mistral-large-latest", key, room),
  },
  {
    // meta/llama-3.1-70b-instruct dio 410 Gone el 2026-09-01; reemplazado por
    // meta/llama-3.2-90b-vision-instruct, comprobado con llamada real.
    name: "NVIDIA",
    envVar: "NVIDIA_API_KEYS",
    call: (key, room) =>
      callOpenAICompatible("https://integrate.api.nvidia.com/v1", "meta/llama-3.2-90b-vision-instruct", key, room),
  },
  { name: "Gemini", envVar: "GEMINI_API_KEYS", call: callGemini },
  {
    // Slug :free vigente: el de llama-3.3-70b dejó de existir como gratuito y
    // devolvía 404 con las cuatro claves. gpt-oss-20b:free lo siguió el
    // 2026-09-01 ("This model is unavailable for free. The paid version is
    // available now"); nemotron-3-super-120b-a12b:free sí está en /v1/models.
    name: "OpenRouter",
    envVar: "OPENROUTER_API_KEYS",
    call: (key, room) =>
      callOpenAICompatible("https://openrouter.ai/api/v1", "nvidia/nemotron-3-super-120b-a12b:free", key, room),
  },
  {
    name: "HuggingFace",
    envVar: "HUGGINGFACE_API_KEYS",
    call: (key, room) =>
      callOpenAICompatible("https://router.huggingface.co/v1", "meta-llama/Llama-3.3-70B-Instruct", key, room),
  },
  { name: "Cohere", envVar: "COHERE_API_KEYS", call: callCohere },
];

async function generateRoom(
  room: RoomInput,
): Promise<{ gen: Generated; provider: string; errors: string[] } | null> {
  const errors: string[] = [];
  for (const provider of PROVIDERS) {
    const keys = keysFor(provider.envVar);
    for (const key of keys) {
      try {
        const gen = await provider.call(key, room);
        const banned = hasBannedPattern(gen.about) ?? hasBannedPattern(gen.intro);
        if (banned) {
          errors.push(`${provider.name}: plantilla detectada (${banned})`);
          continue;
        }
        if (gen.about.length >= 400 && gen.intro.length <= 160 && gen.intro.length > 20) {
          return { gen, provider: provider.name, errors };
        }
        errors.push(`${provider.name}: constraints fallidas (about=${gen.about.length}, intro=${gen.intro.length})`);
      } catch (err) {
        errors.push(`${provider.name}: ${(err as Error).message}`);
      }
    }
  }
  console.warn(`  ✗ ${room.slug}: todos los proveedores fallaron —\n    ${errors.join("\n    ")}`);
  return null;
}

// ───────────────────────── Main ─────────────────────────

async function main() {
  const [inPath, outPath] = process.argv.slice(2);
  if (!inPath || !outPath) {
    console.error("Uso: npx tsx scripts/generate-room-content.ts entrada.json salida.json");
    process.exit(1);
  }

  const input: RoomInput[] = JSON.parse(readFileSync(inPath, "utf-8"));
  console.log(`Generando contenido para ${input.length} salas…`);

  const out: RoomOutput[] = [];
  const fails: string[] = [];
  for (const room of input) {
    const result = await generateRoom(room);
    if (!result) {
      fails.push(room.slug);
      continue;
    }
    // Los intentos descartados antes del que gana se resumen aquí: sin esto, que un
    // proveedor lleve semanas devolviendo 404 se ve igual que uno sano, porque el
    // fallback lo tapa y solo se imprime el que acaba escribiendo.
    const previos = result.errors.length
      ? ` (tras ${result.errors.length} intento(s) descartado(s)${process.env.DEBUG_LLM ? `: ${result.errors.join(" | ")}` : ""})`
      : "";
    console.log(`  ✓ ${room.slug} vía ${result.provider}${previos}`);
    out.push({ ...room, ...result.gen });
  }

  writeFileSync(outPath, JSON.stringify(out, null, 1));
  console.log(`\nEscritas ${out.length}/${input.length} salas en ${outPath}.`);
  if (fails.length) console.warn(`Sin generar (revisar a mano o repetir): ${fails.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
