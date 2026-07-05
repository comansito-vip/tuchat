import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // /pais/{slug} era contenido casi idéntico a /chat/{slug} (mismo H1, FAQ,
  // ciudades y servicios). Se consolida toda la señal SEO en /chat con un 301
  // permanente para eliminar la duplicación a escala.
  async redirects() {
    return [
      { source: "/pais/:slug", destination: "/chat/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
