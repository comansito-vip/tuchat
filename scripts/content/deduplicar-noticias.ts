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

// Union-find sencillo para agrupar por transitividad: si A repite a B y B a C,
// las tres son el mismo grupo aunque A y C no se parezcan directamente.
const padre = items.map((_, i) => i);
const raiz = (i: number): number => (padre[i] === i ? i : (padre[i] = raiz(padre[i])));
const unir = (a: number, b: number) => {
  const [ra, rb] = [raiz(a), raiz(b)];
  if (ra !== rb) padre[rb] = ra;
};

/** Pares que rozan el umbral: no se tocan, se informan. */
const dudosos: [number, number, number][] = [];

for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const mismaApertura = !!items[i].apertura && items[i].apertura === items[j].apertura;
    const s = solape(items[i].vocab, items[j].vocab);
    const sTitulo = solape(items[i].vocabTitulo, items[j].vocabTitulo);
    if (mismaApertura || s >= UMBRAL_SOLAPE || sTitulo >= UMBRAL_TITULO) {
      unir(i, j);
    } else if (s >= UMBRAL_AVISO) {
      dudosos.push([i, j, s]);
    }
  }
}

const grupos = new Map<number, number[]>();
items.forEach((_, i) => {
  const r = raiz(i);
  (grupos.get(r) ?? grupos.set(r, []).get(r)!).push(i);
});

const aRetirar: string[] = [];
for (const indices of grupos.values()) {
  if (indices.length < 2) continue;
  const orden = [...indices].sort(
    (a, b) => items[b].palabras - items[a].palabras || items[a].date.localeCompare(items[b].date),
  );
  const conservada = orden[0];
  console.log(`\nGrupo de ${indices.length} piezas equivalentes:`);
  console.log(`   ✓ se conserva  ${items[conservada].slug} (${items[conservada].palabras}p, ${items[conservada].date})`);
  for (const i of orden.slice(1)) {
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
