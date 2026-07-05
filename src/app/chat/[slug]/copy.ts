import type { Place } from "@/data";
import { getRelated } from "@/data";
import type { Crumb } from "@/lib/seo";

export function buildRoomCrumbs(place: Place): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Inicio", url: "/" }];
  if (place.parentName && place.parentSlug) {
    // Tanto países como temáticas padre viven bajo /chat/{slug} (los antiguos
    // /pais/* se consolidaron en /chat/* con 301).
    crumbs.push({ name: place.parentName, url: `/chat/${place.parentSlug}` });
  }
  crumbs.push({ name: place.name, url: `/chat/${place.slug}` });
  return crumbs;
}

export function buildFaq(place: Place): { q: string; a: string }[] {
  const relatedNames = getRelated(place.related)
    .slice(0, 3)
    .map((p) => p.name)
    .join(", ");
  return [
    {
      q: `¿El chat de ${place.name} es gratis?`,
      a: `Sí. Entras sin registro, eliges un nick de invitado y empiezas a chatear al momento. No hay cuotas ni suscripción.`,
    },
    {
      q: `¿Necesito instalar algo para chatear en ${place.name}?`,
      a: `No. El chat funciona directamente en el navegador, en el móvil y en el ordenador. Sin descargas ni aplicaciones.`,
    },
    {
      q: `¿De qué se habla en la sala de ${place.name}?`,
      a: place.about ?? place.intro,
    },
    {
      q: `¿Qué otras salas puedo visitar desde aquí?`,
      a: `Desde la sección "Otras salas que te pueden gustar" puedes acceder a ${relatedNames || "salas relacionadas"} y muchas más. Todas son gratis y sin registro.`,
    },
  ];
}

/**
 * Returns a kind-specific extra sentence for the "Sobre el chat" SEO block.
 * Each branch produces distinct, human copy — not a fill-in-the-blank template.
 */
export function aboutLead(place: Place): string {
  switch (place.kind) {
    case "ciudad":
      return (
        `Si vives en ${place.name} o la visitas, esta sala es el sitio más rápido para encontrar ` +
        `gente del barrio, preguntar sobre planes y conectar con alguien que conoce la ciudad tan bien como tú.`
      );
    case "pais":
      return (
        `Lo interesante de la sala de ${place.name} es que reúne acentos y costumbres de todas ` +
        `sus regiones: cada conversación mezcla perspectivas que no encontrarías en una sola ciudad.`
      );
    case "tematica":
      return (
        `La sala de ${place.name} funciona porque no importa de dónde seas: lo que une a la gente ` +
        `es el tema en sí, y eso hace las conversaciones más directas y más honestas.`
      );
  }
}

/**
 * Returns kind-specific bullet points for the "Qué puedes encontrar" SEO block.
 */
export function roomBullets(place: Place): string[] {
  switch (place.kind) {
    case "ciudad":
      return [
        `Gente de los barrios de ${place.name} dispuesta a quedar o simplemente charlar`,
        `Planes de fin de semana, recomendaciones de sitios y eventos locales`,
        `Conversaciones sobre la vida cotidiana en la ciudad`,
        `Nuevos contactos con quienes compartir el día a día`,
      ];
    case "pais":
      return [
        `Usuarios de todas las regiones y acentos de ${place.name}`,
        `Debates sobre actualidad, cultura y costumbres del país`,
        `Contactos de distintas ciudades con los que ampliar tu red`,
        `Conversaciones que van desde lo cotidiano hasta lo más profundo`,
      ];
    case "tematica":
      return [
        `Debates y opiniones sobre ${place.name.toLowerCase()} desde distintos puntos de vista`,
        `Recomendaciones, recursos y experiencias compartidas`,
        `Una comunidad que comparte tu interés sin juzgar`,
        `Conversaciones más abiertas que en cualquier red social`,
      ];
  }
}
