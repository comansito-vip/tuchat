const SITE = "https://tuchat.org";

// Logo cuadrado real (PWA icon) para Organization/publisher: Google espera un
// logo propio, no la opengraph-image (1200×630 con texto).
const LOGO = { "@type": "ImageObject", url: `${SITE}/icon-512.png`, width: 512, height: 512 } as const;

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
    image: [a.image ?? `${SITE}/opengraph-image`],
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
      email: "hola@tuchat.org",
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
