# Salas por edad — diseño

Fecha: 2026-06-17

## Objetivo

Añadir 5 salas de chat segmentadas por franja de edad (+20, +30, +40, +50, +60),
un vertical de contenido que `canalchat.org` y `terrachat.es` tienen y tuchat no.
Cubre además paridad con el viejo tuchat.org, que tenía los canales IRC
`mas-de-20`, `mas-de-30`, `mas-de-40` y `mas-de-50`. Cada sala genera una landing
SEO long-tail propia (`/chat/mas-de-30`, etc.).

## Contexto del código

- Cada sala es un `Place` (`src/data/types.ts`, `kind: "tematica"`) en un array.
- `/chat/[slug]` renderiza cualquier `Place`; `generateStaticParams` prerenderiza
  todos automáticamente. No requiere cambios de código al añadir datos.
- `src/data/index.ts` compone `ALL_TOPICS = [...TOPICS, ...TOPICS_EXTRA]` y
  `ALL = [...COUNTRIES, ...ALL_CITIES, ...ALL_TOPICS]`. Slug **global único**.
- `getPrimaryTopics()` (solo `TOPICS`) alimenta el carrusel de categorías de la
  home; `TOPICS_EXTRA` queda fuera de ese carrusel pero sí en `/chat` y sitemap.
- `channels` se inyectan literalmente como nombres de canal IRC:
  `channelString(["mas_de_30","mas_de_40"]) === "#mas_de_30,#mas_de_40"`.
  El webchat filtra `chatzona` de la cabecera visible (`webchat/page.tsx`).
- `data.test.ts` valida slugs concretos existentes, así que la adición no rompe
  tests.

## Alcance

### Nuevo archivo `src/data/topics-edad.ts`

Exporta `TOPICS_EDAD: Place[]` con las 5 salas. Se integra en `index.ts`:
`const ALL_TOPICS: Place[] = [...TOPICS, ...TOPICS_EXTRA, ...TOPICS_EDAD];`

### Las 5 salas

| slug (URL) | name | icon | channels IRC |
|------------|------|------|--------------|
| `mas-de-20` | Mayores de 20 | 🌱 | `adolescentes`, `mas_de_30` |
| `mas-de-30` | Mayores de 30 | ☕ | `mas_de_30`, `mas_de_40` |
| `mas-de-40` | Mayores de 40 | 🍷 | `mas_de_40`, `mas_de_30` |
| `mas-de-50` | Mayores de 50 | 🌳 | `mas_de_40`, `mas_de_50` |
| `mas-de-60` | Mayores de 60 | 🌅 | `mas_de_50`, `mas_de_60` |

(El mapeo de `channels` lo fijó el cliente: el slug de URL usa guion y el canal
IRC guion bajo, como en el resto del sitio.)

### Reglas de contenido (anti-IA)

Cada sala sigue el modelo de calidad de las temáticas existentes (amor, amistad):
- `intro`: 1-2 frases con gancho específico de la franja, orientado a "chat gratis
  sin registro".
- `about`: párrafo (40-90 palabras) con detalle real y **tono distinto por
  franja** — veinteañeros (primeros trabajos, piso compartido, incertidumbre) vs.
  +40/+50 (segundas oportunidades, hijos mayores, reconexión) vs. +60 (jubilación,
  nietos, tiempo libre, compañía). Sin frases plantilla ni relleno; ninguna sala
  comparte párrafo con otra.
- `channels`: según la tabla anterior.
- `related`: 4-6 slugs reales — franjas de edad vecinas + `amistad` + `amor` +
  1-2 ciudades grandes (`madrid`, `buenos-aires`).
- `users`/`votes`/`activity`/`tag`: valores plausibles y **decrecientes con la
  edad** (+20/+30 las más activas, `Alta`; +60 la más tranquila, `Media`/`Baja`).

### Integración

- Añadir los 5 slugs nuevos al `related` de `amistad` y `amor` en `topics.ts`
  (enlazado bidireccional ligero, sin saturar).
- **No** se añaden al carrusel de la home (quedan fuera de `getPrimaryTopics`,
  igual que `TOPICS_EXTRA`).

## Solape con la temática `adultos`

La temática `adultos` (en `topics-extra.ts`) hoy reclama `mas-de-30`/`mas-de-40`
en sus `channels`. Se mantiene: `adultos` es el vertical adulto/erótico y estas
son salas sociales por edad; conviven como en el viejo tuchat. Para la futura
paridad/redirección (sub-proyecto 2), los slugs antiguos `mas-de-30`/`mas-de-40`
apuntarán a estas salas de edad, no a `adultos`.

## Plan de verificación

1. `npm test` verde (aditivo, no debe romper).
2. `npm run build` compila y prerenderiza `/chat/mas-de-20..60`.
3. Sitemap regenerado por `postbuild` (next-sitemap) incluye las 5 URLs nuevas.
4. Revisión manual de unicidad: ninguna sala comparte el párrafo `about`.
5. Validar que cada slug de `related` existe en `ALL` antes de commitear.

## Fuera de alcance

- Redirecciones 301 desde el viejo tuchat y paridad del resto de canales
  (sub-proyecto 2).
- Votaciones persistidas y backend del panel admin (sub-proyecto 3).
- Hub/landing agrupando las franjas (`/edades`): no aporta frente a las 5 landings
  individuales ya enlazadas entre sí.
