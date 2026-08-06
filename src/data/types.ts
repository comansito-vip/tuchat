export type RoomKind = "pais" | "ciudad" | "tematica";
export type RoomTag = "Popular" | "Nueva" | "Tendencia";

export interface Place {
  slug: string;          // "madrid"
  name: string;          // "Madrid"
  kind: RoomKind;
  icon: string;          // emoji flag/icon
  flagSrc?: string;      // ruta a bandera real local (regiones sin emoji-bandera, ej. "/flags/regiones/andalucia.png")
  users: number;         // approx connected
  votes: number;
  tag?: RoomTag;
  activity: "Alta" | "Media" | "Baja";
  parentName?: string;   // "España" (for cities)
  parentSlug?: string;   // "espana"
  provincia?: string;    // "Madrid" — división administrativa real (solo ciudades españolas por ahora)
  regionSlug?: string;   // "madrid-comunidad" — slug de la sala de comunidad autónoma (topics-regiones.ts), para agrupar
  channels: string[];    // ["madrid","espana","amistad","chatzona"]
  related: string[];     // related slugs
  intro: string;         // human, location-specific paragraph
  about?: string;        // longer SEO block (cities)
  // Título del bloque `about`. Existe para que el H2 lleve nombre propio del
  // lugar ("El puerto, la sal y las conversaciones de agosto") en vez del
  // genérico "Sobre el chat de X", que convierte la página en una plantilla con
  // hueco a ojos de Google. Lo redacta el generador de localidades.
  aboutTitle?: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;          // ISO
  featured?: boolean;
  body?: string;         // cuerpo del artículo (párrafos separados por \n\n)
  image?: string;        // URL de imagen destacada (Unsplash CDN)
}

export interface TrendItem { label: string; href: string; }
