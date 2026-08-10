export interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  icon: string;
}

export interface WeatherData {
  current: {
    temp: number;
    weatherCode: number;
    windSpeed: number;
    precipitation: number;
  };
  maxTemp: number;
  minTemp: number;
  icon: string;
  forecast: WeatherDay[];
}

// 1.966 localidades geocodificadas contra Open-Meteo (ver scripts/geocode-cities.ts).
// Antes esto era un diccionario de 59 ciudades escrito a mano, pero /tiempo genera
// página para TODAS las salas de ciudad: 1.970 de ellas servían un "Sin datos
// meteorológicos disponibles" bajo un título que prometía la previsión.
import { CITY_COORDS } from "@/data/coords";

// Las localidades que Open-Meteo no supo resolver (~60: agregados tipo
// "Necochea-Quequén", que no son un municipio único) siguen sin coordenadas.
// hasWeather() permite excluirlas de la generación de páginas en vez de
// publicarlas vacías.
export function hasWeather(slug: string): boolean {
  return slug in CITY_COORDS;
}

const WMO_ICONS: Array<[number[], string]> = [
  [[0], "☀️"],
  [[1, 2, 3], "🌤️"],
  [[45, 48], "🌫️"],
  [[51, 53, 55, 56, 57], "🌦️"],
  [[61, 63, 65, 66, 67], "🌧️"],
  [[71, 73, 75, 77], "🌨️"],
  [[80, 81, 82], "🌧️"],
  [[85, 86], "🌨️"],
  [[95, 96, 99], "⛈️"],
];

export function wmoIcon(code: number): string {
  for (const [codes, icon] of WMO_ICONS) {
    if (codes.includes(code)) return icon;
  }
  return "❓";
}

const WMO_TEXT: Array<[number[], string]> = [
  [[0], "cielo despejado"],
  [[1, 2, 3], "intervalos nubosos"],
  [[45, 48], "niebla"],
  [[51, 53, 55, 56, 57], "llovizna"],
  [[61, 63, 65, 66, 67], "lluvia"],
  [[71, 73, 75, 77], "nieve"],
  [[80, 81, 82], "chubascos"],
  [[85, 86], "chubascos de nieve"],
  [[95, 96, 99], "tormenta"],
];

export function wmoText(code: number): string {
  for (const [codes, text] of WMO_TEXT) {
    if (codes.includes(code)) return text;
  }
  return "condiciones variables";
}

/** Lo que Google llega a mostrar de una meta description antes de cortarla. */
const MAX_DESCRIPTION = 170;

/**
 * Meta description de /tiempo/[ciudad], armada con la previsión real.
 *
 * Se construye por variantes de más completa a más corta y se emite la primera
 * que cabe, en vez de recortar la frase final por caracteres: cortar dejaba la
 * description a media palabra en las localidades de nombre largo con
 * cualificador (Concepción (Paraguay), San Marcos (Guatemala), Ushuaia se iban
 * a 173-178). Lo primero que se cae es la coletilla de la previsión a N días;
 * lo último, la temperatura, que es el dato por el que se busca.
 */
export function weatherMetaDescription(
  nombreSEO: string,
  ubicacion: string | undefined,
  w: WeatherData | null,
): string {
  const conUbicacion = ubicacion ? `${nombreSEO} (${ubicacion})` : nombreSEO;

  if (!w) {
    return elegir([
      `Previsión del tiempo en ${conUbicacion}: temperaturas, lluvia y viento para los próximos días. Consulta el forecast actualizado en TuChat.`,
      `Previsión del tiempo en ${nombreSEO}: temperaturas, lluvia y viento para los próximos días. Consulta el forecast actualizado en TuChat.`,
      `Previsión del tiempo en ${nombreSEO}: temperaturas, lluvia y viento día a día.`,
    ]);
  }

  const ahora = `${Math.round(w.current.temp)}°C y ${wmoText(w.current.weatherCode).toLowerCase()} ahora`;
  const rango = `máxima de ${w.maxTemp}° y mínima de ${w.minTemp}°`;
  const cola = `Previsión a ${w.forecast.length} días con lluvia y viento.`;

  return elegir([
    `${conUbicacion}: ${ahora}, ${rango}. ${cola}`,
    `${conUbicacion}: ${ahora}, ${rango}.`,
    `${nombreSEO}: ${ahora}, ${rango}. ${cola}`,
    `${nombreSEO}: ${ahora}, ${rango}.`,
    `${nombreSEO}: ${ahora}.`,
  ]);
}

/** La primera variante que cabe; si ninguna cabe, la última recortada. */
function elegir(variantes: string[]): string {
  for (const v of variantes) if (v.length <= MAX_DESCRIPTION) return v;
  return variantes[variantes.length - 1].slice(0, MAX_DESCRIPTION - 1).trimEnd() + "…";
}

// Códigos WMO que implican precipitación (llovizna, lluvia, chubascos, nieve, tormenta).
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);

// Cuenta los días con lluvia en la previsión, para respuestas FAQ con datos reales.
export function rainyDays(data: WeatherData): number {
  return data.forecast.filter((d) => RAIN_CODES.has(d.weatherCode)).length;
}

/**
 * Espera entre reintentos. Corta a propósito: el build tiene que terminar, y lo
 * que se combate aquí es un pico de peticiones simultáneas, no una caída.
 */
const ESPERA_REINTENTO = [250, 750, 2500];

/**
 * Separación mínima entre dos peticiones a Open-Meteo desde este proceso.
 *
 * El plan gratuito admite del orden de 600 peticiones por minuto y el build las
 * reparte entre los cinco workers de Next: a 700 ms por worker salen unas 430
 * al minuto, con margen. Reintentar no bastaba —el build pasó de 1.332 páginas
 * sin previsión a 467— porque el problema no era que fallara una petición
 * suelta, sino el ritmo al que se lanzaban todas.
 *
 * No penaliza el runtime: la espera se calcula sobre la ÚLTIMA petición hecha,
 * así que una visita aislada a /tiempo/madrid no espera nada.
 */
export const MIN_MS_ENTRE_PETICIONES = 700;

let proximaLibre = 0;

/** Reserva el siguiente hueco y espera a que llegue. */
async function turno(): Promise<void> {
  const ahora = Date.now();
  const inicio = Math.max(ahora, proximaLibre);
  proximaLibre = inicio + MIN_MS_ENTRE_PETICIONES;
  if (inicio > ahora) await new Promise((r) => setTimeout(r, inicio - ahora));
}

/**
 * Pide la previsión reintentando lo que merece la pena reintentar.
 *
 * POR QUÉ: el build pide las 1.965 localidades con los cinco workers de Next y
 * Open-Meteo empieza a devolver 429. Antes, un solo `!res.ok` devolvía null y
 * la página se prerenderizaba con "Sin datos meteorológicos disponibles" bajo un
 * <h1> que promete la previsión —1.332 páginas del build del 2026-08-10, con un
 * 30% de ellas todavía así en producción, porque el ISR solo las arregla cuando
 * alguien las visita—. La API no estaba caída: 40 peticiones seguidas responden
 * 200. Era el ritmo.
 *
 * Un 4xx que no sea 429 no se reintenta: la petición está mal formada y
 * repetirla solo gasta tiempo de build.
 */
async function pedirConReintento(url: string): Promise<Response | null> {
  for (let intento = 0; ; intento++) {
    try {
      await turno();
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) return res;
      const merecePena = res.status === 429 || res.status >= 500;
      if (!merecePena || intento >= ESPERA_REINTENTO.length) return null;
    } catch {
      if (intento >= ESPERA_REINTENTO.length) return null;
    }
    await new Promise((r) => setTimeout(r, ESPERA_REINTENTO[intento]));
  }
}

/**
 * Previsiones ya pedidas en este proceso, por slug.
 *
 * `tiempo/[ciudad]` pide la previsión dos veces —en generateMetadata, para
 * poner la temperatura real en la description, y en el cuerpo—. Next deduplica
 * el fetch, pero el turno del limitador se consumía igual: cada página gastaba
 * dos huecos de 700 ms y el build tardaba el doble sin motivo. Guardando la
 * promesa, la segunda llamada no toca la red ni pide turno.
 *
 * Vive lo que vive el proceso: en el build es lo que dura el build, y en
 * runtime lo recicla el reinicio de pm2. La frescura de los datos la sigue
 * gobernando `revalidate: 3600` del propio fetch.
 */
const enCurso = new Map<string, Promise<WeatherData | null>>();

export function fetchWeather(slug: string): Promise<WeatherData | null> {
  const yaPedida = enCurso.get(slug);
  if (yaPedida) return yaPedida;
  const promesa = pedirPrevision(slug);
  enCurso.set(slug, promesa);
  return promesa;
}

async function pedirPrevision(slug: string): Promise<WeatherData | null> {
  const coord = CITY_COORDS[slug];
  if (!coord) return null;

  const { lat, lon, tz } = coord;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&timezone=${encodeURIComponent(tz)}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
    `&forecast_days=5`;

  try {
    const res = await pedirConReintento(url);
    if (!res) return null;
    const d = await res.json();

    const days: WeatherDay[] = (d.daily.time as string[]).map((date, i) => ({
      date,
      maxTemp: Math.round(d.daily.temperature_2m_max[i]),
      minTemp: Math.round(d.daily.temperature_2m_min[i]),
      weatherCode: d.daily.weather_code[i],
      icon: wmoIcon(d.daily.weather_code[i]),
    }));

    return {
      current: {
        temp: d.current.temperature_2m,
        weatherCode: d.current.weather_code,
        windSpeed: Math.round(d.current.wind_speed_10m),
        precipitation: d.current.precipitation,
      },
      maxTemp: days[0]?.maxTemp ?? Math.round(d.current.temperature_2m),
      minTemp: days[0]?.minTemp ?? Math.round(d.current.temperature_2m),
      icon: wmoIcon(d.current.weather_code),
      forecast: days,
    };
  } catch {
    return null;
  }
}
