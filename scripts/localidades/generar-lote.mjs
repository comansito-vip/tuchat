#!/usr/bin/env node
/**
 * Redacta un lote pequeño de salas de localidad y lo añade al sitio.
 *
 * Va DESPACIO a propósito: 10-15 salas al día, no más. Con 1.431 en cola son
 * unos cuatro meses, y así es como debe ser — un sitio que aparece de golpe con
 * mil páginas nuevas de pueblos parece lo que Google llama páginas puerta, por
 * buenas que sean. Mejor tardar y que entren.
 *
 * Cada sala se ancla en material real de esa localidad (extracto de Wikipedia y
 * web del ayuntamiento, que vienen en la cola). Sin fuente no se escribe: el
 * modelo alucina justo en los pueblos pequeños, que son la mayoría de lo que
 * queda.
 *
 * Después de generar, VERIFICA con un proveedor distinto del que escribió. El
 * que redacta no sirve para juzgar si se lo ha inventado, porque comparte el
 * mismo punto ciego. Ante la duda se descarta la sala del lote, no se publica.
 *
 * Uso:
 *   node scripts/localidades/generar-lote.mjs [cantidad]
 *   DRY_RUN=1 node scripts/localidades/generar-lote.mjs 2   → no escribe nada
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { completar, extraeJSON } from "./llm.mjs";
import { detectarMuletillas } from "../../src/lib/content/muletillas.ts";

// En local las claves están en .env.local; en el VPS el cron las exporta desde
// .env antes de invocar el script, así que allí esto no hace nada.
function cargarEnvLocal() {
  const ruta = join(process.cwd(), ".env.local");
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, "utf8").split("\n")) {
    const m = linea.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
cargarEnvLocal();

const RAIZ = process.cwd();
const COLA = join(RAIZ, "data/localidades/pendientes.json");
const PROGRESO = join(RAIZ, "data/localidades/progreso.json");
const SALIDA = join(RAIZ, "src/data/cities-generadas.ts");
const DRY_RUN = process.env.DRY_RUN === "1";

// El tamaño varía dentro de la banda pedida (10-15). Un cron que publica
// exactamente doce salas cada día a la misma hora deja un rastro tan regular
// como el volumen que se quiere evitar.
function tamanoLote() {
  const pedido = Number(process.argv[2]);
  if (Number.isFinite(pedido) && pedido > 0) return Math.min(pedido, 15);
  return 10 + Math.floor(Math.random() * 6);
}

const cargar = (ruta, porDefecto) =>
  existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : porDefecto;

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// ───────────────────────────── Redacción ─────────────────────────────

const SISTEMA_GENERAR = `Escribes fichas de salas de chat por localidad para tuchat.org, en español de España cuando la localidad es española y en el español del país cuando es americana.

REGLAS INNEGOCIABLES:
1. Solo puedes afirmar lo que aparezca en el MATERIAL que te dan. Si no está ahí, no lo escribas. Nada de inventar fiestas, monumentos, cifras, gentilicios ni apodos: si el material no dice cómo se llama a los vecinos, no uses gentilicio.
1b. NINGUNA cifra, año, fecha ni horario que no esté literalmente en el material. Nada de horarios de misa, de mercado ni de apertura: no los tienes. Si el material no da una cifra, escribe sin ella.
2. Prohibido: "sumérgete", "descubre", "el lugar perfecto para", "ya seas X o Y", "no importa si", "en el mundo de hoy", "punto de encuentro", "todo un mundo de", "joya escondida", "no te lo puedes perder", "en definitiva", "en resumen", "en la era digital".
3. Nada de superlativos huecos ni frases de cierre motivacionales. Tono directo, como quien conoce el sitio.
4. El texto va de la SALA DE CHAT y de la gente que entra en ella, apoyándose en detalles reales del lugar. No es una guía turística.

Devuelves SOLO un objeto JSON con estas claves:
{
  "intro": "1 frase, 110-155 caracteres. Se usa como meta description. Debe incluir un detalle propio de la localidad.",
  "aboutTitle": "título de sección con nombre propio del lugar, 30-70 caracteres. Ni 'Sobre la ciudad' ni 'Sobre el chat de X'.",
  "about": "3 párrafos separados por \\n\\n, 220-320 palabras en total. Al menos un dato concreto sacado del material.",
  "icon": "un solo emoji que encaje con la localidad"
}`;

function promptGenerar(loc) {
  const partes = [
    `LOCALIDAD: ${loc.nombre}`,
    `PAÍS: ${loc.pais}`,
    loc.region ? `REGIÓN/PROVINCIA: ${loc.region}` : null,
    loc.poblacion ? `HABITANTES: ${loc.poblacion.toLocaleString("es-ES")}` : null,
    loc.gentilicio ? `GENTILICIO: ${loc.gentilicio}` : null,
    loc.comarca ? `COMARCA: ${loc.comarca}` : null,
    "",
    "MATERIAL (lo único que puedes dar por cierto):",
    loc.extracto ? `Wikipedia: ${loc.extracto}` : null,
    loc.webOficial ? `Web oficial del ayuntamiento: ${loc.webOficial}` : null,
    "",
    `Escribe la ficha de la sala de chat de ${loc.nombre}.`,
  ];
  return partes.filter(Boolean).join("\n");
}

const SISTEMA_VERIFICAR = `Compruebas si una ficha de localidad afirma cosas que su material de origen no respalda. Eres escéptico: buscas el error, no apruebas.

Repasa cada dato, cifra, fecha, fiesta, monumento o nombre propio del texto y comprueba que esté en el MATERIAL. Lo que no esté, es inventado.

NO reescribas el texto. Devuelves SOLO este JSON, sin nada más:
{"inventados": ["dato que no está en el material", "..."], "veredicto": "ok"}

- "veredicto": "ok" si no encuentras nada inventado.
- "veredicto": "corregir" si hay datos inventados pero el resto del texto sirve.
- "veredicto": "descartar" si el texto es un invento de principio a fin.
Cuando dudes de un dato, inclúyelo en "inventados": es más barato quitarlo que publicarlo.`;

// ───────────────────────── Controles automáticos ─────────────────────────

/**
 * Cifras del texto que no aparecen en el material de origen.
 *
 * El verificador es otro modelo y se le escapan cosas: en la primera prueba dejó
 * pasar unos horarios de misa ("19 h entre semana, 12 h los domingos") que no
 * estaban en ninguna fuente. Los horarios, los años y las cantidades concretas
 * son justo lo que un modelo rellena de su cosecha, y lo que más caro sale.
 *
 * Se comparan solo números de dos cifras o más: los sueltos ("dos picos", "3
 * plazas") aparecen en cualquier texto y darían falsos positivos constantes.
 */
function cifrasSinRespaldo(ficha, loc) {
  const fuente = `${loc.extracto ?? ""} ${loc.poblacion ?? ""} ${loc.webOficial ?? ""}`
    .replace(/[.\s ]/g, "");
  const texto = `${ficha.intro} ${ficha.about}`;
  const sospechosas = new Set();

  for (const bruto of texto.match(/\d[\d.,\s]*\d|\d{2,}/g) ?? []) {
    const limpio = bruto.replace(/[.,\s]/g, "");
    if (limpio.length < 2) continue;
    if (!fuente.includes(limpio)) sospechosas.add(bruto.trim());
  }
  // Las horas se escriben de muchas formas ("19 h", "19:00", "las 19"), así que
  // se marcan aparte: si el material no habla de horarios, sobra cualquier hora.
  if (/\b\d{1,2}\s*(?:h\b|:\d{2})/.test(texto) && !/\b\d{1,2}\s*(?:h\b|:\d{2})/.test(loc.extracto ?? "")) {
    sospechosas.add("un horario que la fuente no menciona");
  }
  return [...sospechosas];
}

/** Errores que no dependen del criterio de nadie: se miden. */
function problemasDeFormato(ficha, loc, yaEscritos) {
  const fallos = [];
  const palabras = ficha.about.trim().split(/\s+/).filter(Boolean).length;

  if (ficha.intro.length < 100 || ficha.intro.length > 160) {
    fallos.push(`intro de ${ficha.intro.length} caracteres (debe ir entre 100 y 160)`);
  }
  if (palabras < 180) fallos.push(`about de ${palabras} palabras (mínimo 180)`);
  if (!ficha.aboutTitle || ficha.aboutTitle.length < 20 || ficha.aboutTitle.length > 80) {
    fallos.push("aboutTitle fuera de rango (20-80 caracteres)");
  }
  // Un H2 genérico convierte la página en una plantilla con hueco.
  if (/^(sobre|acerca|qué|informaci[óo]n)\b/i.test(ficha.aboutTitle ?? "")) {
    fallos.push(`aboutTitle genérico: "${ficha.aboutTitle}"`);
  }
  const muletillas = detectarMuletillas(`${ficha.intro} ${ficha.aboutTitle} ${ficha.about}`);
  if (muletillas.length) fallos.push(`muletillas de IA: ${muletillas.join(", ")}`);

  // El nombre de la localidad tiene que aparecer: si no, el texto vale para
  // cualquier sitio, que es la definición de página puerta.
  if (!ficha.about.toLowerCase().includes(loc.nombre.toLowerCase().split(/[\/,]/)[0].trim().toLowerCase())) {
    fallos.push("el cuerpo no menciona la localidad");
  }
  const inventadas = cifrasSinRespaldo(ficha, loc);
  if (inventadas.length) fallos.push(`cifras que la fuente no respalda: ${inventadas.slice(0, 4).join(", ")}`);

  // Y ningún párrafo puede repetirse de otra sala del mismo lote o del sitio.
  for (const parrafo of ficha.about.split("\n\n")) {
    const clave = parrafo.trim().toLowerCase().slice(0, 120);
    if (clave.length > 40 && yaEscritos.has(clave)) fallos.push("párrafo repetido de otra sala");
  }
  return fallos;
}

// ───────────────────────────── Salida ─────────────────────────────

function renderFichero(salas) {
  const q = (s) => JSON.stringify(s);
  const cuerpo = salas.map((s) => {
    const lineas = [
      `    slug: ${q(s.slug)},`,
      `    name: ${q(s.name)},`,
      `    kind: "ciudad",`,
      `    icon: ${q(s.icon)},`,
      `    users: ${s.users},`,
      `    votes: ${s.votes},`,
      `    activity: ${q(s.activity)},`,
      `    parentName: ${q(s.parentName)},`,
      `    parentSlug: ${q(s.parentSlug)},`,
    ];
    if (s.provincia) lineas.push(`    provincia: ${q(s.provincia)},`);
    lineas.push(`    channels: ${JSON.stringify(s.channels)},`);
    lineas.push(`    related: ${JSON.stringify(s.related)},`);
    lineas.push(`    intro: ${q(s.intro)},`);
    lineas.push(`    aboutTitle: ${q(s.aboutTitle)},`);
    lineas.push(`    about: ${q(s.about)},`);
    return `  {\n${lineas.join("\n")}\n  },`;
  }).join("\n");

  return `import type { Place } from "./types";

// Salas de localidad redactadas por scripts/localidades/generar-lote.mjs, en
// tandas de 10-15 al día. Cada una parte del extracto de Wikipedia y de la web
// del ayuntamiento de esa localidad, y pasa por una verificación con un modelo
// distinto del que la escribió. No editar a mano: se reescribe en cada tanda.
export const CITIES_GENERADAS: Place[] = [
${cuerpo}
];
`;
}

/**
 * Vecinas reales, para que la sala no nazca huérfana.
 *
 * Enlazar a Madrid y Barcelona desde un pueblo de Zaragoza no ayuda a nadie y es
 * de las señales que delatan a un directorio generado: lo que da contexto es la
 * provincia. Se cogen primero las de la misma provincia, luego las del mismo
 * país, y solo si no hay nada se cae al país como único enlace.
 */
function relacionadas(loc, salas, generadas) {
  const todas = [...salas, ...generadas].filter((s) => s.slug !== loc.slug);
  const mismaProvincia = todas.filter((s) =>
    (s.provincia && loc.region && s.provincia === loc.region) ||
    (s.regionSlug && loc.regionSlug && s.regionSlug === loc.regionSlug));
  const mismoPais = todas.filter((s) => s.parentSlug === loc.paisSlug);

  const vecinas = [...mismaProvincia, ...mismoPais].map((s) => s.slug);
  return [...new Set([...vecinas.slice(0, 5), loc.paisSlug, "amistad"])].slice(0, 7);
}

// ───────────────────────────── Principal ─────────────────────────────

async function main() {
  const cola = cargar(COLA, []);
  const progreso = cargar(PROGRESO, { hechas: [], descartadas: [] });
  const hechas = new Set(progreso.hechas);
  const descartadas = new Set(progreso.descartadas.map((d) => d.slug));

  const pendientes = cola.filter((l) => !hechas.has(l.slug) && !descartadas.has(l.slug));
  if (!pendientes.length) {
    log("cola vacía: no queda ninguna localidad por redactar");
    return;
  }

  const lote = pendientes.slice(0, tamanoLote());
  log(`lote de ${lote.length} · quedan ${pendientes.length} en cola`);

  const { CITIES } = await import("../../src/data/cities.ts");
  const { CITIES_WORLD } = await import("../../src/data/cities-world.ts");
  const existentes = [...CITIES, ...CITIES_WORLD];
  const generadasPrevias = existsSync(SALIDA)
    ? (await import(`${SALIDA}?t=${Date.now()}`)).CITIES_GENERADAS
    : [];

  const yaEscritos = new Set();
  for (const s of [...existentes, ...generadasPrevias]) {
    for (const p of (s.about ?? "").split("\n\n")) {
      const clave = p.trim().toLowerCase().slice(0, 120);
      if (clave.length > 40) yaEscritos.add(clave);
    }
  }

  const nuevas = [];
  for (const loc of lote) {
    try {
      // Los modelos pequeños no cuentan caracteres ni palabras, así que la
      // primera versión casi siempre se queda corta. Se les devuelve el fallo
      // concreto y suelen arreglarlo a la segunda; a la tercera se abandona esa
      // localidad y se prueba mañana, en vez de publicar algo flojo.
      let ficha = null;
      let fallos = [];
      let quienGeneró = null;
      for (let intento = 1; intento <= 3 && !ficha; intento++) {
        const correccion = fallos.length
          ? `\n\nTu intento anterior falló por: ${fallos.join("; ")}. Corrígelo exactamente, contando los caracteres y las palabras antes de responder.`
          : "";
        const gen = await completar({
          system: SISTEMA_GENERAR,
          user: promptGenerar(loc) + correccion,
          maxTokens: 1600,
          // Menos creatividad en cada reintento: si se pasó de largo o de corto,
          // lo que hace falta es que siga la instrucción, no que invente otra vez.
          temperatura: intento === 1 ? 0.85 : 0.5,
          saltar: intento > 1 && quienGeneró ? [quienGeneró] : [],
        });
        quienGeneró = gen.proveedor;
        let candidata;
        try {
          candidata = extraeJSON(gen.texto);
        } catch {
          fallos = ["no devolviste un objeto JSON válido"];
          continue;
        }
        fallos = problemasDeFormato(
          { intro: "", aboutTitle: "", about: "", ...candidata }, loc, yaEscritos,
        );
        if (!fallos.length) ficha = candidata;
      }
      if (!ficha) {
        progreso.descartadas.push({ slug: loc.slug, razon: fallos.join("; ") });
        log(`  ✗ ${loc.nombre}: ${fallos.join("; ")}`);
        continue;
      }

      // Verificación adversarial con un proveedor distinto del que escribió: el
      // que redacta no detecta sus propios inventos. Solo señala; corregir es
      // trabajo del generador, porque un verificador que reescribe acaba
      // recortando el texto por debajo del mínimo (pasó con Lardero: 99 palabras).
      let veredicto = null;
      let verificador = null;
      const yaProbados = [quienGeneró];
      for (let intento = 1; intento <= 3 && !veredicto; intento++) {
        const ver = await completar({
          system: SISTEMA_VERIFICAR,
          user: `MATERIAL:\n${loc.extracto ?? "(sin extracto)"}\n${loc.webOficial ? `Web oficial: ${loc.webOficial}` : ""}\n\nFICHA:\n${JSON.stringify(ficha, null, 1)}`,
          maxTokens: 700,
          temperatura: 0.1,
          saltar: yaProbados,
        });
        yaProbados.push(ver.proveedor);
        try {
          const salida = extraeJSON(ver.texto);
          if (typeof salida.veredicto === "string") { veredicto = salida; verificador = ver.proveedor; }
        } catch { /* se prueba con otro proveedor */ }
      }
      // Sin verificación no se publica: es la regla que impide que llegue a la web
      // un dato inventado, que es lo que de verdad cuesta caro.
      if (!veredicto) {
        progreso.descartadas.push({ slug: loc.slug, razon: "ningún verificador devolvió un veredicto legible" });
        log(`  ✗ ${loc.nombre}: sin verificación`);
        continue;
      }
      const inventados = (veredicto.inventados ?? []).filter(Boolean);
      if (veredicto.veredicto === "descartar" || inventados.length > 3) {
        progreso.descartadas.push({ slug: loc.slug, razon: `verificación: ${inventados.slice(0, 4).join("; ")}` });
        log(`  ✗ ${loc.nombre}: descartada por ${verificador} (${inventados.length} invento(s))`);
        continue;
      }
      // Con uno o dos inventos, se pide al generador el mismo texto sin ellos:
      // así se conserva la longitud y el tono, que es lo que se pierde al dejar
      // reescribir al verificador.
      if (inventados.length) {
        try {
          const arreglo = await completar({
            system: SISTEMA_GENERAR,
            user: `${promptGenerar(loc)}\n\nEsta versión tuya afirmaba cosas que el material NO respalda: ${inventados.join("; ")}.\nReescríbela entera quitando esos datos y sin sustituirlos por otros inventados, manteniendo la misma longitud.\n\nVersión anterior:\n${JSON.stringify(ficha, null, 1)}`,
            maxTokens: 1600,
            temperatura: 0.4,
            saltar: [verificador],
          });
          ficha = extraeJSON(arreglo.texto);
        } catch {
          progreso.descartadas.push({ slug: loc.slug, razon: `no se pudo corregir: ${inventados.join("; ")}` });
          log(`  ✗ ${loc.nombre}: no se pudo corregir`);
          continue;
        }
      }

      // Las correcciones vuelven a medirse: al quitar un dato el texto puede
      // haberse quedado corto o haber colado una muletilla nueva.
      const fallosFinales = problemasDeFormato({ intro: "", aboutTitle: "", about: "", ...ficha }, loc, yaEscritos);
      if (fallosFinales.length) {
        progreso.descartadas.push({ slug: loc.slug, razon: `tras verificar: ${fallosFinales.join("; ")}` });
        log(`  ✗ ${loc.nombre}: tras verificar — ${fallosFinales.join("; ")}`);
        continue;
      }

      for (const p of ficha.about.split("\n\n")) {
        const clave = p.trim().toLowerCase().slice(0, 120);
        if (clave.length > 40) yaEscritos.add(clave);
      }

      // Los contadores arrancan bajos y proporcionales al tamaño real del sitio:
      // un pueblo de 8.000 habitantes con 400 conectados no se lo cree nadie.
      const base = Math.max(6, Math.round(Math.log10(Math.max(loc.poblacion ?? 8000, 1000)) * 9));
      nuevas.push({
        slug: loc.slug,
        name: loc.nombre.split("/")[0].trim(),
        icon: ficha.icon || "📍",
        users: base + Math.floor(Math.random() * 12),
        votes: base * 2 + Math.floor(Math.random() * 20),
        activity: (loc.poblacion ?? 0) > 100000 ? "Media" : "Baja",
        parentName: loc.pais,
        parentSlug: loc.paisSlug,
        provincia: loc.paisSlug === "espana" ? loc.region : undefined,
        channels: [loc.slug, loc.paisSlug, "chatzona"],
        related: relacionadas(loc, existentes, [...generadasPrevias, ...nuevas]),
        intro: ficha.intro,
        aboutTitle: ficha.aboutTitle,
        about: ficha.about,
      });
      progreso.hechas.push(loc.slug);
      log(`  ✓ ${loc.nombre} — ${quienGeneró} escribió, ${verificador} verificó`);
    } catch (err) {
      log(`  ✗ ${loc.nombre}: ${err.message}`);
    }
  }

  if (!nuevas.length) {
    log("ninguna sala superó los controles; no se toca el sitio");
    return;
  }

  if (DRY_RUN) {
    log(`DRY_RUN: ${nuevas.length} salas listas, no se escribe nada`);
    console.log(JSON.stringify(nuevas, null, 1).slice(0, 2000));
    return;
  }

  writeFileSync(SALIDA, renderFichero([...generadasPrevias, ...nuevas]));
  writeFileSync(PROGRESO, JSON.stringify(progreso, null, 1));
  log(`escritas ${nuevas.length} salas nuevas (${generadasPrevias.length + nuevas.length} en total)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
