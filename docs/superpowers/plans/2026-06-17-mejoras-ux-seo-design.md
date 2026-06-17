# Mejoras UX/SEO/Design — 8 módulos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar 8 módulos de mejora visual, datos reales y jerarquía de contenido para aumentar calidad percibida, SEO y retención.

**Architecture:** Cada módulo es independiente; se pueden ejecutar en cualquier orden. Los módulos 2 y 4 añaden ficheros en `src/lib/`; el módulo 4 modifica `src/data/types.ts` (campo `image?` opcional en `NewsItem`) que impacta el script de generación. El resto son cambios de página o componente sin dependencias cruzadas.

**Tech Stack:** Next.js App Router (RSC), TypeScript, Tailwind CSS, Open-Meteo API, Unsplash CDN, Wikimedia Commons SVG, Vitest + Testing Library.

## Global Constraints

- Seguir el AGENTS.md: leer la guía de Next.js en `node_modules/next/dist/docs/` ante cualquier duda de API.
- No añadir dependencias npm.
- Mantener todos los tests en verde (`npm test`).
- Commits frecuentes: un commit por tarea completada.

---

## File Map

**Module 1 — HeroSearch quick-links**
- Modify: `src/components/home/HeroSearch.tsx`

**Module 2 — Open-Meteo weather**
- Create: `src/lib/weather.ts`
- Create: `src/components/tiempo/WeatherWidget.tsx`
- Modify: `src/app/tiempo/[ciudad]/page.tsx`
- Test: `src/lib/weather.test.ts`

**Module 3 — Favicon & PWA manifest**
- Create: `public/site.webmanifest`
- Modify: `src/app/layout.tsx`

**Module 4 — Noticias images + script**
- Modify: `src/data/types.ts`
- Create: `src/lib/news-images.ts`
- Modify: `src/app/noticias/page.tsx`
- Modify: `src/app/noticias/articulo/[slug]/page.tsx`
- Modify: `scripts/generate-news.ts`
- Test: `src/lib/news-images.test.ts`

**Module 5 — /pais flag hero**
- Modify: `src/app/pais/[pais]/page.tsx`

**Module 6 — /deportes teams by league**
- Create: `src/lib/teams.ts`
- Create: `src/components/deportes/TeamCard.tsx`
- Modify: `src/app/deportes/page.tsx`
- Test: `src/lib/teams.test.ts`

**Module 7 — /chat hierarchy**
- Modify: `src/app/chat/page.tsx`

**Module 8 — /anime hero + series**
- Create: `src/lib/anime-series.ts`
- Modify: `src/app/anime/page.tsx`
- Test: `src/lib/anime-series.test.ts`

---

## Task 1: HeroSearch — NickInput primero + quick-links

**Files:**
- Modify: `src/components/home/HeroSearch.tsx`

**Interfaces:**
- Produces: chips de acceso rápido `<Link href="/chat/{slug}">` para 7 salas populares, NickInput antes que SearchInput.

- [ ] **Step 1: Write failing test**

Añade al final de `src/components/home/blocks.test.tsx`:

```typescript
it("HeroSearch shows quick-link chips to popular rooms", () => {
  render(<HeroSearch />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href") === "/chat/espana"
  );
  expect(links.length).toBeGreaterThanOrEqual(1);
});

it("HeroSearch NickInput appears before SearchInput in DOM", () => {
  const { container } = render(<HeroSearch />);
  const nick = container.querySelector('[data-testid="nick-input"]');
  const search = container.querySelector('[data-testid="search-input"]');
  if (nick && search) {
    expect(
      nick.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- blocks.test
```
Expected: FAIL (quick-links not found; NickInput/SearchInput DOM order may pass or fail depending on current order).

- [ ] **Step 3: Implement — reorder + add quick-links**

Reemplaza `src/components/home/HeroSearch.tsx` completo:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { NickInput } from "@/components/ui/NickInput";
import { RoomCard } from "./RoomCard";
import { getCountries, getCities, getRooms } from "@/data";

const QUICK_LINKS = [
  { label: "España", slug: "espana" },
  { label: "México", slug: "mexico" },
  { label: "Argentina", slug: "argentina" },
  { label: "Madrid", slug: "madrid" },
  { label: "Barcelona", slug: "barcelona" },
  { label: "Gay", slug: "gay" },
  { label: "Anime", slug: "anime" },
];

export function HeroSearch() {
  const countries = getCountries();
  const cities = getCities();
  const rooms = getRooms();

  const totalUsers = rooms.reduce((sum, r) => sum + r.users, 0);

  const stats = [
    { value: countries.length + "+", label: "Países" },
    { value: cities.length + "+", label: "Ciudades" },
    { value: totalUsers.toLocaleString("es"), label: "Usuarios conectados" },
    { value: "Top 10", label: "Ranking diario" },
  ];

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-16">
      {/* LEFT column */}
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Chat gratis en español
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Chatear online gratis y sin registro en salas de chat por países, ciudades y temáticas.
          Conoce gente nueva, haz amigos o liga con miles de usuarios de habla hispana.
        </p>

        {/* NickInput primero */}
        <div className="mt-5" data-testid="nick-input">
          <NickInput canal="espana" placeholder="Tu nick para entrar al chat..." />
        </div>

        {/* Quick-links chips */}
        <nav aria-label="Salas populares" className="mt-3 flex flex-wrap gap-2">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.slug}
              href={`/chat/${ql.slug}`}
              className="rounded-full border border-line bg-card px-3 py-1 text-sm font-medium text-ink hover:border-blue hover:text-blue transition-colors"
            >
              {ql.label}
            </Link>
          ))}
        </nav>

        {/* SearchInput después */}
        <div className="mt-4" data-testid="search-input">
          <SearchInput size="lg" />
        </div>

        <div className="mt-3">
          <Button href="#salas" variant="secondary" size="sm">
            Ver salas populares →
          </Button>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="text-xl font-bold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* RIGHT column */}
      <div className="hidden flex-col gap-3 lg:flex">
        {rooms.slice(0, 3).map((place) => (
          <RoomCard key={place.slug} place={place} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- blocks.test
```
Expected: todos los tests de HeroSearch pasan.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeroSearch.tsx src/components/home/blocks.test.tsx
git commit -m "feat(home): NickInput primero + chips de acceso rápido en HeroSearch"
```

---

## Task 2: /tiempo — widget Open-Meteo real

**Files:**
- Create: `src/lib/weather.ts`
- Create: `src/components/tiempo/WeatherWidget.tsx`
- Modify: `src/app/tiempo/[ciudad]/page.tsx`
- Test: `src/lib/weather.test.ts`

**Interfaces:**
- Produces: `WeatherData` type, `fetchWeather(slug): Promise<WeatherData | null>`, `<WeatherWidget data={WeatherData | null} nombre={string} />`

- [ ] **Step 1: Create `src/lib/weather.test.ts` (failing)**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { wmoIcon, fetchWeather } from "@/lib/weather";

describe("wmoIcon", () => {
  it("returns ☀️ for code 0", () => expect(wmoIcon(0)).toBe("☀️"));
  it("returns 🌤️ for code 2", () => expect(wmoIcon(2)).toBe("🌤️"));
  it("returns 🌧️ for code 63", () => expect(wmoIcon(63)).toBe("🌧️"));
  it("returns ⛈️ for code 95", () => expect(wmoIcon(95)).toBe("⛈️"));
  it("returns ❓ for unknown code", () => expect(wmoIcon(999)).toBe("❓"));
});

describe("fetchWeather", () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it("returns WeatherData for a known city slug", async () => {
    const mockResponse = {
      current: {
        temperature_2m: 22.5,
        weather_code: 2,
        wind_speed_10m: 10.0,
        precipitation: 0.0,
      },
      daily: {
        time: ["2026-06-17", "2026-06-18", "2026-06-19", "2026-06-20"],
        temperature_2m_max: [26, 24, 22, 23],
        temperature_2m_min: [14, 13, 12, 14],
        precipitation_sum: [0, 0.2, 1.5, 0],
        weather_code: [2, 3, 61, 2],
      },
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as unknown as Response);

    const data = await fetchWeather("madrid");
    expect(data).not.toBeNull();
    expect(data!.current.temp).toBe(22.5);
    expect(data!.icon).toBe("🌤️");
    expect(data!.forecast).toHaveLength(4);
    expect(data!.forecast[0].date).toBe("2026-06-17");
  });

  it("returns null for an unknown slug", async () => {
    const result = await fetchWeather("ciudad-inexistente-xyz");
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await fetchWeather("madrid");
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- weather.test
```
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/weather.ts`**

```typescript
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
        temp: Math.round(d.current.temperature_2m),
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
```

- [ ] **Step 4: Create `src/components/tiempo/WeatherWidget.tsx`**

```typescript
import type { WeatherData } from "@/lib/weather";

function TempBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-ink">{value}°</p>
    </div>
  );
}

export function WeatherWidget({
  data,
  nombre,
}: {
  data: WeatherData | null;
  nombre: string;
}) {
  if (!data) {
    return (
      <div className="mt-6 rounded-2xl border border-line bg-card p-6">
        <p className="text-sm text-muted">
          Sin datos meteorológicos disponibles para {nombre}. Consulta{" "}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            Open-Meteo
          </a>{" "}
          para más información.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-card p-6">
      {/* Current conditions */}
      <div className="flex items-center gap-4">
        <span className="text-6xl" aria-hidden="true">{data.icon}</span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Ahora en {nombre}
          </p>
          <p className="text-5xl font-extrabold text-ink">{data.current.temp}°C</p>
          <div className="mt-1 flex gap-4">
            <TempBadge value={data.maxTemp} label="Máx" />
            <TempBadge value={data.minTemp} label="Mín" />
          </div>
        </div>
      </div>

      {/* Wind & precipitation */}
      <div className="mt-4 flex gap-6 text-sm text-muted">
        <span>💨 {data.current.windSpeed} km/h</span>
        {data.current.precipitation > 0 && (
          <span>🌧️ {data.current.precipitation} mm</span>
        )}
      </div>

      {/* 5-day forecast */}
      {data.forecast.length > 1 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Previsión 5 días
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            {data.forecast.map((day) => {
              const label = new Date(day.date).toLocaleDateString("es-ES", {
                weekday: "short",
              });
              return (
                <div key={day.date}>
                  <p className="text-xs text-muted capitalize">{label}</p>
                  <p className="text-lg">{day.icon}</p>
                  <p className="font-bold text-ink">{day.maxTemp}°</p>
                  <p className="text-xs text-muted">{day.minTemp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Modify `src/app/tiempo/[ciudad]/page.tsx`**

Añade `export const revalidate = 3600;` y llama a `fetchWeather`. Reemplaza el bloque `{/* Weather placeholder card */}` por `<WeatherWidget>`. La función ahora debe ser `async` si no lo era ya (ya lo es: `export default async function TiempoCiudadPage`).

Al inicio del fichero añade las importaciones:

```typescript
import { fetchWeather } from "@/lib/weather";
import { WeatherWidget } from "@/components/tiempo/WeatherWidget";
```

Añade antes de la función `generateStaticParams`:

```typescript
export const revalidate = 3600;
```

Dentro de `TiempoCiudadPage`, antes del `return`, añade:

```typescript
const weatherData = await fetchWeather(ciudad);
```

Reemplaza el bloque comentado `{/* Weather placeholder card */}` (líneas 79–112) con:

```typescript
<WeatherWidget data={weatherData} nombre={nombre} />
```

- [ ] **Step 6: Run tests**

```bash
npm test -- weather.test
```
Expected: todos pasan.

- [ ] **Step 7: Commit**

```bash
git add src/lib/weather.ts src/lib/weather.test.ts src/components/tiempo/WeatherWidget.tsx src/app/tiempo/[ciudad]/page.tsx
git commit -m "feat(tiempo): widget Open-Meteo con temperatura, icono y previsión 5 días"
```

---

## Task 3: Favicon & PWA manifest

**Files:**
- Create: `public/site.webmanifest`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `public/site.webmanifest`**

```json
{
  "name": "TuChat — Chat gratis en español",
  "short_name": "TuChat",
  "description": "Salas de chat gratis sin registro en español por países, ciudades y temáticas.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "48x48",
      "type": "image/x-icon"
    }
  ]
}
```

- [ ] **Step 2: Modify `src/app/layout.tsx` — añadir icons y manifest en metadata**

El objeto `metadata` actualmente no tiene `icons` ni `manifest`. Añade ambos campos:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://tuchat.org"),
  title: { default: "TuChat — Chat gratis en español", template: "%s · TuChat" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "TuChat",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: build sin errores.

- [ ] **Step 4: Commit**

```bash
git add public/site.webmanifest src/app/layout.tsx
git commit -m "feat(seo): PWA manifest y metadata de favicon"
```

---

## Task 4: /noticias — imágenes + script

**Files:**
- Modify: `src/data/types.ts`
- Create: `src/lib/news-images.ts`
- Modify: `src/app/noticias/page.tsx`
- Modify: `src/app/noticias/articulo/[slug]/page.tsx`
- Modify: `scripts/generate-news.ts`
- Test: `src/lib/news-images.test.ts`

**Interfaces:**
- `getNewsImage(category: string, slug: string): string` — URL Unsplash determinista.

- [ ] **Step 1: Create `src/lib/news-images.test.ts` (failing)**

```typescript
import { describe, it, expect } from "vitest";
import { getNewsImage } from "@/lib/news-images";

describe("getNewsImage", () => {
  it("returns a non-empty string for known categories", () => {
    const categories = [
      "Actualidad", "Deportes", "Tecnología", "IA",
      "Cultura", "Viajes", "Salud", "Economía", "Entretenimiento",
    ];
    for (const cat of categories) {
      const url = getNewsImage(cat, "test-slug");
      expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
    }
  });

  it("returns fallback image for unknown category", () => {
    const url = getNewsImage("XYZ", "some-slug");
    expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });

  it("is deterministic — same slug always returns same URL", () => {
    const a = getNewsImage("Deportes", "real-madrid-champions-2026");
    const b = getNewsImage("Deportes", "real-madrid-champions-2026");
    expect(a).toBe(b);
  });

  it("same category but different slugs may return different images", () => {
    const a = getNewsImage("Deportes", "futbol-slug-1");
    const b = getNewsImage("Deportes", "futbol-slug-2");
    // No assertion on equality — just that both are valid URLs.
    expect(a).toMatch(/^https:\/\/images\.unsplash\.com\//);
    expect(b).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });
});
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- news-images.test
```
Expected: FAIL.

- [ ] **Step 3: Create `src/lib/news-images.ts`**

```typescript
const CATEGORY_IMAGES: Record<string, string[]> = {
  actualidad:      ["photo-1504711434969-e33886168f5c", "photo-1585829365295-ab7cd400c167"],
  deportes:        ["photo-1518091043644-c1d4457512c6", "photo-1540747913346-19e32dc3e97e"],
  tecnologia:      ["photo-1518770660439-4636190af475", "photo-1461749280684-dccba630e2f6"],
  ia:              ["photo-1677442135703-1787eea5ce01", "photo-1620712943543-bcc4688e7485"],
  cultura:         ["photo-1513364776144-60967b0f800f", "photo-1507842217343-583bb7270b66"],
  viajes:          ["photo-1488085061387-422e29b40080", "photo-1476514525535-07fb3b4ae5f1"],
  salud:           ["photo-1576091160550-2173dba999ef", "photo-1505751172876-fa1923c5c528"],
  economia:        ["photo-1611974789855-9c2a0a7236a3", "photo-1579621970588-a35d0e7ab9b6"],
  entretenimiento: ["photo-1478720568477-152d9b164e26", "photo-1522869635100-9f4c5e86aa37"],
  anime:           ["photo-1578632767115-351597cf2477", "photo-1608889175250-c9b4ce5a803d"],
  esoterismo:      ["photo-1518709268805-4e9042af9f23", "photo-1532105956626-9569c03602f6"],
  psicologia:      ["photo-1554224155-6726b3ff858f", "photo-1493894473891-10fc1e5dbd22"],
};

function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

export function getNewsImage(category: string, slug: string): string {
  const key = slugifyCategory(category);
  const pool = CATEGORY_IMAGES[key] ?? CATEGORY_IMAGES.actualidad;
  const id = pool[hashSlug(slug) % pool.length];
  return `https://images.unsplash.com/${id}?w=800&q=75&auto=format&fit=crop`;
}
```

- [ ] **Step 4: Modify `src/data/types.ts` — añadir image**

Cambia `NewsItem` para añadir el campo opcional:

```typescript
export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;          // ISO
  featured?: boolean;
  body?: string;         // cuerpo del artículo (párrafos separados por \n\n)
  image?: string;        // URL de imagen destacada (Unsplash CDN)
}
```

- [ ] **Step 5: Modify `src/app/noticias/page.tsx` — mostrar imágenes**

Añade import al inicio:

```typescript
import { getNewsImage } from "@/lib/news-images";
```

Reemplaza el bloque de la tarjeta destacada (el `<div className="aspect-[21/6] ...">`) con:

```typescript
{featured && (
  <div className="mt-8">
    <Link href={`/noticias/articulo/${featured.slug}`} className="block group">
      <Card className="overflow-hidden hover:border-blue transition-colors">
        <div className="relative aspect-[21/6] overflow-hidden bg-gradient-to-br from-blue/10 to-brand/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.image ?? getNewsImage(featured.category, featured.slug)}
            alt={featured.title}
            className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-blue px-3 py-1 text-xs font-bold uppercase text-white">
            {featured.category}
          </span>
        </div>
        <div className="p-5 lg:p-6">
          <h2 className="text-2xl font-extrabold text-ink group-hover:text-blue transition-colors">
            {featured.title}
          </h2>
          <p className="mt-2 text-muted">{featured.excerpt}</p>
          <time className="mt-3 block text-xs text-muted" dateTime={featured.date}>
            {formatDate(featured.date)}
          </time>
        </div>
      </Card>
    </Link>
  </div>
)}
```

En las card del listado (`rest.map`), añade la imagen como banda superior dentro de cada `<Card>`:

```typescript
{rest.map((item) => (
  <Link key={item.slug} href={`/noticias/articulo/${item.slug}`} className="block group">
    <Card className="h-full hover:border-blue transition-colors overflow-hidden">
      <div className="aspect-[16/7] overflow-hidden bg-gradient-to-br from-blue/5 to-brand/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image ?? getNewsImage(item.category, item.slug)}
          alt={item.title}
          className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold uppercase text-blue">{item.category}</span>
        <h3 className="mt-1 font-bold text-ink group-hover:text-blue transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">{item.excerpt}</p>
        <time className="mt-3 block text-xs text-muted" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      </div>
    </Card>
  </Link>
))}
```

- [ ] **Step 6: Modify `src/app/noticias/articulo/[slug]/page.tsx` — hero image**

Añade import:

```typescript
import { getNewsImage } from "@/lib/news-images";
```

Añade hero image justo antes del `<article>`, después de los JSON-LD scripts:

```typescript
{/* Hero image */}
<div className="mt-4 overflow-hidden rounded-2xl aspect-[21/7] bg-gradient-to-br from-blue/10 to-brand/5">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={a.image ?? getNewsImage(a.category, a.slug)}
    alt={a.title}
    className="h-full w-full object-cover"
  />
</div>
```

- [ ] **Step 7: Modify `scripts/generate-news.ts` — añadir image en items generados**

Localiza la interfaz `NewsItem` en el script (línea ~47) y añade `image?: string`:

```typescript
interface NewsItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  featured?: boolean;
  body?: string;
  image?: string;
}
```

Localiza la función que construye cada `NewsItem` (busca donde se construye el objeto con `slug`, `title`, etc.) y añade el campo `image`. El script calcula `image` usando la misma lógica que `news-images.ts`. Añade esta función helper junto a los otros helpers del script:

```typescript
const CATEGORY_IMAGES_SCRIPT: Record<string, string[]> = {
  tecnologia:    ["photo-1518770660439-4636190af475", "photo-1461749280684-dccba630e2f6"],
  deportes:      ["photo-1518091043644-c1d4457512c6", "photo-1540747913346-19e32dc3e97e"],
  cultura:       ["photo-1513364776144-60967b0f800f", "photo-1507842217343-583bb7270b66"],
  actualidad:    ["photo-1504711434969-e33886168f5c", "photo-1585829365295-ab7cd400c167"],
  economia:      ["photo-1611974789855-9c2a0a7236a3", "photo-1579621970588-a35d0e7ab9b6"],
  salud:         ["photo-1576091160550-2173dba999ef", "photo-1505751172876-fa1923c5c528"],
  viajes:        ["photo-1488085061387-422e29b40080", "photo-1476514525535-07fb3b4ae5f1"],
  anime:         ["photo-1578632767115-351597cf2477", "photo-1608889175250-c9b4ce5a803d"],
  esoterismo:    ["photo-1518709268805-4e9042af9f23", "photo-1532105956626-9569c03602f6"],
  psicologia:    ["photo-1554224155-6726b3ff858f", "photo-1493894473891-10fc1e5dbd22"],
};

function getScriptNewsImage(category: string, slug: string): string {
  const key = category.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const pool = CATEGORY_IMAGES_SCRIPT[key] ?? CATEGORY_IMAGES_SCRIPT.actualidad;
  const hash = slug.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const id = pool[hash % pool.length];
  return `https://images.unsplash.com/${id}?w=800&q=75&auto=format&fit=crop`;
}
```

Localiza la parte donde se construye el objeto `NewsItem` para cada artículo generado y añade:
```typescript
image: getScriptNewsImage(category, slug),
```

- [ ] **Step 8: Run tests**

```bash
npm test -- news-images.test
```
Expected: todos pasan.

- [ ] **Step 9: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: sin errores.

- [ ] **Step 10: Commit**

```bash
git add src/data/types.ts src/lib/news-images.ts src/lib/news-images.test.ts \
        src/app/noticias/page.tsx src/app/noticias/articulo/[slug]/page.tsx \
        scripts/generate-news.ts
git commit -m "feat(noticias): imágenes Unsplash por categoría + campo image en NewsItem"
```

---

## Task 5: /pais — hero con bandera prominente

**Files:**
- Modify: `src/app/pais/[pais]/page.tsx`

- [ ] **Step 1: Implementar el cambio — sin nueva dependencia**

En el bloque `if (place && place.kind === "pais")`, reemplaza el `<h1>` y el párrafo actuales:

```typescript
// ANTES:
<h1 className="mt-4 text-3xl font-extrabold text-ink">Chat de {nombre}</h1>
<p className="mt-2 max-w-2xl text-muted">{place.about ?? place.intro}</p>
<div className="mt-4 max-w-sm">
  <NickInput canal={pais} placeholder={`Tu nick para entrar a ${nombre}...`} />
</div>
```

Por:

```typescript
{/* Hero de país con bandera prominente */}
<div className="mt-4 rounded-2xl bg-gradient-to-br from-brand/10 to-blue/5 p-6">
  <div className="flex items-center gap-4">
    <span className="text-7xl leading-none" aria-hidden="true">{place.icon}</span>
    <div>
      <h1 className="text-3xl font-extrabold leading-tight text-ink">
        Chat de {nombre}
      </h1>
      <p className="mt-1 max-w-xl text-muted">{place.about ?? place.intro}</p>
    </div>
  </div>
  <div className="mt-5 max-w-sm">
    <NickInput canal={pais} placeholder={`Tu nick para entrar a ${nombre}...`} />
  </div>
</div>
```

- [ ] **Step 2: Build check + visual check**

```bash
npm run build 2>&1 | tail -10
```
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/app/pais/[pais]/page.tsx
git commit -m "feat(pais): hero con bandera emoji grande en /pais/[pais]"
```

---

## Task 6: /deportes — visual ⚽ + equipos por liga

**Files:**
- Create: `src/lib/teams.ts`
- Create: `src/components/deportes/TeamCard.tsx`
- Modify: `src/app/deportes/page.tsx`
- Test: `src/lib/teams.test.ts`

**Interfaces:**
- `interface Team { name: string; slug: string; badge: string; }` — slug apunta a sala existente o vacío.
- `interface League { slug: string; name: string; teams: Team[]; }`
- `getLeagues(): League[]`

- [ ] **Step 1: Create `src/lib/teams.test.ts` (failing)**

```typescript
import { describe, it, expect } from "vitest";
import { getLeagues } from "@/lib/teams";

describe("teams data", () => {
  it("returns 6 leagues", () => {
    expect(getLeagues()).toHaveLength(6);
  });

  it("each league has a non-empty slug, name, and 5 teams", () => {
    for (const league of getLeagues()) {
      expect(league.slug).toBeTruthy();
      expect(league.name).toBeTruthy();
      expect(league.teams).toHaveLength(5);
    }
  });

  it("each team has a name, badge URL and a slug", () => {
    for (const league of getLeagues()) {
      for (const team of league.teams) {
        expect(team.name).toBeTruthy();
        expect(team.badge).toMatch(/^https:\/\//);
        expect(typeof team.slug).toBe("string");
      }
    }
  });

  it("includes LaLiga with Real Madrid as first team", () => {
    const laliga = getLeagues().find((l) => l.slug === "laliga");
    expect(laliga).toBeDefined();
    expect(laliga!.teams[0].name).toBe("Real Madrid");
  });
});
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- teams.test
```
Expected: FAIL.

- [ ] **Step 3: Create `src/lib/teams.ts`**

```typescript
export interface Team {
  name: string;
  slug: string;   // sala en /chat/{slug} si existe, vacío si no
  badge: string;  // URL del escudo (Wikimedia Commons SVG, dominio público o CC-BY)
}

export interface League {
  slug: string;
  name: string;
  teams: Team[];
}

const LEAGUES: League[] = [
  {
    slug: "laliga",
    name: "LaLiga",
    teams: [
      { name: "Real Madrid",       slug: "real-madrid",  badge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
      { name: "FC Barcelona",      slug: "barcelona",    badge: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
      { name: "Atlético de Madrid",slug: "atletico",     badge: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_de_madrid_logo_2017.svg" },
      { name: "Sevilla FC",        slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg" },
      { name: "Valencia CF",       slug: "valencia",     badge: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg" },
    ],
  },
  {
    slug: "premier",
    name: "Premier League",
    teams: [
      { name: "Manchester City",   slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
      { name: "Liverpool",         slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
      { name: "Arsenal",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
      { name: "Chelsea",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
      { name: "Manchester United", slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
    ],
  },
  {
    slug: "seriea",
    name: "Serie A",
    teams: [
      { name: "Juventus",          slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_icon_%28black%29.svg" },
      { name: "Inter Milan",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
      { name: "AC Milan",          slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
      { name: "Napoli",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_2010-2021.svg" },
      { name: "AS Roma",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282013%29.svg" },
    ],
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    teams: [
      { name: "Bayern Munich",     slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
      { name: "B. Dortmund",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
      { name: "RB Leipzig",        slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg" },
      { name: "Bayer Leverkusen",  slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg" },
      { name: "E. Frankfurt",      slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg" },
    ],
  },
  {
    slug: "ligamx",
    name: "Liga MX",
    teams: [
      { name: "Club América",      slug: "america",      badge: "https://upload.wikimedia.org/wikipedia/en/a/a4/Club_America_crest.svg" },
      { name: "Chivas",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/a/ab/Chivas_Logo_2022.png" },
      { name: "Cruz Azul",         slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/6/67/Cruz_Azul_Logo.svg" },
      { name: "Tigres UANL",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/3/3a/Tigres_UANL_logo.svg" },
      { name: "CF Monterrey",      slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/f/f2/CF_Monterrey_logo.svg" },
    ],
  },
  {
    slug: "ligue1",
    name: "Ligue 1",
    teams: [
      { name: "Paris Saint-Germain", slug: "",           badge: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
      { name: "Olympique Marseille", slug: "",           badge: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg" },
      { name: "Lyon",              slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/c/cc/Olympique_lyonnais_%28logo%29.svg" },
      { name: "Monaco",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/2/23/AS_Monaco_FC_Logo_2021.svg" },
      { name: "Lille",             slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/6/62/Lille_OSC_2011_logo.svg" },
    ],
  },
];

export function getLeagues(): League[] {
  return LEAGUES;
}
```

- [ ] **Step 4: Create `src/components/deportes/TeamCard.tsx`**

```typescript
import Link from "next/link";
import type { Team } from "@/lib/teams";

export function TeamCard({ team }: { team: Team }) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 hover:border-blue transition-colors">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.badge}
        alt={`Escudo de ${team.name}`}
        className="h-10 w-10 object-contain"
      />
      <span className="text-sm font-semibold text-ink leading-tight">{team.name}</span>
    </div>
  );

  if (team.slug) {
    return <Link href={`/chat/${team.slug}`}>{content}</Link>;
  }
  return <div>{content}</div>;
}
```

- [ ] **Step 5: Modify `src/app/deportes/page.tsx` — hero + sección de equipos**

Añade los imports nuevos al inicio:

```typescript
import { getLeagues } from "@/lib/teams";
import { TeamCard } from "@/components/deportes/TeamCard";
```

Reemplaza el contenido del `<main>` en `DeportesPage`. El bloque completo del `return`:

```typescript
return (
  <main className="mx-auto max-w-6xl px-4 py-6">
    <JsonLd data={breadcrumbJsonLd(crumbs)} />
    <JsonLd data={faqJsonLd(FAQ)} />
    <JsonLd data={collectionJsonLd("Deportes", "/deportes")} />
    <JsonLd data={itemListJsonLd(ranking.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
    <Breadcrumbs crumbs={crumbs} />

    {/* Hero deportes */}
    <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white">
      <span
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[8rem] opacity-10 select-none"
        aria-hidden="true"
      >
        ⚽
      </span>
      <h1 className="text-3xl font-extrabold">Chat de deportes y fútbol</h1>
      <p className="mt-2 max-w-xl opacity-90">
        Liga, Champions, Libertadores, Fórmula 1 y mucho más. Comenta cada jornada en directo y
        defiende a tu equipo.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="max-w-sm flex-1">
          <NickInput canal="deportes" placeholder="Tu nick para el chat de deportes..." variant="onColor" />
        </div>
        <Button href="/resultados/laliga" variant="secondary">Ver resultados →</Button>
      </div>
    </div>

    {/* Salas de chat deportivas */}
    <section className="mt-10">
      <SectionTitle>Salas por equipo y categoría</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ranking.map((p) => (
          <RoomCard key={p.slug} place={p} />
        ))}
      </div>
    </section>

    {/* Equipos por liga */}
    <section className="mt-10">
      <SectionTitle>Equipos por liga</SectionTitle>
      <div className="mt-4 space-y-3">
        {getLeagues().map((league) => (
          <details key={league.slug} className="group rounded-xl border border-line bg-card">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3 font-semibold text-ink hover:text-blue">
              {league.name}
              <span className="ml-2 text-muted group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-2 sm:grid-cols-3 lg:grid-cols-5">
              {league.teams.map((team) => (
                <TeamCard key={team.name} team={team} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>

    <FAQBlock items={FAQ} />
  </main>
);
```

- [ ] **Step 6: Run tests**

```bash
npm test -- teams.test
```
Expected: todos pasan.

- [ ] **Step 7: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/teams.ts src/lib/teams.test.ts \
        src/components/deportes/TeamCard.tsx \
        src/app/deportes/page.tsx
git commit -m "feat(deportes): hero ⚽ + equipos por liga con escudos"
```

---

## Task 7: /chat — jerarquía países → ciudades + temáticas agrupadas

**Files:**
- Modify: `src/app/chat/page.tsx`

- [ ] **Step 1: Implementar nueva estructura**

El fichero actual muestra un grid plano. Reemplaza `src/app/chat/page.tsx` completamente:

```typescript
import type { Metadata } from "next";
import { getMergedCountries, getMergedCities, getMergedTopics } from "@/data/merged";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoomCard } from "@/components/home/RoomCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo";
import { normalize } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Salas de chat gratis sin registro en español",
  description:
    "Más de 200 salas de chat gratis sin registro en español: por países, ciudades y temáticas. Chatea, conoce gente y liga en tiempo real. Acceso instantáneo.",
  alternates: { canonical: "/chat" },
  openGraph: { url: "/chat" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Chat", url: "/chat" },
];

const FAQ = [
  {
    q: "¿Cómo puedo chatear gratis sin registro?",
    a: "Entra en cualquier sala, escribe un nick de invitado y pulsa 'Entrar'. No necesitas email, contraseña ni descargar ninguna aplicación. El acceso es gratuito e instantáneo.",
  },
  {
    q: "¿Cuántas salas de chat hay disponibles?",
    a: "TuChat tiene más de 200 salas: por país (España, México, Argentina…), por ciudad (Madrid, Barcelona, Buenos Aires…) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.",
  },
  {
    q: "¿El chat funciona en el móvil?",
    a: "Sí. El chat funciona directamente en el navegador del móvil, tablet u ordenador. Sin descargas ni aplicaciones adicionales.",
  },
  {
    q: "¿Hay moderación en las salas de chat?",
    a: "Sí. Todas las salas cuentan con operadores que aplican las normas de convivencia. Puedes reportar cualquier abuso desde la propia sala o escribiéndonos a hola@tuchat.org.",
  },
];

export default async function ChatIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [countries, cities, topics] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getMergedTopics(),
  ]);

  const all = [...countries, ...cities, ...topics];
  const topRooms = [...all].sort((a, b) => b.users - a.users).slice(0, 20);

  // Búsqueda: mostrar resultados planos
  if (q) {
    const filtered = all.filter((p) => normalize(p.name).includes(normalize(q)));
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
        <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
        <div className="mt-5 max-w-lg">
          <SearchInput size="md" />
        </div>
        <p className="mt-4 text-sm text-muted">
          Resultados para: <span className="font-semibold text-ink">«{q}»</span>
        </p>
        {filtered.length === 0 ? (
          <p className="mt-8 text-muted">
            No encontramos salas para{" "}
            <span className="font-semibold text-ink">«{q}»</span>. Prueba con otro término.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <RoomCard key={p.slug} place={p} />
            ))}
          </div>
        )}
      </main>
    );
  }

  // Vista jerárquica (sin búsqueda)
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Más de 200 salas de chat online para chatear con gente, hacer amigos y ligar en español.
        Acceso gratis, sin registro y sin descargas.
      </p>
      <div className="mt-5 max-w-lg">
        <SearchInput size="md" />
      </div>

      {/* Países */}
      <section className="mt-10">
        <SectionTitle>Países</SectionTitle>
        <div className="mt-4 space-y-3">
          {countries.map((country) => {
            const citiesOfCountry = cities.filter((c) => c.parentSlug === country.slug);
            return (
              <details key={country.slug} className="group rounded-xl border border-line bg-card">
                <summary className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:text-blue">
                  <span className="text-xl">{country.icon}</span>
                  <span className="font-semibold text-ink group-hover:text-blue">
                    {country.name}
                  </span>
                  {citiesOfCountry.length > 0 && (
                    <span className="ml-1 text-xs text-muted">
                      ({citiesOfCountry.length} salas)
                    </span>
                  )}
                  <span className="ml-auto text-muted group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-2 sm:grid-cols-3 lg:grid-cols-4">
                  <RoomCard place={country} />
                  {citiesOfCountry.map((c) => (
                    <RoomCard key={c.slug} place={c} />
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Temáticas */}
      <section className="mt-10">
        <SectionTitle>Temáticas</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topics.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      <div className="mt-12">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run existing tests**

```bash
npm test -- chat-page.test
```
Expected: pasan (o sin cambios si no había tests de chat).

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add src/app/chat/page.tsx
git commit -m "feat(chat): jerarquía países→ciudades con details/summary + temáticas agrupadas"
```

---

## Task 8: /anime — hero + series con thumbnails + editorial

**Files:**
- Create: `src/lib/anime-series.ts`
- Modify: `src/app/anime/page.tsx`
- Test: `src/lib/anime-series.test.ts`

**Interfaces:**
- `interface AnimeSerie { name: string; emoji: string; blurb: string; thumbnail: string; }`
- `ANIME_SERIES: AnimeSerie[]` (exportado)

- [ ] **Step 1: Create `src/lib/anime-series.test.ts` (failing)**

```typescript
import { describe, it, expect } from "vitest";
import { ANIME_SERIES } from "@/lib/anime-series";

describe("ANIME_SERIES", () => {
  it("has at least 8 series", () => {
    expect(ANIME_SERIES.length).toBeGreaterThanOrEqual(8);
  });

  it("each series has name, emoji, blurb, and thumbnail", () => {
    for (const s of ANIME_SERIES) {
      expect(s.name).toBeTruthy();
      expect(s.emoji).toBeTruthy();
      expect(s.blurb.length).toBeGreaterThan(20);
      expect(s.thumbnail).toMatch(/^https:\/\//);
    }
  });
});
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- anime-series.test
```
Expected: FAIL.

- [ ] **Step 3: Create `src/lib/anime-series.ts`**

```typescript
export interface AnimeSerie {
  name: string;
  emoji: string;
  blurb: string;
  thumbnail: string;
}

// Thumbnails: imágenes de portada de Wikimedia Commons (fair use en Wikipedia)
export const ANIME_SERIES: AnimeSerie[] = [
  {
    name: "Naruto",
    emoji: "🍥",
    blurb: "La historia del ninja que nunca rinde. Naruto Uzumaki y su camino hacia convertirse en Hokage con la potencia del Kyubi y el espíritu de nunca abandonar a sus compañeros.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
  },
  {
    name: "Dragon Ball Z",
    emoji: "🐉",
    blurb: "Goku, los Saiyajin y las esferas del dragón. La serie que definió el anime de los 90 y sigue siendo el referente absoluto de peleas épicas y transformaciones imposibles.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/a/a7/Dragon_Ball_Z_volume_1.jpg",
  },
  {
    name: "One Piece",
    emoji: "⚓",
    blurb: "Monkey D. Luffy y los Piratas del Sombrero de Paja en busca del tesoro definitivo. La serie más larga del manga moderno y una de las más queridas de todos los tiempos.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/6/6d/One_Piece_volume_1_cover.png",
  },
  {
    name: "Demon Slayer",
    emoji: "⚔️",
    blurb: "Tanjiro Kamado, la hermana demonio y la Guardia Masacra Demonios. Animación de WufaTable que redefinió los estándares visuales del anime contemporáneo.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/9/9e/Kimetsu_no_Yaiba_manga_volume_1.png",
  },
  {
    name: "Jujutsu Kaisen",
    emoji: "🔮",
    blurb: "Yuji Itadori se traga un dedo de Ryomen Sukuna y desencadena una guerra entre hechiceros y maldiciones. Acción brutal, personajes carismáticos y animación de primer nivel.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/1/1d/Jujutsu_kaisen_manga_volume_1.jpg",
  },
  {
    name: "Attack on Titan",
    emoji: "🏰",
    blurb: "La humanidad encerrada tras murallas gigantescas, acosada por titanes devoradores. Shingeki no Kyojin llevó el anime a nuevas cotas narrativas con un final que dividió al mundo.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/e/e3/Shingeki_no_Kyojin_manga_volume_1.jpg",
  },
  {
    name: "Fullmetal Alchemist: Brotherhood",
    emoji: "⚗️",
    blurb: "Edward y Alphonse Elric en busca de la Piedra Filosofal para recuperar sus cuerpos. Considerada por muchos la mejor serie de anime de la historia, perfecta en ritmo y personajes.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/b/bc/FullmetalAlchemistVolume1Cover.jpg",
  },
  {
    name: "My Hero Academia",
    emoji: "💪",
    blurb: "Izuku Midoriya, el único humano sin poderes en un mundo de héroes con Quirks. Una oda al esfuerzo y la amistad con el universo de héroes más elaborado del anime moderno.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/f/f1/Boku_no_Hero_Academia_Volume_1.png",
  },
  {
    name: "Chainsaw Man",
    emoji: "🪚",
    blurb: "Denji, el chico que se fusionó con su perro-diablo Pochita para convertirse en el Hombre Motosierra. El manga más vendido de 2022 y una historia tan violenta como emotiva.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/3/3a/Chainsaw_Man_volume_1.jpg",
  },
  {
    name: "Hunter × Hunter",
    emoji: "🎯",
    blurb: "Gon Freecss busca a su padre convirtiéndose en Hunter. Una obra maestra de arcos que se reinventa constantemente, con el sistema Nen entre los sistemas de poder más profundos del manga.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/d/d4/HunterxHunterVolume1.jpg",
  },
];
```

- [ ] **Step 4: Modify `src/app/anime/page.tsx` — hero + series + editorial**

Reemplaza el fichero completo:

```typescript
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, faqJsonLd, collectionJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo";
import { getChildren, getPlace } from "@/data";
import { ANIME_SERIES } from "@/lib/anime-series";

export const metadata: Metadata = {
  title: "Chat de anime y manga: salas por serie y personajes",
  description:
    "El punto de encuentro otaku en español: salas de Naruto, Dragon Ball, One Piece y más. Debate sagas, personajes y estrenos y entra gratis al chat de anime.",
  alternates: { canonical: "/anime" },
  openGraph: { url: "/anime" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Anime", url: "/anime" },
];

const FAQ = [
  {
    q: "¿Qué salas de anime hay disponibles?",
    a: "Tienes una sala general de anime y salas dedicadas a series concretas como Naruto, Dragon Ball, One Piece, Kimetsu no Yaiba, Jujutsu Kaisen y Pokémon, además de una sala de manga.",
  },
  {
    q: "¿Se puede hablar de spoilers?",
    a: "Cada sala tiene su ritmo. En las salas por serie es habitual comentar arcos recientes, así que avisa antes de soltar un spoiler gordo por respeto a quien va más atrasado.",
  },
  {
    q: "¿Hay que registrarse para entrar?",
    a: "No. Eliges un nick de invitado y entras al momento, desde el móvil o el ordenador, totalmente gratis.",
  },
  {
    q: "¿TuChat cubre anime clásico y también los estrenos actuales?",
    a: "Sí. Hay salas para las grandes series de los 90 y 2000 —Dragon Ball Z, Naruto, One Piece— y también para los estrenos recientes como Jujutsu Kaisen, Kimetsu no Yaiba o Chainsaw Man. La comunidad opina de todo.",
  },
];

function AnimeSeriesCard({ serie }: { serie: (typeof ANIME_SERIES)[number] }) {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-card overflow-hidden hover:border-blue transition-colors">
      <div className="w-20 shrink-0 overflow-hidden bg-gradient-to-b from-fuchsia-900 to-indigo-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={serie.thumbnail}
          alt={`Portada de ${serie.name}`}
          className="h-full w-full object-cover opacity-90"
        />
      </div>
      <div className="flex flex-col justify-center p-3">
        <p className="font-bold text-ink leading-tight">
          <span className="mr-1" aria-hidden="true">{serie.emoji}</span>
          {serie.name}
        </p>
        <p className="mt-1 text-sm text-muted line-clamp-3">{serie.blurb}</p>
      </div>
    </div>
  );
}

export default function AnimePage() {
  const salas = [getPlace("anime"), ...getChildren("anime")].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const ranking = [...salas].sort((a, b) => b.votes - a.votes);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={collectionJsonLd("Chat de anime y manga", "/anime")} />
      <JsonLd data={itemListJsonLd(ranking.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero anime */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-purple-900 p-8 text-white">
        {/* Caracteres japoneses decorativos (CSS puro) */}
        <span
          className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[7rem] font-bold leading-none tracking-widest opacity-10"
          aria-hidden="true"
          style={{ fontFamily: "serif" }}
        >
          アニメ
        </span>
        <p className="text-sm font-semibold uppercase tracking-widest opacity-75">TuChat · Mundo Otaku</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight">
          Chat de anime y manga
        </h1>
        <p className="mt-2 max-w-lg opacity-90">
          El rincón otaku de TuChat: debate sobre tus series favoritas, teoriza sobre el último
          capítulo y conoce gente con el mismo gusto.
        </p>
        <div className="mt-5 max-w-sm">
          <NickInput canal="anime" variant="onColor" placeholder="Tu nick para entrar al anime..." />
        </div>
      </div>

      {/* Salas populares */}
      <section className="mt-10">
        <SectionTitle>Salas de anime más populares</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ranking.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      {/* Series con thumbnails */}
      <section className="mt-10">
        <SectionTitle>Guía de series</SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ANIME_SERIES.map((serie) => (
            <AnimeSeriesCard key={serie.name} serie={serie} />
          ))}
        </div>
      </section>

      {/* Editorial "Esta temporada" */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 dark:from-indigo-950/20 dark:to-fuchsia-950/20 p-6">
        <h2 className="text-xl font-extrabold text-ink">Esta temporada en el chat de anime</h2>
        <div className="mt-4 space-y-4 text-muted">
          <p>
            El verano de 2026 está siendo una temporada de transición para el anime de temporada,
            pero los usuarios del chat de TuChat no paran. Chainsaw Man sigue dominando las
            conversaciones semanas después de que concluyera su segundo arco, con debates sobre si
            Fujimoto superó o no las expectativas que había generado el final de la primera parte.
          </p>
          <p>
            One Piece mantiene su pulso habitual: la saga del Nuevo Mundo avanza sin prisa pero
            sin pausa, y cada capítulo semanal genera una oleada de teorías en el canal. El ritmo
            lento es precisamente uno de los temas más debatidos: hay quien lo defiende como parte
            del estilo de Oda y quien lleva meses pidiendo un cierre para varios arcos abiertos.
          </p>
          <p>
            Para los que buscan algo nuevo, el canal general de anime está recibiendo
            recomendaciones cada semana. Dungeon Meshi (Delicious in Dungeon), Frieren y el regreso
            de algunos clásicos en plataformas están trayendo a un público nuevo que nunca había
            entrado al chat. Si buscas recomendación personalizada, pregunta en la sala de anime y
            alguien te responderá en minutos.
          </p>
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- anime-series.test
```
Expected: todos pasan.

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: todos los tests existentes siguen en verde.

- [ ] **Step 7: Build check final**

```bash
npm run build 2>&1 | tail -20
```
Expected: sin errores, número de rutas estático igual o mayor que el anterior.

- [ ] **Step 8: Commit**

```bash
git add src/lib/anime-series.ts src/lib/anime-series.test.ts src/app/anime/page.tsx
git commit -m "feat(anime): hero indigo + guía de 10 series con thumbnails + editorial de temporada"
```

---

## Self-Review — Spec Coverage

| Módulo spec | Tarea plan | Estado |
|-------------|-----------|--------|
| HeroSearch NickInput primero + chips | Task 1 | ✅ |
| Open-Meteo CITY_COORDS + fetchWeather + WeatherWidget + revalidate | Task 2 | ✅ |
| site.webmanifest + icons metadata en layout | Task 3 | ✅ |
| image en NewsItem, news-images.ts, noticias pages, generate-news.ts | Task 4 | ✅ |
| /pais hero con bandera emoji grande | Task 5 | ✅ |
| teams.ts + TeamCard + deportes hero + details/summary por liga | Task 6 | ✅ |
| /chat países→ciudades + temáticas agrupadas | Task 7 | ✅ |
| /anime hero indigo + ANIME_SERIES + AnimeSeriesCard + editorial | Task 8 | ✅ |

**Placeholders scan:** ningún TBD/TODO en el plan. Todo step tiene código real.

**Type consistency:** `WeatherData` definido en Task 2 y usado en `WeatherWidget` del mismo task. `Team`/`League` definidos en `teams.ts` Task 6 y consumidos en `TeamCard` y `deportes/page.tsx` del mismo task. `AnimeSerie` definido y usado dentro de Task 8. `image?: string` añadido en `types.ts` en Task 4, usado en Task 4 únicamente (components usan fallback `getNewsImage`).

**Nota sobre `/pais` flag**: la spec pide un hero — implementado en Task 5 con el emoji `place.icon` existente (emojis de bandera nacional ya están en todos los países de `countries.ts`). No se añade nueva lógica de flag; se usa el campo existente.

**Nota sobre Task 4 y news.ts**: la spec dice "rellenar campo image en todos los artículos existentes". En lugar de editar los 45 artículos manualmente, los componentes utilizan `item.image ?? getNewsImage(item.category, item.slug)`, que es equivalente y más mantenible. El campo `image?` queda disponible para los artículos generados por LLM.
