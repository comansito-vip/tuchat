# Backend del panel admin — diseño

Fecha: 2026-06-17

## Objetivo

Convertir `/admin` (hoy solo lectura) en un panel operativo: gestionar
redirecciones, ocultar/`noindex` salas, editar y crear salas, y disparar la
regeneración de noticias. Sin tocar la fuente TS ni perder el render estático:
los cambios viven en un store persistente y se fusionan en la capa de datos.

## Contexto del código

- Las salas son `Place[]` estáticos en `src/data/*.ts`, agregados en
  `src/data/index.ts` (`ALL`, getters **síncronos**: `getPlace`, `getCities`,
  `getCountries`, `getTopics`, `getRanking`, `getChildren`, `getStats`…).
- `/chat/[slug]/page.tsx` resuelve por `getPlace`; `generateStaticParams` lista
  `getCountries()+getCities()+getTopics()`. Todo el sitio se prerenderiza.
- Ya existe `src/lib/votes-store.ts`: store conectable (Upstash Redis REST si hay
  `UPSTASH_REDIS_REST_URL/TOKEN`, si no JSON en `.data/`). Patrón a replicar.
- `/admin` protegido por `src/middleware.ts` con auth básica (`ADMIN_USER`/
  `ADMIN_PASS`); si no hay `ADMIN_PASS`, queda abierto (dev).
- Tests usan vitest con mock del store (ver tests de votes-store/ranking).
- AGENTS.md: leer `node_modules/next/dist/docs/` antes de usar `permanentRedirect`,
  `revalidatePath`, route handlers o ISR — esta versión de Next puede diferir.

## Arquitectura

### `src/lib/admin-store.ts`

Gemelo de `votes-store.ts`. Persiste un único documento `AdminState`:

```ts
export interface AdminState {
  redirects: Record<string, string>;        // oldSlug -> slug canónico (A)
  hidden: string[];                          // slugs ocultos de listados (B)
  noindex: string[];                         // slugs marcados noindex (B)
  overrides: Record<string, Partial<Place>>; // ediciones de salas existentes (C)
  newRooms: Place[];                          // salas creadas desde el panel (C)
}
```

API async: `getAdminState()`, `setRedirect(from,to)`, `removeRedirect(from)`,
`toggleHidden(slug)`, `toggleNoindex(slug)`, `saveOverride(slug, patch)`,
`createRoom(place)`, `deleteRoom(slug)`. Cada mutación persiste el documento
completo (Upstash `SET` JSON / fichero `.data/admin.json`). Backend JSON = lectura
con `readFile`, escritura atómica con `writeFile` a un temporal + `rename`.

### Capa de datos fusionada

Nuevo módulo `src/data/merged.ts`:

```ts
export async function getMergedAll(): Promise<Place[]>;     // base − hidden + overrides + newRooms
export async function getMergedPlace(slug: string): Promise<Place | undefined>;
export async function getMergedCountries(): Promise<Place[]>;
export async function getMergedCities(): Promise<Place[]>;
export async function getMergedTopics(): Promise<Place[]>;
export async function getMergedChildren(slug: string): Promise<Place[]>;
export async function getRedirectTarget(slug: string): Promise<string | undefined>;
export async function isNoindex(slug: string): Promise<boolean>;
```

Reglas de fusión: parte de los arrays estáticos; elimina los `hidden` de los
listados (no del catálogo de redirect); aplica `overrides[slug]` con
`{...base, ...patch}`; concatena `newRooms`. Slug sigue siendo único: `createRoom`
rechaza slugs ya existentes; `saveOverride` solo parchea existentes.

Los getters síncronos actuales se mantienen para datos base (build inicial); las
páginas públicas pasan a usar los `getMerged*` async.

### Escritura y auth

Route handler `src/app/api/admin/route.ts` (`POST`): cuerpo
`{ action, payload }` con `action` ∈ {`setRedirect`,`removeRedirect`,
`toggleHidden`,`toggleNoindex`,`saveRoom`,`createRoom`,`deleteRoom`,`regenNews`}.
Valida el payload (guardas explícitas) y llama al store. Tras mutar, dispara
`revalidatePath` de las rutas afectadas (`/chat/[slug]`, `/chat`, `/`, `/ranking`,
sitemap). Auth: se extiende `config.matcher` del middleware a `/api/admin/:path*`,
reusando `ADMIN_PASS` (mismo modelo que `/admin`). Sin `ADMIN_PASS` → abierto
(dev), idéntico a hoy.

### Render

Páginas públicas afectadas (`/chat/[slug]`, listados, sitemap) leen `getMerged*`
y declaran ISR (`export const revalidate = 3600`). El admin revalida on-demand
tras cada cambio, de modo que el estático se refresca al instante sin quedar
servido datos viejos. `generateStaticParams` usa `getMergedCountries/Cities/Topics`.

## Subsistemas

- **A · Redirecciones.** `/chat/[slug]`: si `getRedirectTarget(slug)` existe,
  `permanentRedirect('/chat/'+target)`. UI: tabla en `/admin` para añadir/quitar.
- **B · Visibilidad/indexación.** `hidden` excluye de listados y sitemap;
  `isNoindex(slug)` mete `robots:{index:false}` en `generateMetadata`. UI: toggles.
- **C · Editar/crear salas.** Formularios en `/admin` que postean a `/api/admin`:
  `saveRoom` (override de campos: intro, about, channels, related, stats, icon,
  tag, activity), `createRoom` (Place nuevo, valida slug único + `related` reales),
  `deleteRoom` (solo `newRooms`; las base solo se ocultan). `getMerged*` lo refleja.
- **D · Regenerar noticias.** `regenNews` lanza el pipeline `generate:news`
  server-side vía `child_process` (solo entorno con disco/Node persistente, p. ej.
  VPS con `next start`; **no** serverless). Devuelve estado/última ejecución. Botón
  en el panel con feedback. Si el entorno no lo soporta, responde 501 claro.

## Plan de verificación (TDD)

1. `admin-store.test.ts`: round-trip JSON de cada acción (redirect, hidden,
   noindex, override, createRoom dup-slug rechazado, deleteRoom).
2. `merged.test.ts`: hidden excluido de listados, override aplicado, newRoom
   añadido, redirect target, noindex flag. Mock del store.
3. `api/admin` route: 401 sin auth correcta, 200 con auth; cada acción muta el
   store; payload inválido → 400.
4. `/chat/[slug]`: slug con redirect → 308/permanentRedirect; slug noindex →
   metadata `index:false`.
5. Suite completa verde; `npm run build` compila con getters async.

## Fases (con checkpoint entre cada una)

1. **Fase 1** — `admin-store.ts` + extensión de auth a `/api/admin` + ruta POST
   con la acción `setRedirect/removeRedirect` + **A redirecciones** en `/chat` +
   UI mínima de redirecciones. Entregable testeable y aislado.
2. **Fase 2** — **B visibilidad/noindex**: merge `hidden` en listados/sitemap,
   `isNoindex` en metadata, toggles en el panel.
3. **Fase 3** — **C editar/crear salas**: refactor a `getMerged*` async + ISR +
   revalidación, formularios de edición/creación. El grueso del trabajo.
4. **Fase 4** — **D regenerar noticias**: endpoint `regenNews` + botón + feedback.

## Fuera de alcance

- Multiusuario / roles / auditoría de cambios (un solo admin por `ADMIN_PASS`).
- Editor WYSIWYG; los campos se editan como formulario simple.
- Migrar overrides de vuelta a la fuente TS (el store es la verdad en runtime).
