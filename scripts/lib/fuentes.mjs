/**
 * Fuentes reales por localidad.
 *
 * La regla del proyecto es que sin fuente propia no se escribe la página: un
 * LLM al que le preguntas por un pueblo de 9.000 habitantes se inventa la
 * fiesta patronal con total aplomo. El extracto de Wikipedia sirve de base,
 * pero es lo mismo que tiene cualquier competidor que genere con IA; lo que
 * diferencia de verdad es la web del ayuntamiento, porque ahí están las fiestas
 * con sus fechas, el mercado semanal, la feria y el polígono, y eso no está en
 * la Wikipedia.
 *
 * Aquí solo se RECOGE material. No se redacta ni se decide nada.
 */

const UA = "tuchat.org/1.0 (+https://www.tuchat.org; contacto@tuchat.org)";

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Quita script/style/nav y deja el texto visible, colapsado. */
function textoDe(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Baja la portada de la web oficial del municipio.
 *
 * Muchos ayuntamientos pequeños tienen el certificado caducado, el dominio
 * caído o responden solo por http. Un fallo aquí NO es motivo para descartar la
 * localidad: se sigue con el extracto de Wikipedia, que ya cumple el mínimo de
 * fuente propia. Por eso todo devuelve null en vez de lanzar.
 */
export async function traerWebOficial(url, { timeoutMs = 20_000 } = {}) {
  if (!url) return null;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
    }).finally(() => clearTimeout(t));
    if (!res.ok) return null;
    const tipo = res.headers.get("content-type") ?? "";
    if (!tipo.includes("html")) return null;
    const texto = textoDe(await res.text());
    // Menos de 400 caracteres es una portada vacía, un aviso de cookies o un
    // "web en construcción": no aporta nada que anclar.
    if (texto.length < 400) return null;
    return texto.slice(0, 6000);
  } catch {
    return null;
  } finally {
    await dormir(300);
  }
}

/**
 * Resumen de Wikipedia en español. Es el respaldo cuando la cola no trae
 * extracto, no la fuente principal.
 */
/**
 * El artículo ENTERO en texto plano, no el resumen.
 *
 * El endpoint `/page/summary/` devuelve solo la entradilla: entre 120 y 500
 * caracteres. Con eso el generador no puede escribir 200 palabras sin
 * inventarse la mitad, y el verificador —con razón— tira la ficha. Se vio al
 * rehacer las salas de agosto: Los Mochis llegaba con 120 caracteres de fuente
 * y Ate con cero.
 *
 * Afecta a mucho más que al rehacer: las 1.739 entradas de la cola que vienen
 * de los censos de 5.000 y 4.000 no traen extracto propio y dependen de esta
 * llamada. `prop=extracts&explaintext` devuelve el artículo completo, que suele
 * pasar de los 5.000 caracteres, y de paso resuelve redirecciones.
 */
async function traerArticuloCompleto(titulo) {
  const url = "https://es.wikipedia.org/w/api.php?action=query&format=json&formatversion=2"
    + "&prop=extracts|pageprops&explaintext=1&redirects=1&titles=" + titulo;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const pagina = (await res.json())?.query?.pages?.[0];
    if (!pagina || pagina.missing) return null;
    // Una página de desambiguación no describe ninguna localidad concreta.
    if (pagina.pageprops && "disambiguation" in pagina.pageprops) return null;
    const texto = String(pagina.extract ?? "").trim();
    return texto.length > 200 ? texto : null;
  } catch {
    return null;
  } finally {
    await dormir(200);
  }
}

/**
 * Títulos alternativos para un topónimo que a secas lleva a la desambiguación.
 *
 * «Ate» es un distrito de Lima y también un montón de cosas más, así que el
 * título pelado devuelve la página de desambiguación y la localidad se queda sin
 * fuente. Wikipedia en español desambigua casi siempre con paréntesis, y de vez
 * en cuando con el nombre administrativo delante.
 */
function titulosAlternativos(nombre, contexto) {
  const partes = String(contexto).split(/\s+/).filter((p) => p.length > 3);
  const region = partes[0];
  const pais = partes[partes.length - 1];
  const candidatos = [
    pais && `${nombre} (${pais})`,
    region && region !== pais && `${nombre} (${region})`,
    `Distrito de ${nombre}`,
    `Municipio de ${nombre}`,
  ].filter(Boolean);
  return [...new Set(candidatos)].map((t) => encodeURIComponent(t.replace(/ /g, "_")));
}

export async function traerWikipedia(nombre, contexto = "", urlArticulo = null) {
  // Si la cola trae la URL del artículo, el título sale de ahí. Adivinarlo a
  // partir del nombre manda a la página de desambiguación en cuanto el topónimo
  // se repite —"Maipú", "La Florida", "San Bernardo"—, y esas se rechazan, así
  // que se perdían localidades grandes que sí tenían artículo propio.
  const titulo = urlArticulo
    ? urlArticulo.split("/wiki/")[1] ?? encodeURIComponent(String(nombre).replace(/ /g, "_"))
    : encodeURIComponent(String(nombre).replace(/ /g, "_"));
  try {
    const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${titulo}`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation" || !data.extract) {
      // El título pelado lleva a la desambiguación: se prueban las formas con
      // paréntesis antes de darse por vencido. Solo cuando se adivinó el
      // título; si venía de Wikidata, apunta a la página buena y no hay nada
      // que buscar.
      if (urlArticulo) return null;
      for (const alt of titulosAlternativos(nombre, contexto)) {
        const texto = await traerArticuloCompleto(alt);
        if (texto) return texto;
      }
      return null;
    }
    // Con la URL del artículo no hace falta comprobar nada más: viene de
    // Wikidata y apunta a ESTA localidad. La comprobación de abajo solo tiene
    // sentido cuando el título se ha adivinado.
    // El resumen ya sirve para descartar homónimos y desambiguaciones; para el
    // TEXTO se prefiere el artículo entero, que es lo que da de comer al
    // generador. Si esa segunda llamada falla, se sigue con el resumen.
    if (urlArticulo) return (await traerArticuloCompleto(titulo)) ?? data.extract;
    // Un resumen que no menciona ni la región ni el país casi siempre es de otro
    // homónimo: hay decenas de "San Miguel" repartidos por el continente.
    const pistas = contexto.toLowerCase().split(/\s+/).filter((p) => p.length > 3);
    const texto = `${data.extract} ${data.description ?? ""}`.toLowerCase();
    if (pistas.length && !pistas.some((p) => texto.includes(p))) return null;
    return (await traerArticuloCompleto(titulo)) ?? data.extract;
  } catch {
    return null;
  } finally {
    await dormir(200);
  }
}

/**
 * Reúne todo el material disponible de una localidad y dice si llega al mínimo.
 *
 * El mínimo es tener extracto de Wikipedia (>120 caracteres) o texto real de la
 * web del ayuntamiento. Con menos que eso, la localidad se queda fuera del lote
 * en lugar de generarse a ciegas.
 */
export async function reunirMaterial(loc) {
  const material = {
    extracto: loc.extracto ?? null,
    webOficial: loc.webOficial ?? null,
    textoWeb: null,
  };

  if (!material.extracto || material.extracto.length < 120) {
    material.extracto = await traerWikipedia(
      loc.nombre,
      `${loc.region ?? ""} ${loc.pais}`,
      loc.wikipedia ?? null,
    );
  }
  material.textoWeb = await traerWebOficial(loc.webOficial);

  material.suficiente = Boolean(
    (material.extracto && material.extracto.length > 120) || material.textoWeb,
  );
  return material;
}
