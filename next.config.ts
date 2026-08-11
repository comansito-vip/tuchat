import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cuántos procesos usa Next para prerenderizar. Lo calcula solo a partir de
  // las CPU y la memoria libre de la máquina, y con 5.100 páginas eso se queda
  // corto en un equipo con otros proyectos abiertos: eligió 5 workers con 1,7 GB
  // libres y el build murió sin mensaje por la página 4.000, que es un fallo
  // difícil de leer porque no imprime error, solo deja de avanzar.
  //
  // Se toca por entorno y no en el fichero para no cambiar el VPS, que con su
  // propio cálculo construye bien: allí no se define la variable.
  ...(process.env.NEXT_BUILD_CPUS
    ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS) } }
    : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    // La escala por defecto de Next llega a 3840px y, combinada con un `sizes`
    // responsive, emite DIEZ anchos en el srcSet de cada <img>. En /noticias
    // eso eran 421 imágenes × ~2,1 KB de srcSet = 902 KB, el 70% del HTML de
    // una página que pesaba 2,24 MB. Nada de eso se usa: las tarjetas se
    // muestran a 33vw como mucho (~640 px CSS) y las fotos vienen de Unsplash
    // ya pedidas a `?w=800`, así que las variantes de 2048 y 3840 solo podían
    // devolver un reescalado hacia arriba de una imagen de 800.
    //
    // Con esta escala el filtro de Next deja 6 anchos en lugar de 10. Importa
    // más de lo que parece para el rastreo: el sitio es nuevo, tiene ~4.700
    // URLs y Google mantiene casi todas en "Descubierta: actualmente sin
    // indexar"; servir megabytes de srcSet inútil gasta presupuesto de rastreo
    // que hace falta en otro sitio.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
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
      // La sala de Latinchat pasa a ser el hub de sus 23 salas por país y ciudad,
      // y se queda el slug que la gente teclea.
      "latinchat-amigos": "latinchat",
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
