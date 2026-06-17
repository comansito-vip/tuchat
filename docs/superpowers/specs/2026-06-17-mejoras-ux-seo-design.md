# Mejoras UX/SEO TuChat — diseño

Fecha: 2026-06-17

## Objetivo

8 módulos de mejora visual, datos en tiempo real, jerarquía de contenido y
automatización de noticias para aumentar la calidad percibida, el SEO y la
retención de usuarios.

---

## Módulo 1 · Home: NickInput primero + quick-links

`HeroSearch.tsx`: reordenar para que `NickInput` aparezca antes que
`SearchInput`. Añadir fila de chips de acceso rápido entre ambos con las salas
más populares (`España`, `México`, `Argentina`, `Madrid`, `Barcelona`, `Gay`,
`Anime`) como `<Link href="/chat/{slug}">` — no a `/webchat`.

---

## Módulo 2 · /tiempo: widget Open-Meteo real

**API:** Open-Meteo (`api.open-meteo.com/v1/forecast`) — gratuita, sin clave,
datos cada hora.

- `src/lib/weather.ts`: `CITY_COORDS` (Record<slug, {lat,lon,tz}> con ~60
  ciudades) + `fetchWeather(slug): Promise<WeatherData|null>` que llama a la
  API con `next: { revalidate: 3600 }`. Devuelve temperatura actual, máx/mín,
  precipitación, viento, icono WMO y array de 4 días de previsión.
- `src/components/tiempo/WeatherWidget.tsx`: Server Component que recibe
  `WeatherData|null` y muestra tarjeta con datos reales (o "Sin datos" si null).
- `src/app/tiempo/[ciudad]/page.tsx`: añadir `export const revalidate = 3600`,
  llamar `fetchWeather(ciudad)` y pasar a `<WeatherWidget>`.

---

## Módulo 3 · Favicon & assets SEO

- `public/site.webmanifest`: manifest PWA con name, short_name, icons 192/512.
- `src/app/layout.tsx`: añadir `icons` en metadata (`icon`, `apple`) y `manifest`.
- Verificar `opengraph-image.tsx` (ya existe).

---

## Módulo 4 · /noticias: imágenes + cron diario GitHub Actions

**Imágenes:**
- `src/data/types.ts`: añadir `image?: string` a `NewsItem`.
- `src/lib/news-images.ts`: `getNewsImage(category, slug)` — devuelve URL
  Unsplash CDN por categoría (photo IDs hardcoded, determinísticos por slug).
- `src/data/news.ts`: rellenar campo `image` en todos los artículos existentes.
- `src/app/noticias/page.tsx`: mostrar `<img>` en tarjeta destacada y en cards.
- `src/app/noticias/articulo/[slug]/page.tsx`: hero image en artículo.

**Cron:**
- `scripts/generate-news.ts`: añadir campo `image` en items generados.
- `.github/workflows/generate-news.yml`: cron `0 7 * * *`, usa secrets
  `ANTHROPIC_API_KEY` + `OPENAI_API_KEY`, ejecuta script, hace commit + push.

---

## Módulo 5 · /pais: banderas prominentes

`src/app/pais/[pais]/page.tsx`: sustituir `<h1>` por hero con flag emoji grande
(del campo `place.icon`) + nombre + intro. Todas las ciudades ya muestran la
bandera del país padre via `RoomCard` (usa `place.icon`). Las ciudades del
directorio de país también muestran su `place.icon`.

---

## Módulo 6 · /deportes: visual ⚽ + equipos por liga

- `src/lib/teams.ts`: datos estáticos de top-5 equipos × 6 ligas (LaLiga,
  Premier, Serie A, Bundesliga, Liga MX, Ligue 1) con `strBadge` de TheSportsDB
  CDN (URLs del API gratuito, key=3). Función `getLeagues()`.
- `src/components/deportes/TeamCard.tsx`: escudo `<img>` + nombre + link a
  `/chat/{slug}` si la sala existe, si no a `#`.
- `src/app/deportes/page.tsx`: hero con gradiente verde + `⚽` de fondo,
  sección "Equipos por liga" con `<details>/<summary>` por liga.

---

## Módulo 7 · /chat: jerarquía países → ciudades + temáticas agrupadas

`src/app/chat/page.tsx`: eliminar la grid plana y reemplazar por:
1. Buscador (ya existe).
2. Sección **Países**: `<details>/<summary>` por país — al expandir muestra
   cards de ciudades de ese país (`parentSlug === country.slug`).
3. Sección **Temáticas**: grid 2×N de RoomCards de `kind === "tematica"`.
Sin cambio de URL.

---

## Módulo 8 · /anime: hero + series con thumbnails + editorial

`src/app/anime/page.tsx`:
- Hero: gradiente indigo + caracteres japoneses decorativos (CSS puro, sin img
  externa) + NickInput.
- `src/lib/anime-series.ts`: array de series con nombre, emoji, blurb y
  thumbnail de Wikimedia Commons (URL directa, dominio público o CC BY-SA).
- `AnimeSeriesCard` (inline en page): thumbnail + serie + blurb.
- Sección editorial "Esta temporada": 2-3 párrafos SEO de la temporada actual.

---

## Fuera de alcance

- Internacionalización / i18n.
- Autenticación de usuarios.
- Base de datos real de partidos en directo (solo clasificaciones).
- App nativa / PWA con notificaciones.
