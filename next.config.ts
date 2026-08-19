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
    // Sin `remotePatterns` a propósito: no queda ninguna imagen fuera de
    // tuchat.org. Volver a añadir un host aquí es volver a regalar el tráfico
    // de imagen —y la atribución en Google Images— a un tercero.
  },
  /**
   * Caché de las imágenes que se sirven tal cual desde `public/`.
   *
   * Next las devuelve con `Cache-Control: public, max-age=0`, así que Cloudflare
   * las guardaba pero revalidaba **contra el VPS en cada visita**
   * (`cf-cache-status: REVALIDATED`). Eso no se notaba mientras las fotos venían
   * de Unsplash y las banderas de flagcdn, porque las servía el CDN de cada uno
   * con su propio TTL; al traérnoslas, el viaje al origen pasó a ser nuestro.
   *
   * Afecta sobre todo a lo que NO pasa por el optimizador —los 30 escudos de
   * /deportes van en un `<img>` normal— y a lo que piden los rastreadores y las
   * redes sociales, que leen la URL del fichero directamente desde el JSON-LD y
   * las etiquetas og:.
   *
   * 30 días y no `immutable`: los nombres no llevan hash del contenido
   * (`actualidad-2.jpg`), así que si algún día se sustituye una foto en su sitio
   * conviene que el navegador acabe enterándose solo. En el borde se arregla al
   * momento con `npm run cf:purge`.
   */
  async headers() {
    const unMes = "public, max-age=2592000";
    return [
      { source: "/img/:ruta*", headers: [{ key: "Cache-Control", value: unMes }] },
      { source: "/flags/:ruta*", headers: [{ key: "Cache-Control", value: unMes }] },
    ];
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
      // El cron de goteo publicó once salas con el envoltorio administrativo
      // que les pone Wikidata en el nombre («Partido de Tandil» en vez de
      // «Tandil») y una con un guion suelto en el slug. Cinco de ellas eran
      // además el mismo pueblo que una sala que ya existía, así que se borraron
      // y apuntan a la buena; las otras siete se renombraron. Corregido en el
      // origen: preparar-dataset.mjs limpia el prefijo antes de encolar.
      "area-metropolitana-de-piura": "piura",
      "partido-de-san-martin": "san-martin",
      "partido-de-san-miguel": "san-miguel",
      "partido-de-olavarria": "olavarria",
      "partido-de-tandil": "tandil",
      "ventanilla-": "ventanilla",
      "distrito-de-carabayllo": "carabayllo",
      "partido-de-jose-c-paz": "jose-c-paz",
      "distrito-de-lurigancho-chosica": "lurigancho-chosica",
      "distrito-de-majes": "majes",
      "distrito-de-huaral": "huaral",
      "distrito-de-paita": "paita",
      // Lima Metropolitana es un área metropolitana, no una localidad: el propio
      // verificador la rechaza cada vez que se intenta reescribir, y `lima` ya
      // tiene su sala.
      "lima-metropolitana": "lima",
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
