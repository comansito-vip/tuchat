/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat", "/admin"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/webchat", "/admin"] }],
  },
};
