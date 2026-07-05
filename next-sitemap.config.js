/** @type {import('next-sitemap').IConfig} */
const LEAGUE_SLUGS = [
  "laliga", "premier", "seriea", "ligamx", "bundesliga", "ligue1", "argentina", "brasileirao",
  "mls", "saudi",
];

function transformEntry(config, path) {
  // Sin `lastmod`: un timestamp de build idéntico en las 700+ URLs le dice a
  // Google que todo cambió a la vez en cada deploy, así que aprende a ignorarlo.
  // La frescura de los artículos se expresa con datePublished/dateModified en su
  // JSON-LD (NewsArticle), señal más fiable que un lastmod falso.
  const base = { loc: path };

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
  // /pais/* se canonicaliza a /chat/* → fuera del sitemap para no enviar duplicados.
  exclude: ["/webchat", "/admin", "/api/*", "/resultados", "/opengraph-image", "/pais/*"],
  robotsTxtOptions: {
    // /webchat NO se bloquea: necesita ser rastreable para que su meta noindex
    // surta efecto (Google no lee el noindex de una URL bloqueada por robots).
    // Los bots de IA (GPTBot, ClaudeBot, PerplexityBot…) se declaran explícitamente
    // con Allow para blindar el acceso ante futuros cambios de la regla genérica y
    // señalar intención de ser citado por motores de respuesta.
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Claude-Web", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin", "/api"] },
    ],
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
