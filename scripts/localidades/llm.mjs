/**
 * Cadena de proveedores para los generadores de localidades.
 *
 * El orden sale de la auditoría del 2026-08-06 (una llamada de chat real por par
 * proveedor/modelo con todas las claves de la red): delante los que respondieron
 * con todas sus claves, detrás los que dependen de cuota escasa. Ver
 * `scripts/check-llm-providers.mjs` para repetir la comprobación.
 *
 * Groq y Cerebras comparten cuota diaria de tokens con TODOS los sitios de la
 * red —son las mismas claves—, y a media tarde suelen estar agotados. Por eso la
 * cadena es larga y por eso el cron de localidades corre de madrugada.
 */

export const PROVEEDORES = [
  { nombre: "Groq", env: "GROQ_API_KEYS", base: "https://api.groq.com/openai/v1", modelos: ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"] },
  { nombre: "Cerebras", env: "CEREBRAS_API_KEYS", base: "https://api.cerebras.ai/v1", modelos: ["gpt-oss-120b", "zai-glm-4.7"] },
  { nombre: "Mistral", env: "MISTRAL_API_KEYS", base: "https://api.mistral.ai/v1", modelos: ["mistral-large-latest", "mistral-small-latest"] },
  { nombre: "NVIDIA", env: "NVIDIA_API_KEYS", base: "https://integrate.api.nvidia.com/v1", modelos: ["nvidia/nemotron-3-super-120b-a12b", "meta/llama-3.1-70b-instruct"] },
  { nombre: "Gemini", env: "GEMINI_API_KEYS", base: "https://generativelanguage.googleapis.com/v1beta/openai", modelos: ["gemini-3.5-flash"] },
  { nombre: "HuggingFace", env: "HUGGINGFACE_API_KEYS", base: "https://router.huggingface.co/v1", modelos: ["meta-llama/Llama-3.3-70B-Instruct"] },
  { nombre: "OpenRouter", env: "OPENROUTER_API_KEYS", base: "https://openrouter.ai/api/v1", modelos: ["openai/gpt-oss-20b:free", "google/gemma-4-31b-it:free"] },
  { nombre: "Cohere", env: "COHERE_API_KEYS", base: "https://api.cohere.ai/compatibility/v1", modelos: ["command-a-03-2025"] },
];

const claves = (env) => (process.env[env] ?? "").split(",").map((k) => k.trim()).filter(Boolean);

/**
 * Pide una respuesta recorriendo la cadena hasta que una combinación responda.
 *
 * `saltar` permite pedir la verificación a un proveedor DISTINTO del que generó:
 * el que escribió el texto no es buen juez de si se lo ha inventado, porque
 * comparte el mismo punto ciego.
 */
export async function completar({ system, user, maxTokens = 1200, temperatura = 0.8, saltar = [] }) {
  const errores = [];
  for (const p of PROVEEDORES) {
    if (saltar.includes(p.nombre)) continue;
    const ks = claves(p.env);
    if (!ks.length) continue;
    for (const modelo of p.modelos) {
      for (const clave of ks) {
        try {
          const res = await fetch(`${p.base}/chat/completions`, {
            method: "POST",
            headers: { Authorization: `Bearer ${clave}`, "content-type": "application/json" },
            body: JSON.stringify({
              model: modelo,
              max_tokens: maxTokens,
              temperature: temperatura,
              messages: [{ role: "system", content: system }, { role: "user", content: user }],
            }),
            signal: AbortSignal.timeout(90000),
          });
          if (!res.ok) {
            errores.push(`${p.nombre}/${modelo}: ${res.status}`);
            continue;
          }
          const data = await res.json();
          const texto = (data.choices?.[0]?.message?.content ?? "").trim();
          if (texto) return { texto, proveedor: p.nombre, modelo };
          errores.push(`${p.nombre}/${modelo}: respuesta vacía`);
        } catch (err) {
          errores.push(`${p.nombre}/${modelo}: ${err.message}`);
        }
      }
    }
  }
  throw new Error(`ningún proveedor respondió — ${errores.slice(0, 6).join(" | ")}`);
}

/** Extrae el primer objeto JSON de una respuesta, tolerando envoltorios de markdown. */
export function extraeJSON(texto) {
  const ini = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (ini === -1 || fin === -1 || fin < ini) throw new Error("respuesta sin objeto JSON");
  return JSON.parse(texto.slice(ini, fin + 1));
}
