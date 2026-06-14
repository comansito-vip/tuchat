# Expansión de cobertura geográfica — mundo hispano

Fecha: 2026-06-14

## Objetivo

Avanzar el motor principal de SEO long-tail del brief: pasar de 16 a ~85 ciudades
con landings de contenido único, cubriendo España, toda Hispanoamérica y las
principales ciudades del mundo con comunidad hispana. Añadir los países
hispanohablantes que faltan para dar `parent` a las nuevas ciudades.

## Contexto del código

- Cada lugar (país, ciudad, temática) es un `Place` (`src/data/types.ts`) en su
  array correspondiente. Slug **global único** entre `COUNTRIES`, `CITIES`, `TOPICS`.
- `/chat/[slug]` renderiza cualquier `Place` y `generateStaticParams` prerenderiza
  todos automáticamente — no requiere cambios de código al añadir datos.
- `/pais/[pais]` ya lista las ciudades filtrando por `parentSlug` — automático.
- `/tiempo/[ciudad]` y `/loterias/[pais]` son páginas scaffold con fallback
  `cap(slug)` — aceptan cualquier slug nuevo sin romperse.
- `CONTINENTS` (en `countries.ts`) alimenta la navegación por país; hay que añadir
  los países nuevos ahí.
- `data.test.ts` solo valida slugs concretos existentes (madrid, barcelona, amor…),
  así que la expansión aditiva no rompe tests.

## Alcance

### Países nuevos (~11, `kind: "pais"`)
Venezuela, Ecuador, Bolivia, Paraguay, República Dominicana, Cuba, Puerto Rico,
El Salvador, Honduras, Nicaragua, Reino Unido (para Londres). Cada uno con
`intro`/`about` propios, `channels`, `related`, y entrada en `CONTINENTS`.

### Ciudades nuevas (~70)
- **España (~20):** capitales de provincia faltantes y grandes ciudades —
  Murcia, Valladolid, Córdoba, Granada, Gijón, Oviedo, Palma, Las Palmas,
  Pamplona, San Sebastián, Santander, Cádiz, Almería, Tenerife, Salamanca,
  León, Burgos, Tarragona, Girona, Toledo.
- **Hispanoamérica (~44):** top 3-5 ciudades por país (capital ya existente o
  nueva + grandes urbes). México, Argentina, Colombia, Perú, Chile, Uruguay,
  Venezuela, Ecuador, Bolivia, Paraguay, Rep. Dominicana, Cuba, Puerto Rico,
  Guatemala, Costa Rica, Panamá, El Salvador, Honduras, Nicaragua.
- **Mundo hispano (~6):** Miami, Nueva York, Los Ángeles, París, Berlín, Londres.

## Reglas de contenido (anti-IA)

Cada ciudad debe seguir el modelo de calidad de Madrid/Barcelona:
- `intro`: 1-2 frases con gancho local específico.
- `about`: párrafo (40-90 palabras) con detalle real — barrios, costumbres,
  referencias locales reconocibles. Estructura variada entre ciudades, sin
  frases plantilla ni relleno genérico.
- `channels`: `[slug-ciudad, slug-pais, "amistad", "chatzona"]`.
- `related`: 4-8 slugs reales (ciudades cercanas + país + temáticas afines).
- `users`/`votes`/`activity`/`tag`: valores plausibles escalados por tamaño.

## Colisiones de slug

Namespace global → disambiguar el secundario con sufijo país, siguiendo el patrón
existente `santiago-de-chile`. El `name` visible queda natural.
Ejemplos: `cordoba` (ES) → `cordoba-argentina`; `valencia` (ES) →
`valencia-venezuela`; `santiago` → `santiago-de-los-caballeros` (RD).

## Plan de verificación

1. `npm test` verde (aditivo, no debe romper).
2. `npm run build` compila y prerenderiza las nuevas rutas.
3. Sitemap regenerado por `postbuild` (next-sitemap) incluye las nuevas URLs.
4. Revisión manual de unicidad: ninguna ciudad comparte el párrafo `about`.

## Fuera de alcance

- Restructurar URLs a `/chat/pais/ciudad` (decisión separada; estructura plana
  actual ya está indexada).
- Votaciones interactivas, panel admin, noticias automáticas (otros frentes).
