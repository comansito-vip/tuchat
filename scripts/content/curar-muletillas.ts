/**
 * Reescritura quirúrgica de las muletillas de IA ya publicadas.
 *
 *   npx tsx scripts/content/curar-muletillas.ts            (simulación)
 *   npx tsx scripts/content/curar-muletillas.ts --write     (aplica)
 *
 * Por qué reglas y no un LLM: las muletillas que llegan a producción son casi
 * siempre conectores de relleno en posición fija (un "En definitiva," abriendo
 * el párrafo de cierre, un "Te esperamos dentro." pegado al final). Quitarlos no
 * requiere criterio, requiere precisión — y una regla se puede revisar, repetir
 * y meter en un cron; una reescritura con LLM hay que releerla entera cada vez.
 * Lo que sí necesita criterio queda fuera a propósito y lo reporta la auditoría.
 *
 * REGLA DE SEGURIDAD: cada patrón exige el contexto que lo hace inequívoco. La
 * misma expresión puede ser relleno o prosa legítima según dónde aparezca —
 * "Una agrociudad, en resumen, situada entre Trujillo y Don Benito" (Miajadas)
 * es una frase humana correcta y NO debe tocarse, mientras que "En resumen, la
 * creatividad es una habilidad clave" abriendo el último párrafo sí es relleno.
 * Por eso los patrones de conector solo casan a principio de frase.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { detectarMuletillas } from "../../src/lib/content/muletillas";

const WRITE = process.argv.includes("--write");
const RAIZ = join(import.meta.dirname, "../..");

const FICHEROS = [
  "src/data/news.ts",
  "src/data/topics.ts",
  "src/data/topics-extra.ts",
  "src/data/topics-intereses.ts",
  "src/data/topics-adultos.ts",
  "src/data/topics-ocio.ts",
  "src/data/topics-legacy.ts",
  "src/data/topics-latinchat.ts",
  "src/data/topics-edad.ts",
  "src/data/topics-regiones.ts",
  "src/data/topics-motor.ts",
  "src/data/cities.ts",
  "src/data/cities-world.ts",
  "src/data/countries.ts",
];

interface Regla {
  nombre: string;
  buscar: RegExp;
  sustituir: (...grupos: string[]) => string;
}

/** Pone en mayúscula la primera letra, respetando tildes. */
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const REGLAS: Regla[] = [
  {
    // "En definitiva, cuidar el sueño no es un lujo" → "Cuidar el sueño no es un lujo".
    // Solo a principio de frase (tras salto de párrafo, punto o comilla de apertura
    // del literal), que es donde funciona como conector de cierre vacío.
    // El `\s*` tras el salto no es decorativo: varias piezas traían
    // "\n\n En conclusión, …" con un espacio de más y se escapaban del patrón.
    nombre: "conector «en definitiva» al abrir frase",
    buscar: /(\\n\\n|\. |")\s*En definitiva, ([a-záéíóúñü])/g,
    sustituir: (pre, letra) => `${pre}${letra.toUpperCase()}`,
  },
  {
    nombre: "conector «en resumen» al abrir frase",
    buscar: /(\\n\\n|\. |")\s*En resumen, ([a-záéíóúñü])/g,
    sustituir: (pre, letra) => `${pre}${letra.toUpperCase()}`,
  },
  {
    nombre: "conector «en conclusión» al abrir frase",
    buscar: /(\\n\\n|\. |")\s*En conclusión, ([a-záéíóúñü])/g,
    sustituir: (pre, letra) => `${pre}${letra.toUpperCase()}`,
  },
  {
    // "…que puede ser abrumadora en la era digital." → "…que puede ser abrumadora."
    // Apéndice al final de frase: no aporta nada que no diga ya el contexto.
    nombre: "coletilla «en la era digital» al cerrar frase",
    buscar: / en la era digital([.,;])/g,
    sustituir: (signo) => signo,
  },
  {
    nombre: "coletilla «en el mundo de hoy» al cerrar frase",
    buscar: / en el mundo de hoy([.,;])/g,
    sustituir: (signo) => signo,
  },
  {
    // "En la era digital, las herramientas tecnológicas…" → "Las herramientas
    // tecnológicas…". Abriendo párrafo es puro preámbulo: el artículo entero ya
    // va de eso, y era el arranque de seis piezas distintas.
    nombre: "preámbulo «En la era digital,» al abrir frase",
    buscar: /(\\n\\n|\. |")\s*En la era digital, ([a-záéíóúñü])/g,
    sustituir: (pre, letra) => `${pre}${letra.toUpperCase()}`,
  },
  {
    // Cierres motivacionales pegados al final del párrafo.
    nombre: "cierre «Te esperamos dentro»",
    buscar: / ?Te esperamos dentro\.,?/g,
    sustituir: () => "",
  },
  {
    nombre: "cierre «No esperes más»",
    buscar: / ?No esperes más[^."]*\./g,
    sustituir: () => "",
  },
  {
    // El sustituto conserva el plural de "posibilidades": cambiarlo por un
    // singular ("un margen de maniobra") rompía la concordancia de la oración
    // de relativo que suele venir detrás ("…que pueden mejorar la eficacia").
    nombre: "fórmula «un abanico de posibilidades»",
    buscar: /un abanico de posibilidades/g,
    sustituir: () => "una serie de posibilidades",
  },
  {
    nombre: "fórmula «una amplia variedad de»",
    buscar: /una amplia variedad de/g,
    sustituir: () => "unos cuantos",
  },
];

let totalCambios = 0;
const pendientes: string[] = [];

for (const rel of FICHEROS) {
  const ruta = join(RAIZ, rel);
  let texto: string;
  try {
    texto = readFileSync(ruta, "utf-8");
  } catch {
    continue;
  }

  const original = texto;
  const aplicadas: string[] = [];

  for (const regla of REGLAS) {
    let n = 0;
    texto = texto.replace(regla.buscar, (...args) => {
      n++;
      // args = [match, ...grupos, offset, string]; nos quedamos con los grupos.
      const grupos = args.slice(1, -2) as string[];
      return regla.sustituir(...grupos);
    });
    if (n) aplicadas.push(`${regla.nombre} ×${n}`);
    totalCambios += n;
  }

  // Recuento de lo que sigue ahí después de las reglas: es lo que necesita
  // criterio humano o una reescritura de verdad, y por eso no se toca sola.
  const restantes = new Map<string, number>();
  for (const m of texto.matchAll(/(?:intro|about|excerpt|body|title):\s*"((?:[^"\\]|\\.)*)"/g)) {
    for (const mul of detectarMuletillas(m[1])) {
      restantes.set(mul, (restantes.get(mul) ?? 0) + 1);
    }
  }

  if (aplicadas.length) {
    console.log(`\n${rel}`);
    for (const a of aplicadas) console.log(`   ✓ ${a}`);
    if (WRITE && texto !== original) writeFileSync(ruta, texto, "utf-8");
  }
  if (restantes.size) {
    pendientes.push(
      `${rel}: ${[...restantes].map(([m, n]) => `"${m}" ×${n}`).join(", ")}`,
    );
  }
}

console.log(
  `\n${totalCambios} sustitución(es)${WRITE ? " aplicadas" : " (simulación; usa --write para aplicar)"}`,
);

if (pendientes.length) {
  console.log("\nRequieren revisión a mano (o son prosa legítima que la lista marca de más):");
  for (const p of pendientes) console.log(`   · ${p}`);
}
