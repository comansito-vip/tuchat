/**
 * Controles de calidad del contenido generado, en código y no a ojo.
 *
 * Todo lo que se puede comprobar con un script se comprueba con un script: las
 * muletillas de IA, los párrafos calcados entre localidades y las meta
 * descripciones repetidas son justo lo que convierte 2.000 páginas legítimas en
 * una granja de páginas puerta, y las tres se detectan sin criterio humano.
 */

/**
 * Muletillas que delatan texto generado. Solo expresiones de varias palabras:
 * "descubre" o "sumérgete" sueltas dan falsos positivos en prosa histórica
 * legítima ("se descubrió el yacimiento en 1850").
 */
export const MULETILLAS = [
  "el lugar perfecto", "ya seas", "no importa si", "punto de encuentro ideal",
  "joya escondida", "no te lo puedes perder", "todo un mundo de",
  "en el mundo de hoy", "sumérgete en", "descubre la magia", "descubre el encanto",
  "un rincón especial", "no dudes en", "te sorprenderá", "sea cual sea",
  "tanto si", "en pleno corazón de", "un sinfín de", "lo que buscas",
  "la mejor experiencia", "sin lugar a dudas", "vibrante comunidad",
];

/** Aperturas de folleto: imperativos con los que el LLM arranca por defecto. */
const APERTURAS = /^\s*(descubre|conoce|explora|sumérgete|sumergete|vive|disfruta|bienvenid|adéntrate|adentrate|prepárate|preparate)/i;

export function muletillasEn(texto) {
  const t = (texto ?? "").toLowerCase();
  return MULETILLAS.filter((m) => t.includes(m));
}

export function aperturaDeFolleto(texto) {
  return APERTURAS.test(texto ?? "");
}

/** Cifras de población sin separador de miles: "759137" en vez de "759.137". */
export function cifrasMalFormateadas(texto) {
  return /\b\d{5,}\b/.test(texto ?? "");
}

/**
 * Un `#` inicial en el cuerpo se convierte en un segundo h1 al renderizar, y la
 * plantilla ya pone el h1 de la página. Es el fallo de integración clásico.
 */
export function empiezaConEncabezado(cuerpo) {
  return /^\s*#{1,6}\s/.test(cuerpo ?? "");
}

/** Quita el encabezado inicial en vez de tirar la ficha entera por formato. */
export function quitarEncabezadoInicial(cuerpo) {
  const m = (cuerpo ?? "").match(/^\s*#{1,6}[^\n]*\n+/);
  return m ? cuerpo.slice(m[0].length) : (cuerpo ?? "").replace(/^\s*#{1,6}\s*/, "");
}

/**
 * Jerarquía de encabezados sin saltos dentro del cuerpo.
 *
 * El cuerpo cuelga del h1 de la plantilla, así que sus secciones deben ser `##`
 * y sus subsecciones `###`. Un `###` sin un `##` por encima deja un hueco en la
 * jerarquía.
 */
export function saltosDeJerarquia(cuerpo) {
  const niveles = [...(cuerpo ?? "").matchAll(/^(#{1,6})\s/gm)].map((m) => m[1].length);
  const fallos = [];
  let previo = 1; // el h1 lo pone la plantilla
  for (const n of niveles) {
    if (n > previo + 1) fallos.push(`salto de h${previo} a h${n}`);
    previo = n;
  }
  return fallos;
}

const normalizar = (s) =>
  (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Párrafos idénticos entre localidades distintas.
 *
 * Es donde siempre se cuela la plantilla: el generador escribe dos párrafos
 * propios y luego clava el mismo "cómo entrar" en las 300 fichas del lote.
 * Se compara normalizado para que un acento o una coma no lo disimulen.
 */
export function parrafosDuplicados(fichas) {
  const vistos = new Map();
  const choques = [];
  for (const f of fichas) {
    for (const p of String(f.cuerpo ?? "").split(/\n{2,}/)) {
      const clave = normalizar(p);
      if (clave.length < 80) continue;      // encabezados y frases sueltas no cuentan
      if (vistos.has(clave)) choques.push({ a: vistos.get(clave), b: f.slug, parrafo: p.slice(0, 90) });
      else vistos.set(clave, f.slug);
    }
  }
  return choques;
}

/**
 * Fraseo calcado entre fichas, aunque el párrafo no sea idéntico.
 *
 * Es el fallo que de verdad delata la generación masiva, y el comparador de
 * párrafos exactos no lo ve. En la primera prueba salieron "Suele animarse por
 * las tardes, cuando muchos usuarios terminan su jornada laboral" y "Por las
 * tardes, cuando muchos terminan su jornada": dos fichas distintas con la misma
 * costura. Multiplicado por 1.400 localidades, eso es una plantilla con huecos.
 *
 * Se compara por cadenas de N palabras consecutivas (shingles): si una ficha
 * nueva comparte una cadena larga con otra ya publicada, es la misma frase con
 * el nombre cambiado.
 */
export function shingles(texto, n = 7) {
  const palabras = normalizar(texto).split(" ").filter(Boolean);
  const salida = new Set();
  for (let i = 0; i + n <= palabras.length; i++) {
    salida.add(palabras.slice(i, i + n).join(" "));
  }
  return salida;
}

/**
 * ¿Esta ficha repite el fraseo de alguna ya publicada? Devuelve {slug, frase}
 * de la primera coincidencia, o null.
 *
 * `indice` se construye una vez con `indiceDeShingles` para no rehacerlo por
 * cada candidata: con miles de fichas, comparar todas contra todas cada vez es
 * lo que convierte el cron en algo que no termina.
 */
export function indiceDeShingles(fichas, n = 7) {
  const indice = new Map();
  for (const f of fichas) {
    for (const s of shingles(f.about ?? "", n)) {
      if (!indice.has(s)) indice.set(s, f.slug);
    }
  }
  return indice;
}

/**
 * Exige VARIAS coincidencias con la misma ficha, no una.
 *
 * Con una sola bastaba, y saltaba con "habitantes es una de las ciudades mas",
 * que es castellano corriente y no una plantilla: dos fichas de dos ciudades
 * distintas pueden coincidir en una cadena así sin que nadie las haya calcado.
 * Tres cadenas compartidas con la MISMA ficha ya no es casualidad.
 */
export function fraseoCalcado(ficha, indice, n = 7, minimo = 3) {
  const cuenta = new Map();
  for (const s of shingles(ficha.about ?? "", n)) {
    const duena = indice.get(s);
    if (!duena || duena === ficha.slug) continue;
    const previo = cuenta.get(duena) ?? { veces: 0, frase: s };
    cuenta.set(duena, { veces: previo.veces + 1, frase: previo.frase });
  }
  for (const [slug, { veces, frase }] of cuenta) {
    if (veces >= minimo) return { slug, frase, veces };
  }
  return null;
}

/** Campos que deben ser únicos en todo el catálogo (meta description, intro). */
export function camposDuplicados(fichas, campo) {
  const vistos = new Map();
  const choques = [];
  for (const f of fichas) {
    const clave = normalizar(f[campo]);
    if (!clave) continue;
    if (vistos.has(clave)) choques.push({ a: vistos.get(clave), b: f.slug, valor: String(f[campo]).slice(0, 80) });
    else vistos.set(clave, f.slug);
  }
  return choques;
}

/**
 * Revisión completa de una ficha suelta. Devuelve la lista de problemas; vacía
 * quiere decir publicable.
 *
 * Los dos campos son los que ya usa el sitio: `intro` es además la
 * meta description de la página (generateMetadata la pasa tal cual), de ahí que
 * se le exija el rango de 110-160 caracteres; `about` es la prosa del bloque
 * "Sobre el chat de X". Ninguno de los dos admite markdown: la plantilla los
 * mete dentro de un <p>, así que un `##` saldría impreso literalmente.
 */
export function revisarFicha(ficha) {
  const problemas = [];
  const { intro = "", about = "" } = ficha;

  const m = [...muletillasEn(intro), ...muletillasEn(about)];
  if (m.length) problemas.push(`muletillas de IA: ${[...new Set(m)].join(", ")}`);

  if (aperturaDeFolleto(intro)) problemas.push("la intro empieza con un imperativo de folleto");
  if (aperturaDeFolleto(about)) problemas.push("el about empieza con un imperativo de folleto");
  if (/^\s*#{1,6}\s/m.test(about)) problemas.push("el about lleva encabezados markdown (se imprimirían literales)");
  if (cifrasMalFormateadas(about)) problemas.push("cifra de 5+ dígitos sin separador de miles");

  if (intro.length < 110 || intro.length > 160) {
    problemas.push(`intro/meta de ${intro.length} caracteres (debe estar entre 110 y 160)`);
  }
  const palabras = about.trim().split(/\s+/).filter(Boolean).length;
  // Cien palabras es poco, pero la alternativa es peor: tras quitar lo que el
  // verificador no respalda, muchas fichas se quedan en 100-110 y descartarlas
  // empujaba al generador a rellenar con lo que precisamente hay que evitar.
  if (palabras < 100) problemas.push(`about de ${palabras} palabras (mínimo 100)`);
  if (palabras > 320) problemas.push(`about de ${palabras} palabras (máximo 320)`);

  if (normalizar(intro) === normalizar(about)) {
    problemas.push("la intro y el about dicen lo mismo");
  }
  return problemas;
}
