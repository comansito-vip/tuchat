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

interface CityCoord { lat: number; lon: number; tz: string; }

const CITY_COORDS: Record<string, CityCoord> = {
  // España
  espana:          { lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  madrid:          { lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  barcelona:       { lat: 41.3874, lon:  2.1686, tz: "Europe/Madrid" },
  valencia:        { lat: 39.4699, lon: -0.3763, tz: "Europe/Madrid" },
  sevilla:         { lat: 37.3891, lon: -5.9845, tz: "Europe/Madrid" },
  bilbao:          { lat: 43.2627, lon: -2.9253, tz: "Europe/Madrid" },
  malaga:          { lat: 36.7213, lon: -4.4214, tz: "Europe/Madrid" },
  zaragoza:        { lat: 41.6561, lon: -0.8773, tz: "Europe/Madrid" },
  murcia:          { lat: 37.9922, lon: -1.1307, tz: "Europe/Madrid" },
  palma:           { lat: 39.5696, lon:  2.6502, tz: "Europe/Madrid" },
  "las-palmas":    { lat: 28.1235, lon:-15.4366, tz: "Atlantic/Canary" },
  tenerife:        { lat: 28.2916, lon:-16.6291, tz: "Atlantic/Canary" },
  alicante:        { lat: 38.3452, lon: -0.4810, tz: "Europe/Madrid" },
  cordoba:         { lat: 37.8882, lon: -4.7794, tz: "Europe/Madrid" },
  valladolid:      { lat: 41.6523, lon: -4.7245, tz: "Europe/Madrid" },
  granada:         { lat: 37.1773, lon: -3.5986, tz: "Europe/Madrid" },
  oviedo:          { lat: 43.3614, lon: -5.8593, tz: "Europe/Madrid" },
  santander:       { lat: 43.4623, lon: -3.8099, tz: "Europe/Madrid" },
  toledo:          { lat: 39.8628, lon: -4.0273, tz: "Europe/Madrid" },
  vigo:            { lat: 42.2406, lon: -8.7207, tz: "Europe/Madrid" },
  pamplona:        { lat: 42.8188, lon: -1.6444, tz: "Europe/Madrid" },
  salamanca:       { lat: 40.9701, lon: -5.6635, tz: "Europe/Madrid" },
  badajoz:         { lat: 38.8794, lon: -6.9706, tz: "Europe/Madrid" },
  donostia:        { lat: 43.3183, lon: -1.9812, tz: "Europe/Madrid" },
  // México
  mexico:          { lat: 19.4326, lon:-99.1332, tz: "America/Mexico_City" },
  "ciudad-de-mexico": { lat: 19.4326, lon:-99.1332, tz: "America/Mexico_City" },
  guadalajara:     { lat: 20.6597, lon:-103.3496, tz: "America/Mexico_City" },
  monterrey:       { lat: 25.6866, lon:-100.3161, tz: "America/Monterrey" },
  cancun:          { lat: 21.1619, lon: -86.8515, tz: "America/Cancun" },
  tijuana:         { lat: 32.5149, lon:-117.0382, tz: "America/Tijuana" },
  puebla:          { lat: 19.0414, lon: -98.2063, tz: "America/Mexico_City" },
  // Colombia
  colombia:        { lat:  4.7110, lon: -74.0721, tz: "America/Bogota" },
  bogota:          { lat:  4.7110, lon: -74.0721, tz: "America/Bogota" },
  medellin:        { lat:  6.2442, lon: -75.5812, tz: "America/Bogota" },
  cali:            { lat:  3.4516, lon: -76.5320, tz: "America/Bogota" },
  // Argentina
  argentina:       { lat:-34.6037, lon: -58.3816, tz: "America/Argentina/Buenos_Aires" },
  "buenos-aires":  { lat:-34.6037, lon: -58.3816, tz: "America/Argentina/Buenos_Aires" },
  rosario:         { lat:-32.9587, lon: -60.6930, tz: "America/Argentina/Buenos_Aires" },
  // Chile
  chile:           { lat:-33.4489, lon: -70.6693, tz: "America/Santiago" },
  santiago:        { lat:-33.4489, lon: -70.6693, tz: "America/Santiago" },
  // Perú
  peru:            { lat:-12.0464, lon: -77.0428, tz: "America/Lima" },
  lima:            { lat:-12.0464, lon: -77.0428, tz: "America/Lima" },
  // Venezuela
  venezuela:       { lat: 10.4806, lon: -66.9036, tz: "America/Caracas" },
  caracas:         { lat: 10.4806, lon: -66.9036, tz: "America/Caracas" },
  // Ecuador
  ecuador:         { lat: -0.2295, lon: -78.5243, tz: "America/Guayaquil" },
  quito:           { lat: -0.2295, lon: -78.5243, tz: "America/Guayaquil" },
  // Bolivia
  bolivia:         { lat:-16.5000, lon: -68.1500, tz: "America/La_Paz" },
  // Uruguay
  uruguay:         { lat:-34.9011, lon: -56.1645, tz: "America/Montevideo" },
  montevideo:      { lat:-34.9011, lon: -56.1645, tz: "America/Montevideo" },
  // Paraguay
  paraguay:        { lat:-25.2637, lon: -57.5759, tz: "America/Asuncion" },
  // Guatemala
  guatemala:       { lat: 14.6349, lon: -90.5069, tz: "America/Guatemala" },
  // Cuba
  cuba:            { lat: 23.1136, lon: -82.3666, tz: "America/Havana" },
  // Dominican Republic
  "republica-dominicana": { lat: 18.4861, lon: -69.9312, tz: "America/Santo_Domingo" },
  // Puerto Rico
  "puerto-rico":   { lat: 18.2208, lon: -66.5901, tz: "America/Puerto_Rico" },
  // Central America
  honduras:        { lat: 14.0818, lon: -87.2068, tz: "America/Tegucigalpa" },
  "el-salvador":   { lat: 13.6929, lon: -89.2182, tz: "America/El_Salvador" },
  nicaragua:       { lat: 12.1328, lon: -86.2926, tz: "America/Managua" },
  "costa-rica":    { lat:  9.9281, lon: -84.0907, tz: "America/Costa_Rica" },
  panama:          { lat:  8.9936, lon: -79.5197, tz: "America/Panama" },
};

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
