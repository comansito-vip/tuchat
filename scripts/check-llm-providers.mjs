#!/usr/bin/env node
/**
 * Auditoría de la cadena LLM: prueba con una llamada de chat REAL cada par
 * proveedor/modelo que usan los generadores, con todas las claves de .env.local.
 *
 * Existe porque consultar /models no basta: OpenRouter siguió listando slugs :free
 * que devolvían 404 al llamarlos, y Gemini lista modelos que responden "no longer
 * available to new users". Solo la llamada real distingue "vigente" de "listado".
 *
 * Uso:  node scripts/check-llm-providers.mjs
 * Sale con código 1 si algún proveedor se queda sin ningún modelo utilizable.
 */
import { readFileSync, existsSync } from "node:fs";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

// Debe reflejar lo que usan generate-news.ts y generate-room-content.ts.
const PROVIDERS = [
  // Groq retiró `llama-3.3-70b-versatile` el 16 de agosto de 2026 y desde entonces
  // devuelve `model_not_found`. Los reemplazos que Groq recomienda —y que la clave
  // de este proyecto sí tiene— son `openai/gpt-oss-120b` y `qwen/qwen3.6-27b`.
  // Comprobado con llamada real, que es la única forma fiable de saberlo.
  { name: "Groq", envVar: "GROQ_API_KEYS", base: "https://api.groq.com/openai/v1", models: ["openai/gpt-oss-120b", "qwen/qwen3.6-27b"] },
  { name: "Cerebras", envVar: "CEREBRAS_API_KEYS", base: "https://api.cerebras.ai/v1", models: ["gpt-oss-120b", "zai-glm-4.7", "gemma-4-31b"] },
  { name: "Mistral", envVar: "MISTRAL_API_KEYS", base: "https://api.mistral.ai/v1", models: ["mistral-large-latest", "mistral-small-latest"] },
  // meta/llama-3.1-70b-instruct dio 410 Gone el 2026-09-01; reemplazado por
  // meta/llama-3.2-90b-vision-instruct (comprobado con llamada real), que es el
  // que ya usan generate-news.ts y scripts/lib/llm.mjs.
  { name: "NVIDIA", envVar: "NVIDIA_API_KEYS", base: "https://integrate.api.nvidia.com/v1", models: ["nvidia/nemotron-3-super-120b-a12b", "meta/llama-3.2-90b-vision-instruct"] },
  { name: "Gemini", envVar: "GEMINI_API_KEYS", base: "https://generativelanguage.googleapis.com/v1beta/openai", models: ["gemini-3.5-flash", "gemini-flash-latest"] },
  { name: "Cohere", envVar: "COHERE_API_KEYS", base: "https://api.cohere.ai/compatibility/v1", models: ["command-a-03-2025"] },
  // openai/gpt-oss-20b:free dejó de ser gratis el 2026-09-01 ("This model is
  // unavailable for free. The paid version is available now"); se quita de la
  // lista porque nemotron-3-super-120b-a12b:free ya figuraba como alternativa.
  { name: "OpenRouter", envVar: "OPENROUTER_API_KEYS", base: "https://openrouter.ai/api/v1", models: ["google/gemma-4-31b-it:free", "nvidia/nemotron-3-super-120b-a12b:free"] },
  { name: "HuggingFace", envVar: "HUGGINGFACE_API_KEYS", base: "https://router.huggingface.co/v1", models: ["meta-llama/Llama-3.3-70B-Instruct"] },
];

const keysOf = (envVar) => (process.env[envVar] ?? "").split(",").map((k) => k.trim()).filter(Boolean);
const mask = (k) => (k.length > 14 ? `${k.slice(0, 6)}…${k.slice(-4)}` : `${k.slice(0, 4)}…`);

async function probe(base, model, key) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 45000);
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: ctl.signal,
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 16, messages: [{ role: "user", content: "di hola" }] }),
    });
    if (res.ok) return { ok: true, state: "OK" };
    const body = (await res.text()).replace(/\s+/g, " ").slice(0, 120);
    return { ok: false, state: `HTTP ${res.status}`, detail: body };
  } catch (err) {
    return { ok: false, state: "TIMEOUT/RED", detail: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// Todas las combinaciones a la vez: son ~30 peticiones a hosts distintos y en serie
// tardaría minutos. Cada proveedor se evalúa después con sus propios resultados.
const jobs = [];
for (const p of PROVIDERS) {
  for (const key of keysOf(p.envVar)) {
    for (const model of p.models) {
      jobs.push(probe(p.base, model, key).then((r) => ({ ...r, provider: p.name, model, key: mask(key) })));
    }
  }
}
const results = await Promise.all(jobs);

let sinClave = 0;
let caidos = 0;
for (const p of PROVIDERS) {
  const claves = keysOf(p.envVar);
  if (claves.length === 0) {
    console.log(`⚪ ${p.name}: sin clave en ${p.envVar}`);
    sinClave++;
    continue;
  }
  const propios = results.filter((r) => r.provider === p.name);
  const vivos = propios.filter((r) => r.ok);
  const icono = vivos.length > 0 ? "✅" : "❌";
  console.log(`${icono} ${p.name}: ${vivos.length}/${propios.length} combinaciones clave×modelo responden (${claves.length} clave(s))`);
  for (const r of propios.filter((x) => !x.ok)) {
    console.log(`     ✗ ${r.key} ${r.model} → ${r.state} ${r.detail ?? ""}`);
  }
  if (vivos.length === 0) caidos++;
}

const usables = PROVIDERS.length - sinClave - caidos;
console.log(`\n${usables} proveedor(es) utilizables ahora mismo, ${caidos} caído(s), ${sinClave} sin clave.`);
if (usables === 0) {
  console.error("Ningún proveedor responde: los generadores no podrían escribir nada.");
  process.exit(1);
}
