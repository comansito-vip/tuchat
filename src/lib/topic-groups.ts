import { getMergedCountries, getMergedTopics } from "@/data/merged";
import { SLUGS_APODO } from "@/data/topics-apodos";
import { getAgeTopics, getPrimaryTopics, getRegions, type Place } from "@/data";

/**
 * Catálogo de temáticas agrupado por categoría (fútbol, salud, hobbies…).
 *
 * Vivía dentro de `/chat`, que pintaba los 645 chips de golpe: 861 KB de HTML,
 * 979 enlaces y 5,7 s hasta ser interactiva en móvil (PSI, 2026-09-06). Ahora
 * `/chat` enseña solo un chip por categoría y el listado completo vive en
 * `/chat/temas`; las dos páginas agrupan con esta misma función para que no
 * se desvíen.
 */
export type TopicGroup = {
  name: string;
  /** Slug del hub (`/chat/{slug}`) cuando la categoría es a su vez una sala. */
  slug?: string;
  /** Ancla estable dentro de `/chat/temas` (#futbol, #edades, #otras-tematicas). */
  anchor: string;
  items: Place[];
  /** Gente conectada sumada: es el orden de los grupos. */
  users: number;
};

export type TopicCatalog = {
  /** Temáticas principales (amor, ligar, amistad…): tarjetas en `/chat`. */
  primaryTopics: Place[];
  groups: TopicGroup[];
  /** Salas propias de un país (argentinos, rebelión…), colgadas de su tarjeta. */
  propiasDelPais: Map<string, Place[]>;
  /** Otros nombres de una sala que ya está en la tarjeta del país (bcn, gdl…). */
  apodosDelPais: Map<string, Place[]>;
  /** Salas repartidas en los grupos (sin principales ni regiones). */
  totalEnGrupos: number;
};

function anclar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getTopicCatalog(): Promise<TopicCatalog> {
  const [countries, topics] = await Promise.all([getMergedCountries(), getMergedTopics()]);

  const primarySet = new Set(getPrimaryTopics().map((t) => t.slug));
  // Las comunidades autónomas ya se navegan desde la tarjeta de España en
  // "Países y ciudades": repetirlas como temáticas solo añade ruido.
  const regionSet = new Set(getRegions().map((r) => r.slug));
  const ageSet = new Set(getAgeTopics().map((t) => t.slug));
  // Las salas cuyo padre es un PAÍS (argentinos→argentina, rebelión→chile…) no
  // son una categoría temática: se cuelgan de la tarjeta de su país.
  const countrySet = new Set(countries.map((c) => c.slug));

  const primaryTopics = topics.filter((t) => primarySet.has(t.slug));
  const restTopics = topics.filter((t) => !primarySet.has(t.slug) && !regionSet.has(t.slug));

  const grouped = new Map<string, { name: string; slug?: string; anchor?: string; items: Place[] }>();
  const esApodo = (slug: string) => SLUGS_APODO.includes(slug);
  const propiasDelPais = new Map<string, Place[]>();
  const apodosDelPais = new Map<string, Place[]>();
  const conPadre = restTopics.filter((t) => t.parentSlug);
  const sinPadre = restTopics.filter((t) => !t.parentSlug);
  for (const t of conPadre) {
    const key = t.parentSlug!;
    if (countrySet.has(key)) {
      const destino = esApodo(t.slug) ? apodosDelPais : propiasDelPais;
      if (!destino.has(key)) destino.set(key, []);
      destino.get(key)!.push(t);
      continue;
    }
    if (!grouped.has(key)) grouped.set(key, { name: t.parentName ?? key, slug: key, items: [] });
    grouped.get(key)!.items.push(t);
  }
  // Una temática que ya encabeza su propio grupo (Latinchat, Gay Latino…) no
  // se repite como chip suelto dentro de su grupo padre.
  const groupKeys = new Set(grouped.keys());
  for (const g of grouped.values()) {
    g.items = g.items.filter((t) => !groupKeys.has(t.slug));
  }
  // Huérfanas: las salas de edad forman su propio grupo; los hubs de categoría
  // (religión, hobbies...) ya encabezan su grupo con enlace, no van a "Otras".
  const edad: Place[] = [];
  const huerfanas: Place[] = [];
  for (const t of sinPadre) {
    if (ageSet.has(t.slug)) edad.push(t);
    else if (!grouped.has(t.slug)) huerfanas.push(t);
  }
  if (edad.length) grouped.set("edades", { name: "Por edades", anchor: "edades", items: edad });

  // Por gente conectada, no por número de salas: ordenar por cardinalidad subía
  // Fútbol (73 equipos) y hundía Amor, Ligar o Amistad, que son la intención
  // dominante de quien llega aquí.
  const groups: TopicGroup[] = [...grouped.values()]
    .map((g) => ({
      ...g,
      anchor: g.anchor ?? g.slug ?? anclar(g.name),
      users: g.items.reduce((sum, t) => sum + t.users, 0),
    }))
    .sort((a, b) => b.users - a.users);
  if (huerfanas.length) {
    groups.push({
      name: "Otras temáticas",
      anchor: "otras-tematicas",
      items: huerfanas,
      users: huerfanas.reduce((sum, t) => sum + t.users, 0),
    });
  }

  return {
    primaryTopics,
    groups,
    propiasDelPais,
    apodosDelPais,
    totalEnGrupos: groups.reduce((sum, g) => sum + g.items.length, 0),
  };
}
