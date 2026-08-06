/**
 * El catálogo de noticias debe tener exactamente una pieza destacada: es la que
 * abre la home y la que exige data.test.ts. Como la deduplicación retira bloques
 * enteros de news.ts, puede llevarse por delante justo esa, y el 2026-08-06 eso
 * llegó a producción: el sitio pasó el día sin bloque principal.
 *
 * Vive aquí y no dentro del script para poder probarla: la rama solo se ejecuta
 * los días en que hay duplicados que retirar, así que en la práctica no se
 * ejercitaba nunca hasta que fallaba.
 */

/**
 * Devuelve el fuente de news.ts con una destacada garantizada. Si ya hay alguna,
 * lo devuelve intacto; si no, marca la primera del fichero (la más reciente, que
 * es el orden en el que las escribe generate-news.ts).
 *
 * Devuelve `null` si no encuentra dónde insertarla, para que quien llame avise en
 * vez de escribir un fichero que sigue roto.
 */
export function reponerDestacada(src: string): string | null {
  if (src.includes("featured: true")) return src;

  // Tras la línea `date:` y no al abrir el bloque, para respetar el orden de campos
  // con el que renderFile escribe el fichero: slug, title, category, excerpt, date,
  // featured, body, image.
  const inicioFecha = src.indexOf("\n    date: ");
  if (inicioFecha === -1) return null;
  const finLinea = src.indexOf("\n", inicioFecha + 1);
  if (finLinea === -1) return null;

  return `${src.slice(0, finLinea)}\n    featured: true,${src.slice(finLinea)}`;
}
