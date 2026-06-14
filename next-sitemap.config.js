/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat", "/admin", "/api/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/webchat", "/admin", "/api"] }],
  },
  // /resultados depende de ?liga y es dinámica, así que no entra sola en el
  // sitemap; la añadimos explícitamente (URL canónica sin parámetros).
  additionalPaths: async (config) => [await config.transform(config, "/resultados")],
};
