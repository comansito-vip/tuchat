/**
 * Foto de cabecera de un artículo, servida desde nuestro propio dominio.
 *
 * Hasta agosto de 2026 el `src` apuntaba a `images.unsplash.com`. Eso regalaba
 * a un tercero el tráfico de imagen de las 426 noticias y, lo que importa más,
 * el JSON-LD del artículo declaraba esa URL ajena como `image`: Google Images
 * atribuye la foto al dominio que la sirve, así que el sitio publicaba 426
 * imágenes que no podían posicionar para nosotros. Además Unsplash borra fotos
 * —`anime-2` daba 404 desde hacía meses y nadie lo vio— y una imagen rota no
 * avisa en el build.
 *
 * Ahora los ficheros viven en `public/img/noticias/` y los sirve tuchat.org.
 * Las fuentes y sus licencias se citan en el aviso legal, que es donde toca:
 * en la foto no va nada.
 */

/** Categorías con foto propia. El fichero es `{categoria}-1.jpg` y `-2.jpg`. */
const CATEGORIAS = [
  "actualidad",
  "deportes",
  "tecnologia",
  "ia",
  "cultura",
  "viajes",
  "salud",
  "economia",
  "entretenimiento",
  "anime",
  "esoterismo",
  "psicologia",
] as const;

const CON_FOTO = new Set<string>(CATEGORIAS);

function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

export function getNewsImage(category: string, slug: string): string {
  const key = slugifyCategory(category);
  const base = CON_FOTO.has(key) ? key : "actualidad";
  return `/img/noticias/${base}-${(hashSlug(slug) % 2) + 1}.jpg`;
}
