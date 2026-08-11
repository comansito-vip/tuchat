import type { Place } from "@/data";
import { getRelated, getPlace, getCitiesByProvincia, getCitiesByRegion, getChildren, getRegions } from "@/data";
import type { Crumb } from "@/lib/seo";
import { hasWeather } from "@/lib/weather";
import { LOTERIA_INFO } from "@/lib/lottery-info";

/**
 * Copy de la landing de cada sala.
 *
 * REGLA DE ESTE FICHERO: cada frase que sale de aquí o bien se apoya en un dato
 * real y propio de esa sala (su provincia, su comunidad, sus canales IRC, las
 * salas hermanas que existen de verdad), o bien NO SE EMITE.
 *
 * El motivo no es estético. La versión anterior tenía tres moldes de texto que
 * solo cambiaban el nombre —1.996 ciudades compartían el mismo párrafo y los
 * mismos cuatro bullets— y Search Console lo reflejaba con crudeza: las salas
 * estaban "Descubiertas: actualmente sin indexar", es decir, Google las conocía
 * y decidía no indexarlas. Eso es la definición de página puerta. Preferimos
 * menos texto y todo cierto: si a una sala le faltan datos, se le muestran
 * menos bullets en lugar de rellenarlos con prosa intercambiable.
 */

// Índice de regiones con sala, construido una vez: buildRoomCrumbs se llama una
// vez por sala al prerenderizar 2.600 páginas y un find() lineal sobre las 26
// regiones se pagaría en cada una.
let REGION_POR_SLUG: Map<string, Place> | null = null;
const regionDe = (slug: string | undefined): Place | undefined => {
  if (!slug) return undefined;
  REGION_POR_SLUG ??= new Map(getRegions().map((r) => [r.slug, r]));
  return REGION_POR_SLUG.get(slug);
};

export function buildRoomCrumbs(place: Place): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Inicio", url: "/" }];
  if (place.parentName && place.parentSlug) {
    // Tanto países como temáticas padre viven bajo /chat/{slug} (los antiguos
    // /pais/* se consolidaron en /chat/* con 308).
    crumbs.push({ name: place.parentName, url: `/chat/${place.parentSlug}` });
  }
  // La comunidad o el estado van entre el país y la ciudad: es la jerarquía real
  // —Vigo está en Galicia, no cuelga de España a secas— y es lo que da a las 26
  // salas de región sus enlaces entrantes. Sin esto solo las enlaza el listado
  // de su país, un único enlace, que en un dominio cuyo problema medido es de
  // rastreo equivale a no existir. Son 963 ciudades las que lo ganan.
  const region = regionDe(place.regionSlug);
  if (region && region.slug !== place.slug) {
    crumbs.push({ name: region.name, url: `/chat/${region.slug}` });
  }
  crumbs.push({ name: place.name, url: `/chat/${place.slug}` });
  return crumbs;
}

// ───────────────────────── Utilidades ─────────────────────────

/**
 * Hash estable del slug. Reparte las variantes de redacción de forma
 * determinista: la misma sala escribe siempre igual (importante, porque el HTML
 * se prerenderiza y no debe bailar entre builds), pero dos salas vecinas no
 * comparten el molde sintáctico.
 */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function variante<T>(opciones: T[], slug: string, sal = 0): T {
  return opciones[(hashSlug(slug) + sal) % opciones.length];
}

/** "A, B y C" — enumeración en español, con la conjunción al final. */
function enumerar(nombres: string[]): string {
  if (nombres.length <= 1) return nombres[0] ?? "";
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

/** Salas hermanas de provincia, rotadas de forma estable por sala. */
function hermanasProvincia(place: Place): Place[] {
  const hermanas = getCitiesByProvincia(place);
  if (!hermanas.length) return [];
  // Sin la rotación, las 30 ciudades de una provincia citarían todas a las
  // mismas tres vecinas (las primeras del array) y volveríamos a tener un
  // bloque repetido, ahora dentro de cada provincia.
  const inicio = hashSlug(place.slug) % hermanas.length;
  return [...hermanas.slice(inicio), ...hermanas.slice(0, inicio)];
}

function comunidadDe(place: Place): Place | null {
  return place.kind === "ciudad" && place.regionSlug ? getPlace(place.regionSlug) ?? null : null;
}

/**
 * Canales reales de la sala: el principal y los demás.
 *
 * La fuente de verdad es `place.channels`, NO el slug. `resolveChannels()`
 * devuelve ese array tal cual y el webchat entra a todos sus canales, pero el
 * slug no tiene por qué ser uno de ellos: en 2.395 de las 2.547 salas no lo es.
 * `espana` entra a #españa (con eñe), `estados-unidos` a #usa, `belice` a
 * #internacional y `mas-de-30` a #mas_de_30 (con guion bajo). Dar por hecho que
 * el canal se llama como el slug hacía anunciar canales que no existen — y en
 * este proyecto hay canales deliberadamente vetados, así que inventar nombres
 * no es un detalle cosmético.
 */
function canalesDe(place: Place): { principal: string | null; otros: string[]; propio: boolean } {
  const [principal = null, ...otros] = place.channels;
  return { principal, otros, propio: principal !== null && mismoNombre(principal, place.slug) };
}

/**
 * ¿Canal y slug son el mismo nombre escrito de otra forma?
 *
 * El slug va sin tildes y con guiones; el canal del servidor conserva la eñe y
 * usa guion bajo. `espana`/`españa`, `republica-dominicana`/`republica_dominicana`
 * y `mas-de-30`/`mas_de_30` son el mismo sitio, y compararlos en crudo hacía
 * decir a la sala de España que "no tiene un canal solo para ella".
 */
function mismoNombre(canal: string, slug: string): boolean {
  const n = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[_-]/g, "");
  return n(canal) === n(slug);
}

// ───────────────────── Tarjetas de "Más sobre X" ─────────────────────

export interface ServiceCard {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

/**
 * Las tarjetas de servicio que la sala puede ofrecer de verdad.
 *
 * La condición no es cosmética: `/tiempo/[ciudad]` y `/loterias/[pais]` declaran
 * ambas `dynamicParams = false` y solo generan las entradas que tienen datos
 * reales detrás —previsión geocodificada en un caso, sorteos verificados en el
 * otro—, así que enlazar a una localidad sin previsión no lleva a una página
 * pobre: lleva a un 404. Eran 76 enlaces internos rotos, y se reponían solos con
 * cada tanda de salas del cron de goteo, porque las localidades nuevas llegan
 * sin coordenadas.
 *
 * Se comprueba con el mismo predicado que usa `generateStaticParams` de cada
 * ruta, no con una lista paralela: una copia se desincroniza a la primera.
 */
export function roomServiceCards(place: Place): ServiceCard[] {
  const cards: ServiceCard[] = [
    {
      icon: "📰",
      title: `Noticias de ${place.name}`,
      desc: `Mantente al día con las últimas noticias relacionadas con ${place.name}.`,
      href: "/noticias",
      cta: "Ver noticias →",
    },
  ];

  if (place.kind !== "tematica" && hasWeather(place.slug)) {
    cards.push({
      icon: "🌤️",
      title: `Tiempo en ${place.name}`,
      desc: `Consulta la previsión del tiempo para planificar tu día en ${place.name}.`,
      href: `/tiempo/${place.slug}`,
      cta: "Ver el tiempo →",
    });
  }

  if (place.kind === "pais" && place.slug in LOTERIA_INFO) {
    cards.push({
      icon: "🎰",
      title: `Loterías de ${place.name}`,
      desc: `Resultados y fechas de los sorteos más populares de ${place.name}.`,
      href: `/loterias/${place.slug}`,
      cta: "Ver loterías →",
    });
  }

  return cards;
}

// ───────────────────── Párrafo de contexto ─────────────────────

/**
 * Segundo párrafo del bloque "Sobre el chat": sitúa la sala en su lugar real
 * dentro del catálogo (provincia, comunidad, país, salas vecinas) para que
 * quien llega desde Google entienda dónde está y por dónde seguir.
 *
 * Devuelve null cuando la sala no tiene datos con los que decir nada cierto: en
 * ese caso la página muestra solo su `about`, que sí es propio.
 */
export function aboutLead(place: Place): string | null {
  if (place.kind === "ciudad") return leadCiudad(place);
  if (place.kind === "pais") return leadPais(place);
  return leadTematica(place);
}

/**
 * La provincia, solo si dice algo que el nombre de la ciudad no diga ya.
 *
 * En América buena parte del dataset nombra la división administrativa por su
 * capital —"Santiago de Cuba, en Provincia de Santiago de Cuba", "La Habana, en
 * provincia de La Habana"—, así que la frase del encaje se quedaba en una
 * tautología. Y en once salas era la única frase del párrafo, con lo que las
 * once compartían molde: exactamente lo que este fichero existe para evitar.
 */
function provinciaQueAporta(place: Place): string | undefined {
  if (!place.provincia) return undefined;
  const n = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return n(place.provincia).includes(n(place.name)) ? undefined : place.provincia;
}

function leadCiudad(place: Place): string | null {
  const comunidad = comunidadDe(place);
  const hermanas = hermanasProvincia(place);
  const vecinas = hermanas.slice(0, 3).map((c) => c.name);
  const provincia = provinciaQueAporta(place);
  const partes: string[] = [];

  // 1. Encaje administrativo: provincia y comunidad son datos verificados del
  //    dataset (padrón del INE para España), no una suposición del redactor.
  //    En 14 ciudades americanas la provincia Y la región se llaman igual que
  //    ellas (Buenos Aires, Aguascalientes, Campeche, Colima…) y la frase salía
  //    "Buenos Aires está en Buenos Aires, dentro de Buenos Aires": ahí el
  //    encaje no sitúa nada y no se emite.
  if (place.provincia && comunidad && (provincia || comunidad.name !== place.name)) {
    partes.push(
      variante(
        [
          `${place.name} pertenece a la provincia de ${place.provincia}, en ${comunidad.name}.`,
          `La sala cubre ${place.name} y su entorno, en la provincia de ${place.provincia} (${comunidad.name}).`,
          `Administrativamente ${place.name} está en ${place.provincia}, dentro de ${comunidad.name}.`,
        ],
        place.slug,
      ),
    );
  } else if (provincia && place.parentName) {
    partes.push(
      variante(
        [
          `${place.name} está en ${provincia}, ${place.parentName}.`,
          `La sala corresponde a ${place.name}, en ${provincia} (${place.parentName}).`,
          `${place.name} pertenece a ${provincia}, ${place.parentName}.`,
        ],
        place.slug,
      ),
    );
  }

  // 2. Vecindario real: cuántas salas hay al lado y cómo se llaman.
  //    Las 575 ciudades sin provincia en el dataset (buena parte de América)
  //    no pueden decir nada de su encaje administrativo, así que su vecindario
  //    sale de `related`, que sí es distinto en 562 de ellas. Antes caían todas
  //    en un "X es una de las salas de Y del portal" que no informaba de nada.
  if (vecinas.length >= 2) {
    const cuantas = hermanas.length;
    partes.push(
      variante(
        [
          `En la misma provincia hay ${cuantas} salas más —${enumerar(vecinas)}, entre otras— y se salta de una a otra sin volver a elegir nick.`,
          `Cerca funcionan las salas de ${enumerar(vecinas)}; en total ${cuantas} de la misma provincia, todas con el mismo nick de invitado.`,
          `Comparte provincia con otras ${cuantas} salas, ${enumerar(vecinas)} entre ellas, y el nick sirve para todas.`,
        ],
        place.slug,
        1,
      ),
    );
  } else if (comunidad && getCitiesByRegion(comunidad.slug).length > 1) {
    // Con una sola localidad la frase se leía "Es una de las 1 localidades de
    // Campeche con sala propia": ni concuerda ni dice nada, porque esa única
    // localidad es la propia sala.
    const enLaComunidad = getCitiesByRegion(comunidad.slug).length;
    partes.push(
      `Es una de las ${enLaComunidad} localidades de ${comunidad.name} con sala propia en el portal.`,
    );
  } else {
    const ciudadesCerca = getRelated(place.related)
      .filter((r) => r.kind === "ciudad")
      .slice(0, 3)
      .map((r) => r.name);
    if (ciudadesCerca.length >= 2) {
      // Solo lo comprobable: que están enlazadas y que el nick vale para todas.
      // Antes había dos variantes ("las salas con las que más gente comparte",
      // "las más transitadas por quienes entran a esta") que afirmaban un
      // comportamiento de usuarios del que no existe ninguna medición.
      partes.push(
        variante(
          [
            `Desde aquí se pasa a las salas de ${enumerar(ciudadesCerca)} sin volver a elegir nick.`,
            `Está enlazada con las salas de ${enumerar(ciudadesCerca)}.`,
            `Sus salas vecinas en el catálogo son ${enumerar(ciudadesCerca)}.`,
          ],
          place.slug,
          2,
        ),
      );
    }
  }

  return partes.length ? partes.join(" ") : null;
}

function leadPais(place: Place): string | null {
  const ciudades = getChildren(place.slug).filter((c) => c.kind === "ciudad");
  if (!ciudades.length) return null;
  // Las ciudades citadas son las de mayor actividad del país, no una ventana
  // rotada por hash: con la rotación, España —que tiene 893— abría nombrando
  // Capdepera, Andratx, Santa Margalida y Campos, cuatro pueblos de Mallorca
  // seguidos en el array. Son salas reales, pero como muestra de un país entero
  // no dicen nada y transmiten justo lo contrario de lo que se pretende.
  const muestra = [...ciudades]
    .sort((a, b) => b.users - a.users)
    .slice(0, 4)
    .map((c) => c.name);
  const provincias = new Set(ciudades.map((c) => c.provincia).filter(Boolean));

  const encaje = provincias.size
    ? `${ciudades.length} salas de ciudad repartidas por ${provincias.size} provincias`
    : `${ciudades.length} salas de ciudad`;

  return variante(
    [
      `Por debajo de esta sala cuelgan ${encaje}: ${enumerar(muestra)} y el resto están a un clic en el listado de abajo.`,
      `${place.name} tiene ${encaje} en el portal —${enumerar(muestra)}, entre otras—, y esta sala es la que las reúne a todas.`,
      `Esta es la sala general de ${place.name}; de ella dependen ${encaje}, como ${enumerar(muestra)}.`,
    ],
    place.slug,
  );
}

function leadTematica(place: Place): string | null {
  const { principal, otros } = canalesDe(place);
  const relacionadas = getRelated(place.related)
    .filter((r) => r.kind === "tematica")
    .slice(0, 3)
    .map((r) => r.name);
  const partes: string[] = [];

  // Solo se afirma lo que consta en el catálogo: a qué canales conecta la sala.
  // Las versiones anteriores decían cosas como "donde suele haber gente a
  // cualquier hora" o "no es un canal vacío esperando al primero que llegue":
  // suenan bien y no las sostiene ningún dato — no hay analítica de ocupación
  // por canal. Un dato inventado en 500 páginas es peor que una frase menos.
  if (principal) {
    const todos = [principal, ...otros].map((c) => `#${c}`);
    partes.push(
      variante(
        [
          `Al entrar, la sala abre ${enumerar(todos)} en el servidor.`,
          `Detrás de ${place.name} están los canales ${enumerar(todos)}.`,
          `La sala vuelca sobre ${enumerar(todos)}, todos con el mismo nick.`,
        ],
        place.slug,
      ),
    );
  }

  if (relacionadas.length >= 2) {
    partes.push(
      variante(
        [
          `Desde aquí se enlaza con ${enumerar(relacionadas)}.`,
          `Las salas más cercanas en temática son ${enumerar(relacionadas)}.`,
          `Está emparejada en el catálogo con ${enumerar(relacionadas)}.`,
        ],
        place.slug,
        1,
      ),
    );
  }

  return partes.length ? partes.join(" ") : null;
}

// ─────────────────── Bullets: hechos, no adjetivos ───────────────────

/**
 * Lista de datos comprobables de la sala. Antes eran cuatro frases de relleno
 * idénticas en 2.000 páginas ("una comunidad que comparte tu interés sin
 * juzgar"); ahora cada línea afirma algo que se puede verificar mirando el
 * catálogo. Si un dato no existe para esa sala, esa línea no aparece.
 */
export function roomBullets(place: Place): string[] {
  const bullets: string[] = [];
  const { principal, otros, propio } = canalesDe(place);
  const comunidad = comunidadDe(place);
  const hermanas = hermanasProvincia(place);

  if (principal) {
    // Se distingue si la sala tiene canal propio o entra al de su zona. La
    // mayoría de municipios pequeños no tienen canal: comparten el de su
    // provincia o comunidad, y así está decidido a propósito para no partir a
    // cuatro personas en cuatro canales vacíos. Decir "entras al canal
    // #extremadura" sin más hacía pensar que la sala de Miajadas se había
    // equivocado de sitio; explicarlo es más honesto y menos confuso.
    const resto = otros.length ? `, y desde él a ${enumerar(otros.map((c) => `#${c}`))}` : "";
    // "las salas de la zona" solo tiene sentido en geografía: la sala de Naruto
    // entra a #anime, y eso no es una zona sino su categoría.
    const compartido =
      place.kind === "tematica"
        ? `el canal que comparten las salas de su categoría`
        : `el canal que comparten las salas de la zona`;
    bullets.push(
      propio
        ? `Entras al canal propio de la sala, #${principal}${resto}`
        : `Entras a #${principal}, ${compartido}${resto}`,
    );
  }

  if (place.kind === "ciudad") {
    if (place.provincia && hermanas.length) {
      bullets.push(
        `Otras ${hermanas.length} salas de ${place.provincia}: ${enumerar(hermanas.slice(0, 4).map((c) => c.name))}…`,
      );
    } else {
      // Sin provincia en el dataset, el vecindario sale de `related`: son
      // ciudades reales del catálogo y distintas en casi todas las salas.
      const cerca = getRelated(place.related)
        .filter((r) => r.kind === "ciudad")
        .slice(0, 4)
        .map((r) => r.name);
      if (cerca.length) bullets.push(`Salas cercanas en el portal: ${enumerar(cerca)}`);
    }
    if (comunidad) bullets.push(`Sala hermana de ${comunidad.name}, que agrupa a toda la comunidad`);
    if (place.parentName) bullets.push(`Cuelga de la sala general de ${place.parentName}, con gente de todo el país`);
  }

  if (place.kind === "pais") {
    const ciudades = getChildren(place.slug).filter((c) => c.kind === "ciudad");
    if (ciudades.length) bullets.push(`${ciudades.length} salas de ciudad propias dentro de ${place.name}`);
    const provincias = new Set(ciudades.map((c) => c.provincia).filter(Boolean));
    if (provincias.size)
      bullets.push(`Cobertura de ${provincias.size} provincias o departamentos del país`);
  }

  if (place.kind === "tematica") {
    const rel = getRelated(place.related).slice(0, 4).map((r) => r.name);
    if (rel.length) bullets.push(`Enlazada con las salas de ${enumerar(rel)}`);
    if (place.parentName) bullets.push(`Forma parte del bloque de ${place.parentName}`);
  }

  bullets.push(
    `Sin registro: eliges un nick de invitado y entras; el mismo nick vale para el resto de salas`,
  );

  return bullets;
}

// ─────────────────────────── FAQ ───────────────────────────

/**
 * Preguntas frecuentes de la sala.
 *
 * Solo entran preguntas cuya RESPUESTA cambia de una sala a otra. Las genéricas
 * ("¿es gratis?", "¿hay que instalar algo?") se contestaban antes aquí con un
 * texto idéntico en las 2.547 páginas: eso son 2.547 copias del mismo párrafo
 * dentro del schema FAQPage, justo la señal que no queremos emitir. Esa
 * información sigue en el sitio, pero una sola vez y en su sitio: /como-funciona,
 * enlazada desde cada sala.
 */
export function buildFaq(place: Place): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [];
  const { principal, otros, propio } = canalesDe(place);
  const hermanas = hermanasProvincia(place);
  const comunidad = comunidadDe(place);
  const relacionadas = getRelated(place.related).slice(0, 4);

  // 1. De qué se habla: la respuesta es el `about` de la sala, único por sala
  //    (redactado a partir de datos verificados de la localidad).
  faq.push({
    q: `¿De qué se habla en el chat de ${place.name}?`,
    a: place.about ?? place.intro,
  });

  // 2. A qué canal se entra: distinto en cada sala, y es lo que más pregunta
  //    quien viene de otro portal de chat.
  if (principal) {
    const extra = otros.length
      ? ` La sala conecta además con ${enumerar(otros.map((c) => `#${c}`))}, así que puedes moverte entre ellos con el mismo nick sin volver a entrar.`
      : ` Eliges un nick de invitado en el recuadro de arriba y entras directamente, sin registro ni instalación.`;
    faq.push({
      q: `¿A qué canal entro desde la sala de ${place.name}?`,
      a:
        (propio
          ? `Al canal #${principal}, que es el propio de esta sala.`
          : `A #${principal}. ${place.name} no tiene un canal solo para ella: comparte el ${
              place.kind === "tematica" ? "de su categoría" : "de su zona"
            }, que es donde está la conversación.`) + extra,
    });
  }

  // 3. Vecindario: respuesta con nombres reales del catálogo.
  if (place.kind === "ciudad" && hermanas.length) {
    faq.push({
      q: `¿Hay salas de otras localidades de ${place.provincia}?`,
      a:
        `Sí, ${hermanas.length} más: ${enumerar(hermanas.slice(0, 6).map((c) => c.name))}` +
        `${hermanas.length > 6 ? " y el resto de la provincia" : ""}. ` +
        (comunidad
          ? `También existe la sala de ${comunidad.name}, que reúne a toda la comunidad.`
          : `Todas funcionan igual y comparten el mismo nick de invitado.`),
    });
  } else if (place.kind === "pais") {
    const ciudades = getChildren(place.slug).filter((c) => c.kind === "ciudad");
    if (ciudades.length)
      faq.push({
        q: `¿Qué ciudades de ${place.name} tienen sala propia?`,
        // Mismas que cita el párrafo de contexto: las de mayor actividad, no
        // las cinco primeras del array (que dependen del orden de carga).
        a: `${ciudades.length} en total. Las tienes listadas más abajo en esta misma página, agrupadas para poder buscar la tuya; entre ellas ${enumerar(
          [...ciudades].sort((a, b) => b.users - a.users).slice(0, 5).map((c) => c.name),
        )}.`,
      });
  } else if (relacionadas.length >= 2) {
    faq.push({
      q: `¿Qué otras salas se parecen a la de ${place.name}?`,
      a: `Las más cercanas son ${enumerar(relacionadas.map((r) => r.name))}. Las tienes enlazadas al final de la página, en "Otras salas que te pueden gustar".`,
    });
  }

  return faq;
}
