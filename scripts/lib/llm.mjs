/**
 * Cadena de proveedores LLM genérica: prompt de texto → respuesta de texto.
 *
 * La que hay en generate-room-content.ts está acoplada al formato de salas
 * (recibe un RoomInput y devuelve {icon, intro, about}), así que no vale para
 * el cron de localidades, que necesita mandar prompts distintos y pedir dos
 * opiniones a modelos DIFERENTES. Aquí va la versión genérica.
 *
 * `scripts/check-llm-providers.mjs` sigue siendo la referencia de qué modelos
 * están vigentes: si un modelo cae, se cambia allí y aquí. Comprobado el
 * 2026-08-06: Groq, Cerebras, Mistral, NVIDIA, Gemini y HuggingFace responden;
 * Cohere y OpenRouter están agotados y quedan de respaldo.
 */
import { readFileSync, existsSync } from "node:fs";

export function cargarEnvLocal(ruta = ".env.local") {
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, "utf-8").split("\n")) {
    const m = linea.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

/** Orden por disponibilidad medida, no por calidad teórica. */
export const PROVEEDORES = [
  // Groq retiró `llama-3.3-70b-versatile` el 16 de agosto de 2026 y desde entonces
  // devuelve `model_not_found`. Los reemplazos que Groq recomienda —y que la clave
  // de este proyecto sí tiene— son `openai/gpt-oss-120b` y `qwen/qwen3.6-27b`.
  // Comprobado con llamada real, que es la única forma fiable de saberlo.
  { nombre: "Groq", env: "GROQ_API_KEYS", base: "https://api.groq.com/openai/v1", modelo: "openai/gpt-oss-120b" },
  { nombre: "Cerebras", env: "CEREBRAS_API_KEYS", base: "https://api.cerebras.ai/v1", modelo: "gpt-oss-120b" },
  { nombre: "Mistral", env: "MISTRAL_API_KEYS", base: "https://api.mistral.ai/v1", modelo: "mistral-large-latest" },
  { nombre: "NVIDIA", env: "NVIDIA_API_KEYS", base: "https://integrate.api.nvidia.com/v1", modelo: "meta/llama-3.1-70b-instruct" },
  // Segunda entrada sobre la MISMA cuenta de NVIDIA, con un modelo de otra
  // familia. No es un proveedor más: es la forma de tener dos modelos
  // independientes cuando el resto de la cadena está sin cuota.
  //
  // Hace falta porque la verificación de las fichas excluye a propósito al que
  // las escribió —el que redacta comparte el punto ciego del que redacta— y esa
  // exclusión es por NOMBRE de proveedor. El 2026-08-19, con Groq agotado y
  // Gemini, Cerebras, Mistral, HuggingFace y OpenRouter sin crédito, solo
  // quedaba NVIDIA en pie y el cron no podía publicar NADA: generaba y se
  // quedaba sin nadie que verificara. Con Gemma detrás de Llama, generar y
  // verificar los hacen modelos distintos, que es lo que la regla busca.
  //
  // Comprobado con llamada real y prompt del tamaño del que usa el cron; los
  // otros candidatos del catálogo de NVIDIA dieron 404, 410 o se pasaron del
  // tiempo de espera.
  { nombre: "NVIDIA-Gemma", env: "NVIDIA_API_KEYS", base: "https://integrate.api.nvidia.com/v1", modelo: "google/gemma-4-31b-it" },
  { nombre: "Gemini", env: "GEMINI_API_KEYS", base: "https://generativelanguage.googleapis.com/v1beta/openai", modelo: "gemini-3.5-flash" },
  { nombre: "HuggingFace", env: "HUGGINGFACE_API_KEYS", base: "https://router.huggingface.co/v1", modelo: "meta-llama/Llama-3.3-70B-Instruct" },
  // openai/gpt-oss-20b:free dejó de ser gratis el 2026-09-01 ("This model is
  // unavailable for free. The paid version is available now"); reemplazado por
  // nemotron-3-super-120b-a12b:free, vigente en /v1/models de OpenRouter.
  { nombre: "OpenRouter", env: "OPENROUTER_API_KEYS", base: "https://openrouter.ai/api/v1", modelo: "nvidia/nemotron-3-super-120b-a12b:free" },
];

const clavesDe = (env) => (process.env[env] ?? "").split(",").map((k) => k.trim()).filter(Boolean);

/**
 * Cuántos segundos pide esperar un 429, según las cabeceras del proveedor.
 *
 * `retry-after` es el estándar y viene en segundos. Groq además publica
 * `x-ratelimit-reset-tokens` con formato "577ms", "7.66s" o "2m30s". Devuelve
 * null si no hay forma de saberlo, que es la señal de no reintentar.
 */
function segundosDeEspera(headers) {
  const retry = Number(headers.get("retry-after"));
  if (Number.isFinite(retry) && retry > 0) return retry;
  const reset = headers.get("x-ratelimit-reset-tokens") ?? headers.get("x-ratelimit-reset-requests");
  if (!reset) return null;
  const m = String(reset).match(/(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s)?(?:(\d+)ms)?/);
  if (!m) return null;
  const segundos = (Number(m[1]) || 0) * 60 + (Number(m[2]) || 0) + (Number(m[3]) || 0) / 1000;
  return segundos > 0 ? Math.ceil(segundos) : 1;
}

async function llamar(prov, clave, system, user, maxTokens, reintentado = false) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 90_000);
  try {
    const res = await fetch(`${prov.base}/chat/completions`, {
      method: "POST",
      signal: ctl.signal,
      headers: { Authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: prov.modelo,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });
    if (res.status === 429) {
      // El 429 de cuota POR MINUTO no es un proveedor caído: es «espera». Las
      // dos a cuatro llamadas de una misma ficha van seguidas y juntas se pasan
      // del cubo (Groq da 8.000 tokens/minuto y cuenta los `max_tokens`
      // reservados), así que sin esto la segunda llamada tumbaba la ficha entera
      // y de paso quemaba el resto de la cadena. El proveedor dice cuándo se
      // rellena; si es cosa de un minuto, se espera y se reintenta con la misma
      // clave. Si el 429 es de cuota diaria, el reset viene en horas y se deja
      // pasar al siguiente proveedor, que es lo correcto.
      const espera = segundosDeEspera(res.headers);
      if (espera !== null && espera <= 75 && !reintentado) {
        clearTimeout(t);
        await new Promise((r) => setTimeout(r, (espera + 2) * 1000));
        return llamar(prov, clave, system, user, maxTokens, true);
      }
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    const texto = data.choices?.[0]?.message?.content ?? "";
    if (!texto.trim()) throw new Error("respuesta vacía");
    return texto;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Recorre la cadena hasta que alguien conteste.
 *
 * `excluir` sirve para la verificación: el modelo que verifica no puede ser el
 * mismo que generó, porque comparte su punto ciego y aprueba sus propias
 * invenciones. Devuelve también qué proveedor contestó para poder excluirlo.
 */
export async function completar(system, user, { maxTokens = 4000, excluir = [] } = {}) {
  const errores = [];
  for (const prov of PROVEEDORES) {
    if (excluir.includes(prov.nombre)) continue;
    for (const clave of clavesDe(prov.env)) {
      try {
        const texto = await llamar(prov, clave, system, user, maxTokens);
        return { texto, proveedor: prov.nombre };
      } catch (err) {
        errores.push(`${prov.nombre}: ${err.message}`);
      }
    }
  }
  throw new Error(`Todos los proveedores LLM fallaron:\n${errores.join("\n")}`);
}

/**
 * Escapa los caracteres de control que quedan sueltos DENTRO de una cadena.
 *
 * Los modelos escriben el salto de párrafo del campo "about" como un salto de
 * línea de verdad en vez de "\\n", y JSON.parse lo rechaza con "Bad control
 * character in string literal". Pasaba en la mitad larga de las respuestas, así
 * que descartar esas fichas era tirar contenido bueno por un problema de
 * formato del proveedor.
 */
function escaparControlesEnCadenas(json) {
  let salida = "";
  let enCadena = false;
  let escapado = false;
  for (const c of json) {
    if (escapado) { salida += c; escapado = false; continue; }
    if (c === "\\") { salida += c; escapado = true; continue; }
    if (c === '"') { enCadena = !enCadena; salida += c; continue; }
    if (enCadena && c === "\n") { salida += "\\n"; continue; }
    if (enCadena && c === "\r") { salida += "\\r"; continue; }
    if (enCadena && c === "\t") { salida += "\\t"; continue; }
    if (enCadena && c < " ") continue;          // el resto de controles, fuera
    salida += c;
  }
  return salida;
}

/**
 * Extrae el objeto JSON de una respuesta, que casi nunca viene limpia: llega
 * envuelta en ```json, con un "Aquí tienes:" delante o con texto detrás.
 */
export function extraeJSON(texto) {
  const sinCerca = texto.replace(/```(?:json)?/gi, "");
  const ini = sinCerca.indexOf("{");
  if (ini === -1) throw new Error("No se pudo extraer JSON de la respuesta del LLM");
  // Busca la llave que cierra el primer objeto contando anidamiento, porque el
  // último "}" del texto puede pertenecer a otra cosa que venga detrás.
  let nivel = 0;
  let enCadena = false;
  let escapado = false;
  for (let i = ini; i < sinCerca.length; i++) {
    const c = sinCerca[i];
    if (escapado) { escapado = false; continue; }
    if (c === "\\") { escapado = true; continue; }
    if (c === '"') { enCadena = !enCadena; continue; }
    if (enCadena) continue;
    if (c === "{") nivel++;
    else if (c === "}" && --nivel === 0) {
      const bruto = sinCerca.slice(ini, i + 1);
      try {
        return JSON.parse(bruto);
      } catch {
        try {
          return JSON.parse(escaparControlesEnCadenas(bruto));
        } catch (err) {
          throw new Error(`No se pudo extraer JSON de la respuesta del LLM: ${err.message}`);
        }
      }
    }
  }
  throw new Error("No se pudo extraer JSON de la respuesta del LLM: objeto sin cerrar");
}
