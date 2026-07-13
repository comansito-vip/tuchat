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

// Códigos WMO que implican precipitación (llovizna, lluvia, chubascos, nieve, tormenta).
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);

// Cuenta los días con lluvia en la previsión, para respuestas FAQ con datos reales.
export function rainyDays(data: WeatherData): number {
  return data.forecast.filter((d) => RAIN_CODES.has(d.weatherCode)).length;
}

export async function fetchWeather(slug: string): Promise<WeatherData | null> {
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
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
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
