/**
 * Detección de localidades que ya tienen sala, aunque figuren con otro nombre.
 *
 * Hace falta porque el censo del INE usa el nombre oficial completo y el sitio
 * usa el corriente: "Vitoria-Gasteiz" contra "Vitoria", "Pamplona/Iruña" contra
 * "Pamplona", "Las Palmas de Gran Canaria" contra "Las Palmas". Comparando solo
 * el nombre normalizado, las tres parecían faltar y el generador habría creado
 * una segunda sala de cada una — que es exactamente el contenido duplicado que
 * hunde a un dominio.
 *
 * Se comprueba en capas, de la más barata a la más cara, y basta que una acierte.
 */

export const norm = (s) =>
  (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Formas alternativas con las que una misma localidad aparece escrita.
 * "Castelló de la Plana/Castellón de la Plana" → ambas mitades por separado;
 * "Vitoria-Gasteiz" → "vitoria" y "gasteiz"; "Las Palmas de Gran Canaria" →
 * también "las palmas", cortando por la preposición.
 */
export function variantesDe(nombre) {
  const salida = new Set();
  const añade = (s) => { const n = norm(s); if (n.length > 2) salida.add(n); };

  añade(nombre);
  for (const mitad of nombre.split("/")) {
    añade(mitad);
    // Nombre bilingüe unido por guion: cada parte suele valer por sí sola.
    if (/^[^\s]+-[^\s]+$/.test(mitad.trim())) for (const p of mitad.split("-")) añade(p);
    // Corte por preposición: "Las Palmas de Gran Canaria" → "Las Palmas".
    const corte = mitad.match(/^(.*?)\s+(?:de|del|de la|de los|de las)\s+/i);
    if (corte && corte[1].trim().length > 3) añade(corte[1]);
    // Artículo pospuesto del INE: "Palmas de Gran Canaria, Las", "Eliana, l'",
    // "Vall d'Uixó, la". El apóstrofo se pega al nombre: l' + Eliana = l-eliana.
    const coma = mitad.match(/^(.*),\s*(els?|els|las?|los|l'|es|sa|ses|o|a)\s*$/i);
    if (coma) {
      const [, base, art] = coma;
      añade(base);
      añade(art.endsWith("'") ? `${art}${base}` : `${art} ${base}`);
    }
  }
  return [...salida];
}

/** Distancia aproximada en kilómetros (fórmula del haverseno). */
export function distanciaKm(a, b) {
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Construye el índice de lo que ya existe: slugs, nombres, variantes y posición.
 * `coords` es el mapa slug → {lat, lon} de src/data/coords.ts.
 */
export function indexar(salas, coords = {}) {
  const claves = new Set();
  const situadas = [];
  for (const sala of salas) {
    claves.add(sala.slug);
    for (const v of variantesDe(sala.name)) claves.add(v);
    const c = coords[sala.slug];
    if (c) situadas.push({ slug: sala.slug, nombre: sala.name, lat: c.lat, lon: c.lon });
  }
  return { claves, situadas };
}

/**
 * ¿Esta localidad ya tiene sala? Devuelve el slug de la existente, o null.
 *
 * El umbral geográfico es de 12 km y exige además que los nombres compartan
 * arranque: sin esa condición, en áreas metropolitanas densas (el Gran Buenos
 * Aires, el corredor del Henares) municipios distintos y legítimos quedarían
 * marcados como duplicados unos de otros.
 */
/**
 * Topónimos que el censo da en su forma oficial y el sitio tiene en la corriente,
 * y que ninguna regla general puede emparejar porque no se parecen en nada.
 *
 * La lista se amplía a mano con lo que saque `revisar.json`: es preferible una
 * entrada explícita aquí que aflojar el radio geográfico, que emparejaría
 * municipios vecinos legítimos en las áreas conurbadas.
 */
export const EQUIVALENCIAS = {
  eivissa: "ibiza",
  calp: "calpe",
  sopela: "sopelana",
  mao: "mahon",
  "a-guarda": "la-guardia",
  ontinyent: "onteniente",
  xativa: "jativa",
  alacant: "alicante",
  castello: "castellon",
  lleida: "lerida",
  girona: "gerona",
  ourense: "orense",
  arrasate: "mondragon",
  "donostia-san-sebastian": "san-sebastian",
};

export function yaExiste(indice, candidata) {
  for (const v of variantesDe(candidata.nombre)) {
    const equivalente = EQUIVALENCIAS[v];
    if (equivalente && indice.claves.has(equivalente)) return equivalente;
  }

  for (const v of variantesDe(candidata.nombre)) {
    if (indice.claves.has(v)) return v;
  }
  if (candidata.slug && indice.claves.has(candidata.slug)) return candidata.slug;

  const c = candidata.coords;
  if (c && typeof c.lat === "number" && typeof c.lon === "number") {
    const propias = variantesDe(candidata.nombre);
    for (const sala of indice.situadas) {
      const km = distanciaKm(c, sala);
      // Prácticamente en el mismo punto: es la misma localidad con otro nombre,
      // aunque no se parezcan en nada. Es lo que pilla los topónimos en lengua
      // cooficial que el censo da en su forma oficial y el sitio en la corriente
      // —Eivissa/Ibiza, Calp/Calpe, Sopela/Sopelana—, donde comparar cadenas no
      // sirve de nada. Dos municipios distintos no comparten centro urbano.
      if (km <= 3) return sala.slug;
      if (km > 12) continue;
      // Entre 3 y 12 km ya puede haber dos municipios legítimos y distintos
      // (áreas metropolitanas), así que ahí sí se exige parecido en el nombre.
      const suyas = variantesDe(sala.nombre);
      const parecidos = propias.some((p) =>
        suyas.some((s) => s.startsWith(p.slice(0, 6)) || p.startsWith(s.slice(0, 6))));
      if (parecidos) return sala.slug;
    }
  }
  return null;
}

/**
 * Sala existente más próxima dentro de `radioKm`, sin mirar el nombre.
 *
 * No sirve para descartar por sí sola —a 10 km puede haber dos municipios
 * distintos y legítimos—, pero sí para apartar la candidata y mirarla a mano
 * antes de publicar. Así aparecieron Eivissa (a 7,5 km de la sala `ibiza`, por
 * la diferencia entre el centroide del municipio y el del núcleo urbano) y
 * Sopela, que en el sitio está como `sopelana`.
 */
export function vecinaMasCercana(indice, candidata, radioKm = 10) {
  const c = candidata.coords;
  if (!c || typeof c.lat !== "number") return null;
  let mejor = null;
  for (const sala of indice.situadas) {
    const km = distanciaKm(c, sala);
    if (km <= radioKm && (!mejor || km < mejor.km)) mejor = { ...sala, km: Math.round(km * 10) / 10 };
  }
  return mejor;
}
