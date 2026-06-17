/** @type {import('next-sitemap').IConfig} */
const LEAGUE_SLUGS = [
  "laliga", "premier", "seriea", "ligamx", "bundesliga", "ligue1", "argentina", "brasileirao",
];

function transformEntry(config, path) {
  const base = { loc: path, lastmod: new Date().toISOString() };

  // Home + major hub pages
  if (path === "/" || path === "/chat" || path === "/noticias" || path === "/deportes") {
    return { ...base, changefreq: "daily", priority: 1.0 };
  }
  if (
    path === "/horoscopo" || path === "/tarot" || path === "/anime" || path === "/ranking"
  ) {
    return { ...base, changefreq: "daily", priority: 0.8 };
  }

  // Sports results (live scores)
  if (path.startsWith("/resultados/")) {
    return { ...base, changefreq: "daily", priority: 0.7 };
  }

  // Chat rooms
  if (path.startsWith("/chat/")) {
    return { ...base, changefreq: "weekly", priority: 0.8 };
  }

  // Country hubs
  if (path.startsWith("/pais/")) {
    return { ...base, changefreq: "weekly", priority: 0.7 };
  }

  // Weather + lotteries (service pages)
  if (path.startsWith("/tiempo/") || path.startsWith("/loterias/")) {
    return { ...base, changefreq: "weekly", priority: 0.5 };
  }

  // Horoscopo signs
  if (path.startsWith("/horoscopo/")) {
    return { ...base, changefreq: "monthly", priority: 0.6 };
  }

  // News categories
  if (/^\/noticias\/[^/]+$/.test(path)) {
    return { ...base, changefreq: "weekly", priority: 0.6 };
  }

  // News articles
  if (path.startsWith("/noticias/articulo/")) {
    return { ...base, changefreq: "monthly", priority: 0.5 };
  }

  // Legal + static pages
  if (path.startsWith("/legal/") || path === "/contacto") {
    return { ...base, changefreq: "yearly", priority: 0.3 };
  }

  // Default
  return { ...base, changefreq: "weekly", priority: 0.6 };
}

module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat", "/admin", "/api/*", "/resultados", "/opengraph-image"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/webchat", "/admin", "/api"] }],
  },
  transform: transformEntry,
  // /chat recibe searchParams (no estática) y next-sitemap no la recoge del build:
  // se añade explícitamente junto a las páginas de resultados por liga.
  additionalPaths: async (config) =>
    Promise.all([
      config.transform(config, "/chat"),
      ...LEAGUE_SLUGS.map((slug) =>
        config.transform(config, `/resultados/${slug}`)
      ),
    ]),
};
