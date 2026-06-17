export type RoomKind = "pais" | "ciudad" | "tematica";
export type RoomTag = "Popular" | "Nueva" | "Tendencia";

export interface Place {
  slug: string;          // "madrid"
  name: string;          // "Madrid"
  kind: RoomKind;
  icon: string;          // emoji flag/icon
  users: number;         // approx connected
  votes: number;
  tag?: RoomTag;
  activity: "Alta" | "Media" | "Baja";
  parentName?: string;   // "España" (for cities)
  parentSlug?: string;   // "espana"
  channels: string[];    // ["madrid","espana","amistad","chatzona"]
  related: string[];     // related slugs
  intro: string;         // human, location-specific paragraph
  about?: string;        // longer SEO block (cities)
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
