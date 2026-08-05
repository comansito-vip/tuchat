/**
 * Detecta y retira noticias que repiten a otra ya publicada.
 *
 *   npx tsx scripts/content/deduplicar-noticias.ts            (simulación)
 *   npx tsx scripts/content/deduplicar-noticias.ts --write     (aplica)
 *
 * El generador ya descarta lo que llega duplicado en la misma tanda, pero eso
 * no cubre la deriva a lo largo de los días: entre el 13 y el 18 de julio de
 * 2026 el cron publicó SEIS columnas sobre "IA generativa y creatividad", cada
 * una válida por separado y todas la misma pieza en la práctica. Seis páginas
 * compitiendo por la misma consulta no suman: se reparten las señales y ninguna
 * llega. Esta pasada las detecta a posteriori y deja la más desarrollada.
 *
 * Dos criterios, porque fallan por caminos distintos:
 *
 *   1. APERTURA IDÉNTICA — las 10 primeras palabras normalizadas coinciden. Es
 *      el mismo texto empezando igual, aunque luego diverja.
 *   2. SOLAPE TEMÁTICO — el título y la entradilla comparten demasiado
 *      vocabulario significativo. Detecta las que dicen lo mismo con otras
 *      palabras, que la apertura sola no pilla.
 *
 * De cada grupo se conserva la pieza con el cuerpo más largo (la más
 * desarrollada) y, a igualdad, la más antigua (la que ya lleva tiempo
 * publicada, por si algún enlace externo apunta a ella).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NEWS } from "../../src/data/news";
import { aperturaNormalizada, normalizarTexto } from "../../src/lib/content/muletillas";

const WRITE = process.argv.includes("--write");
const RUTA = join(import.meta.dirname, "../../src/data/news.ts");

/**
 * Umbrales. Se retira sola solo la duplicación inequívoca; lo que queda en la
 * zona gris se informa para que lo mire una persona, porque bajar el listón
 * automático borra contenido legítimo: con 0.2 el script proponía fusionar
 * "Inflación en España, mayo 2026" con "Inflación en España, junio 2026", que
 * son dos artículos distintos sobre dos meses distintos.
 */
const UMBRAL_SOLAPE = 0.3; // retirada automática
const UMBRAL_AVISO = 0.22; // solo informe

/**
 * Solape mínimo entre TÍTULOS para considerarlas la misma pieza. Es una señal
 * mucho más limpia que el cuerpo: "El renacer de la narración oral en la era
 * digital" y "El resurgir de la narrativa oral en la era digital" comparten
 * poco vocabulario de entradilla y sin embargo son, a la vista, el mismo
 * artículo publicado dos veces.
 */
const UMBRAL_TITULO = 0.55;

// Palabras vacías: sin quitarlas, dos textos en español cualquiera comparten un
// 40% de "de/la/que/en" y el solape no distingue nada.
const VACIAS = new Set(
  ("de la que el en y a los del se las por un para con no una su al lo como mas pero sus le ya o " +
    "este si porque esta entre cuando muy sin sobre tambien me hasta hay donde han quien estan " +
    "ser son fue era es han ha su sus lo les nos otro otra cada")
    .split(" "),
);

/**
 * Stemming pobre pero suficiente: truncar a 6 caracteres. Sin él, "El renacer
 * de la NARRACIÓN oral" y "El resurgir de la NARRATIVA oral" —el mismo artículo
 * escrito dos veces con dos días de diferencia— tenían un solape bajísimo,
 * porque para una comparación de conjuntos "narracion" y "narrativa" son
 * palabras sin nada que ver. Truncadas, ambas son "narrac"/"narrat"… que
 * tampoco casan: por eso el corte está en 5.
 */
const raizDe = (w: string) => w.slice(0, 5);

function vocabulario(texto: string): Set<string> {
  return new Set(
    normalizarTexto(texto)
      .split(" ")
      .filter((w) => w.length > 3 && !VACIAS.has(w))
      .map(raizDe),
  );
}

/** Jaccard: intersección sobre unión de los dos vocabularios. */
function solape(a: Set<string>, b: Set<string>): number {
  let comunes = 0;
  for (const w of a) if (b.has(w)) comunes++;
  return comunes / (a.size + b.size - comunes);
}

const items = NEWS.map((n) => ({
  ...n,
  palabras: n.body ? n.body.trim().split(/\s+/).length : 0,
  apertura: n.body ? aperturaNormalizada(n.body) : "",
  vocab: vocabulario(`${n.title} ${n.excerpt}`),
  vocabTitulo: vocabulario(n.title),
}));

/** Pares que rozan el umbral: no se tocan, se informan. */
const dudosos: [number, number, number][] = [];

/** ¿Es `b` la misma pieza que `a`? */
function esDuplicado(a: number, b: number): boolean {
  if (items[a].apertura && items[a].apertura === items[b].apertura) return true;
  if (solape(items[a].vocab, items[b].vocab) >= UMBRAL_SOLAPE) return true;
  return solape(items[a].vocabTitulo, items[b].vocabTitulo) >= UMBRAL_TITULO;
}

/**
 * Agrupación por representante, NO por transitividad.
 *
 * La primera versión usaba union-find y arrastraba falsos positivos en cadena:
 * si A se parece a B y B a C, las tres acababan en el mismo grupo aunque A y C
 * no tuvieran nada que ver. Así entró "El renacer del juego cooperativo en la
 * era digital" en el grupo de "El resurgir de la narrativa oral" —comparten el
 * molde del título, no el tema— y se habría retirado un artículo legítimo.
 *
 * Ahora cada pieza se compara contra las que YA se han decidido conservar, así
 * que toda retirada tiene un duplicado directo y demostrable detrás. Se recorre
 * de mejor a peor (más desarrollada primero, y a igualdad la más antigua, que
 * es la que puede tener enlaces externos) para que el representante de cada
 * grupo sea siempre la mejor pieza.
 */
const orden = items
  .map((_, i) => i)
  .sort((a, b) => items[b].palabras - items[a].palabras || items[a].date.localeCompare(items[b].date));

const representantes: number[] = [];
const retiradasPor = new Map<number, number[]>();

for (const i of orden) {
  const rep = representantes.find((r) => esDuplicado(r, i));
  if (rep === undefined) {
    representantes.push(i);
  } else {
    (retiradasPor.get(rep) ?? retiradasPor.set(rep, []).get(rep)!).push(i);
  }
}

// Segunda pasada, solo para el informe: parecidos que no llegan al umbral.
for (const r of representantes) {
  for (const i of orden) {
    if (i === r || retiradasPor.get(r)?.includes(i)) continue;
    const s = solape(items[r].vocab, items[i].vocab);
    if (s >= UMBRAL_AVISO && s < UMBRAL_SOLAPE) dudosos.push([r, i, s]);
  }
}

const aRetirar: string[] = [];
for (const [rep, duplicadas] of retiradasPor) {
  console.log(`\nGrupo de ${duplicadas.length + 1} piezas equivalentes:`);
  console.log(`   ✓ se conserva  ${items[rep].slug} (${items[rep].palabras}p, ${items[rep].date})`);
  for (const i of duplicadas) {
    console.log(`   ✗ se retira    ${items[i].slug} (${items[i].palabras}p, ${items[i].date})`);
    aRetirar.push(items[i].slug);
  }
}

if (dudosos.length) {
  console.log("\nParecidas, pero no lo bastante para retirarlas solas (revisar a mano):");
  for (const [i, j, s] of dudosos.sort((a, b) => b[2] - a[2]).slice(0, 12)) {
    console.log(`   ~${s.toFixed(2)}  ${items[i].slug}\n           ${items[j].slug}`);
  }
}

if (!aRetirar.length) {
  console.log("\nSin noticias duplicadas que retirar automáticamente.");
  process.exit(0);
}

console.log(`\n${aRetirar.length} noticia(s) a retirar de ${items.length}.`);

if (!WRITE) {
  console.log("(simulación; usa --write para aplicar)");
  process.exit(0);
}

// Se recorta el bloque `{ … },` completo de cada entrada. Se opera sobre el
// texto del fichero y no regenerando news.ts entero para no reescribir de paso
// el formato de las 180 piezas que no cambian: el diff debe mostrar solo lo
// que de verdad se retira.
let src = readFileSync(RUTA, "utf-8");
for (const slug of aRetirar) {
  const marca = `    slug: ${JSON.stringify(slug)},`;
  const pos = src.indexOf(marca);
  if (pos === -1) {
    console.warn(`   ⚠ no se encontró ${slug} en el fichero; se omite`);
    continue;
  }
  const inicio = src.lastIndexOf("  {\n", pos);
  const fin = src.indexOf("\n  },\n", pos);
  if (inicio === -1 || fin === -1) {
    console.warn(`   ⚠ no se pudo delimitar el bloque de ${slug}; se omite`);
    continue;
  }
  src = src.slice(0, inicio) + src.slice(fin + "\n  },\n".length);
}
writeFileSync(RUTA, src, "utf-8");
console.log("news.ts actualizado.");
