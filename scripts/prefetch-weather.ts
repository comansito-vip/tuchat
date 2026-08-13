/**
 * Llena la caché de previsiones antes del build, en lotes.
 *
 *   npx tsx scripts/prefetch-weather.ts [--ttl 180] [--lote 100]
 *
 * POR QUÉ EXISTE
 *
 * El build del 12 de agosto de 2026 tardó 20 min 39 s, de los cuales **18,6 min**
 * fueron generar páginas. Compilar el código son 62 segundos: el tiempo no se iba
 * en el código, se iba esperando a Open-Meteo. `/tiempo` son 1.965 páginas y cada
 * una pedía su previsión por separado, con 700 ms de separación obligatoria entre
 * peticiones para no comerse un 429 (ver `MIN_MS_ENTRE_PETICIONES`). 1.965 × 0,7 s
 * son 23 minutos de reloj esperando, con el worker parado.
 *
 * Pero Open-Meteo acepta **varias coordenadas en una sola petición** —`latitude`
 * y `longitude` separadas por comas— y devuelve un array en el mismo orden. Medido
 * contra la API real: 100 localidades con los mismos campos que usa el sitio tardan
 * **0,75 s** y ocupan 80 KB. Las 1.965 caben en 20 peticiones.
 *
 * Así que no hace falta tocar la página ni el limitador: basta con dejar la caché
 * caliente antes de que el build empiece. `fetchWeather()` lee `.data/weather/` y,
 * si el fichero está fresco, no toca la red ni pide turno.
 *
 * EL RITMO: LO QUE LIMITA NO SON LAS PETICIONES, SON LAS LOCALIDADES
 *
 * La primera versión mandó los 20 lotes seguidos y Open-Meteo devolvió 429 tras
 * 668 localidades en 7,5 segundos. El límite de la API gratuita se cuenta por
 * localidad consultada (unas 600 por minuto), no por peticiones HTTP, así que
 * agrupar no regala cuota: regala **conexiones**. Por eso el ritmo se mide en
 * localidades por segundo y no en peticiones.
 *
 * A 8 localidades/s —480 por minuto, con margen bajo el límite— las 1.965 salen
 * en unos 4 minutos, frente a los 23 de pedirlas de una en una. La diferencia es
 * que aquí la espera se reparte entre lotes de 100 en vez de pagarse entera en
 * cada página.
 *
 * QUÉ NO HACE
 *
 * No falla nunca a propósito: si Open-Meteo no responde, sale con 0 y el build
 * sigue como siempre, pidiendo localidad por localidad. Es una optimización, no
 * un requisito.
 *
 * EL TIMEZONE VA POR LOTES, NO `auto`
 *
 * La página usa el huso de `coords.ts`, así que los lotes se agrupan por huso y se
 * envía el mismo `timezone` que enviaría la petición individual. Con `timezone=auto`
 * Open-Meteo resolvería el huso por coordenada y podría no coincidir en los casos
 * raros, que son justo los que nadie revisa.
 */
import { CITY_COORDS } from "../src/data/coords";
import { mapearPrevision, PARAMS_OPEN_METEO, type WeatherData } from "../src/lib/weather";
import { mkdir, writeFile, rename, readFile } from "node:fs/promises";

const arg = (n: string, d: number) => {
  const i = process.argv.indexOf(n);
  return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : d;
};

/** 24 h, el mismo que lee la página. Ver el bloque del TTL en src/lib/weather.ts. */
const TTL_MIN = arg("--ttl", Number(process.env.WEATHER_CACHE_TTL_MIN ?? 1440));
const POR_LOTE = arg("--lote", 100);
/** Localidades por segundo. El límite de Open-Meteo ronda 600/min; esto son 480. */
const RITMO = arg("--ritmo", Number(process.env.WEATHER_RITMO ?? 8));
/** Esperas tras un 429, en ms. Si se agotan, ese lote se deja para el build. */
const REINTENTOS = [5_000, 15_000, 30_000];
const DIR = "./.data/weather";
const fichero = (slug: string) => `${DIR}/${slug.replace(/[^a-z0-9-]/gi, "_")}.json`;

async function estaFresca(slug: string): Promise<boolean> {
  if (TTL_MIN <= 0) return false;
  try {
    const { t } = JSON.parse(await readFile(fichero(slug), "utf8")) as { t: number };
    return Boolean(t) && Date.now() - t <= TTL_MIN * 60_000;
  } catch {
    return false;
  }
}

async function guardar(slug: string, d: WeatherData): Promise<void> {
  const tmp = `${fichero(slug)}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify({ t: Date.now(), d }), "utf8");
  await rename(tmp, fichero(slug));
}

async function main() {
  const inicio = Date.now();
  await mkdir(DIR, { recursive: true });

  const todas = Object.keys(CITY_COORDS);
  const pendientes: string[] = [];
  for (const slug of todas) if (!(await estaFresca(slug))) pendientes.push(slug);

  console.log(`${todas.length} localidades · ${pendientes.length} sin caché fresca (TTL ${TTL_MIN} min)`);
  if (!pendientes.length) {
    console.log("nada que pedir: la caché ya está caliente");
    return;
  }

  // Un lote por huso horario, troceado a POR_LOTE. El huso se manda tal cual,
  // igual que en la petición de una sola localidad.
  const porHuso = new Map<string, string[]>();
  for (const slug of pendientes) {
    const { tz } = CITY_COORDS[slug];
    porHuso.set(tz, [...(porHuso.get(tz) ?? []), slug]);
  }

  let ok = 0;
  let fallos = 0;
  let peticiones = 0;
  let sinCuota = false;

  for (const [tz, slugs] of porHuso) {
    if (sinCuota) break;
    for (let i = 0; i < slugs.length && !sinCuota; i += POR_LOTE) {
      const lote = slugs.slice(i, i + POR_LOTE);
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lote.map((s) => CITY_COORDS[s].lat).join(",")}` +
        `&longitude=${lote.map((s) => CITY_COORDS[s].lon).join(",")}` +
        `&timezone=${encodeURIComponent(tz)}` +
        PARAMS_OPEN_METEO;

      // El coste de este lote en cuota es su número de localidades, así que la
      // pausa se calcula con él: mandar 100 y esperar 12,5 s es el mismo ritmo
      // que mandar 10 y esperar 1,25 s, pero con diez veces menos conexiones.
      const pausa = (lote.length / RITMO) * 1000;

      for (let intento = 0; ; intento++) {
        try {
          peticiones++;
          const res = await fetch(url);

          if (res.status === 429) {
            // Dos 429 distintos: el del ritmo, que se pasa esperando, y el de la
            // cuota diaria, que no se pasa hasta mañana. Insistir contra el
            // segundo son veinte lotes de espera para nada, así que se corta y se
            // deja lo que ya haya en disco, que es lo que salvará el build.
            const cuerpo = await res.text().catch(() => "");
            if (/daily/i.test(cuerpo)) {
              console.warn("  cuota DIARIA de Open-Meteo agotada: se deja de pedir");
              console.warn("  el build usará lo que quede en caché; las que falten saldrán sin previsión");
              sinCuota = true;
              fallos += lote.length;
              break;
            }
            if (intento < REINTENTOS.length) {
              await new Promise((r) => setTimeout(r, REINTENTOS[intento]));
              continue;
            }
          }
          if (!res.ok) {
            fallos += lote.length;
            console.warn(`  lote de ${lote.length} en ${tz}: HTTP ${res.status}`);
            break;
          }

          const json = await res.json();
          // Con una sola coordenada la API devuelve el objeto, no un array de uno.
          const items = Array.isArray(json) ? json : [json];
          if (items.length !== lote.length) {
            fallos += lote.length;
            console.warn(`  lote de ${lote.length} en ${tz}: devolvió ${items.length}, se descarta`);
            break;
          }
          for (let j = 0; j < lote.length; j++) {
            try {
              await guardar(lote[j], mapearPrevision(items[j]));
              ok++;
            } catch {
              fallos++;
            }
          }
          break;
        } catch (e) {
          if (intento < REINTENTOS.length) {
            await new Promise((r) => setTimeout(r, REINTENTOS[intento]));
            continue;
          }
          fallos += lote.length;
          console.warn(`  lote de ${lote.length} en ${tz}: ${(e as Error).message}`);
          break;
        }
      }

      if (!sinCuota) await new Promise((r) => setTimeout(r, pausa));
    }
  }

  const seg = ((Date.now() - inicio) / 1000).toFixed(1);
  console.log(`${ok} previsiones cacheadas · ${fallos} sin datos · ${peticiones} peticiones · ${seg}s`);
  if (sinCuota) console.warn("cortado por cuota diaria: vuelve a intentarse en el build de mañana");
}

// Nunca tumba el build: sin previsiones se construye igual, solo más despacio.
main().catch((e) => {
  console.warn(`prefetch del tiempo omitido: ${(e as Error).message}`);
});
