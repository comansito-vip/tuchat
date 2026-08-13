const SITE = "https://www.tuchat.org";

// Logo cuadrado real (PWA icon) para Organization/publisher: Google espera un
// logo propio, no la opengraph-image (1200×630 con texto).
const LOGO = { "@type": "ImageObject", url: `${SITE}/icon-512.png`, width: 512, height: 512 } as const;

// Base de openGraph para las páginas: Next.js REEMPLAZA (no fusiona) el objeto
// openGraph del layout cuando una página define el suyo, así que siteName,
// locale e imagen se perderían en toda página con `openGraph: { url }` si no
// se extiende esta base con spread.
export const OG_BASE = {
  type: "website" as const,
  siteName: "TuChat",
  locale: "es_ES",
  images: [
    { url: "/opengraph-image", width: 1200, height: 630, alt: "TuChat — Chat gratis en español" },
  ],
};

/**
 * URL absoluta y en nuestro dominio de la imagen que declara el schema.
 *
 * Google exige al menos 1200px de ancho en la imagen de un artículo para que
 * pueda salir en resultados enriquecidos y en Discover; los ficheros de
 * `public/img/noticias/` se guardan a 1600px, así que el original vale y el
 * `<img>` de la página sigue pidiendo por su cuenta el tamaño que necesita.
 *
 * Lo que se arregla aquí es de quién es la imagen: mientras el `src` apuntaba a
 * `images.unsplash.com`, el JSON-LD declaraba una URL ajena como `image` del
 * artículo, y Google Images atribuye la foto al dominio que la sirve. Eran 426
 * artículos cediendo su imagen a un tercero.
 */
function imagenParaSchema(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") ? `${SITE}${url}` : url;
}

export interface Crumb { name: string; url: string; }

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE}${c.url}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question", name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TuChat",
    url: SITE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/chat?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionJsonLd(name: string, url: string) {
  return { "@context": "https://schema.org", "@type": "CollectionPage", name, url: `${SITE}${url}` };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
  body?: string;
  image?: string;
}) {
  const wordCount = a.body ? a.body.split(/\s+/).length : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.description,
    datePublished: `${a.date}T00:00:00Z`,
    dateModified: `${a.date}T00:00:00Z`,
    articleSection: a.category,
    inLanguage: "es",
    ...(wordCount !== undefined && { wordCount }),
    image: [imagenParaSchema(a.image) ?? `${SITE}/opengraph-image`],
    mainEntityOfPage: `${SITE}/noticias/articulo/${a.slug}`,
    author: { "@type": "Organization", name: "TuChat", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "TuChat",
      url: SITE,
      logo: LOGO,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TuChat",
    url: SITE,
    logo: LOGO,
    description:
      "Portal de chat global en español con salas por países, ciudades y temáticas.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@chatzona.org",
      contactType: "customer support",
      availableLanguage: "Spanish",
    },
  };
}

export function articleListJsonLd(articles: { slug: string; title: string; date: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/noticias/articulo/${a.slug}`,
      name: a.title,
    })),
  };
}

export function itemListJsonLd(items: { url: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
      name: item.name,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/**
 * El `<title>` de un artículo, recortado a lo que Google llega a mostrar.
 *
 * Los titulares del generador rondan los 90-110 caracteres y en la SERP se
 * cortan sobre los 65: el 42% de los 426 artículos publicados salía truncado a
 * mitad de palabra, con la parte informativa fuera. El H1 sigue llevando el
 * titular entero; esto es solo la etiqueta.
 *
 * Dos reglas, en este orden:
 *  1. Casi todos los titulares son «Tema: desarrollo del tema», así que cortar
 *     por el separador da un título natural. Pero solo si lo que queda dice algo:
 *     «Más allá del silencio» son 21 caracteres que no cuentan de qué va.
 *  2. Si el corte se queda corto, se trunca el titular entero por palabras, que
 *     conserva más información que quedarse con un enunciado vago.
 */
export function tituloArticuloSerp(titular: string, max = 65): string {
  const limpio = titular.trim();
  if (limpio.length <= max) return limpio;

  const cabeza = limpio.split(/[:—–]/)[0].trim();
  if (cabeza.length >= 35 && cabeza.length <= max) return cabeza;

  const palabras = limpio.split(/\s+/);
  let out = "";
  for (const p of palabras) {
    if ((out ? `${out} ${p}` : p).length > max - 1) break;
    out = out ? `${out} ${p}` : p;
  }
  return `${out.replace(/[,;:—–]$/, "")}…`;
}
