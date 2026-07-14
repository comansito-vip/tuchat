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
  // 14 salas argentinas llevaban el nombre del aglomerado del censo
  // ("Villa Dolores-Villa Sarmiento-San Pedro-Villa de las Rosas"), que nadie
  // busca ni teclea. Pasan a llamarse por su ciudad cabecera —el resto de
  // localidades siguen citadas en el texto— y sus URLs viejas, ya indexadas,
  // redirigen a la nueva. `el-salto-jalisco-2` era un duplicado literal de
  // `el-salto-jalisco`: la misma ciudad partida en dos salas.
  //
  // /pais/{slug} era contenido casi idéntico a /chat/{slug} (mismo H1, FAQ,
  // ciudades y servicios). Se consolida toda la señal SEO en /chat con un 308
  // permanente para eliminar la duplicación a escala.
  async redirects() {
    const renamed: Record<string, string> = {
      "necochea-quequen": "necochea",
      "mar-de-ajo-santa-teresita-mar-del-tuyu": "mar-de-ajo",
      "santa-maria-san-jose": "santa-maria-catamarca",
      "cosquin-santa-maria-de-punilla-bialet-masse": "cosquin",
      "villa-dolores-villa-sarmiento-san-pedro-villa-de-las-rosas": "villa-dolores",
      "rio-segundo-pilar": "rio-segundo",
      "la-falda-huerta-grande-valle-hermoso": "la-falda",
      "tanti-villa-santa-cruz-del-lago-estancia-vieja": "tanti",
      "san-pedro-la-esperanza": "san-pedro-jujuy",
      "san-martin-la-colonia": "san-martin-mendoza",
      "cutral-co-plaza-huincul": "cutral-co",
      "aberastain-la-rinconada": "la-rinconada-san-juan",
      "concepcion-arcadia-alto-verde": "concepcion-tucuman",
      "aguilares-los-sarmiento-barrio-santa-emilia": "aguilares",
      "el-salto-jalisco-2": "el-salto-jalisco",
    };
    return [
      { source: "/pais/:slug", destination: "/chat/:slug", permanent: true },
      ...Object.entries(renamed).map(([from, to]) => ({
        source: `/chat/${from}`,
        destination: `/chat/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
