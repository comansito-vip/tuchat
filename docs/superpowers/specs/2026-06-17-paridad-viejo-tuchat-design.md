# Paridad con el viejo tuchat.org — diseño (sub-proyecto 2)

Fecha: 2026-06-17

## Objetivo

Dar destino a los 128 canales del viejo tuchat.org: si ya existe sala equivalente
→ redirección 301; si no existe y tiene valor → crear sala nueva en su categoría.
Recupera tráfico/búsquedas de marca legacy (terra, latinchat, hispachat…) y
completa la paridad histórica de temáticas.

## Estado de partida

- De los 128 canales, **50 ya tienen destino** (slug o canal IRC existente).
- **78 sin destino**, clasificados abajo en CREAR / REDIRECT.

## Decisión del cliente y desviaciones

El cliente pidió "crear absolutamente todo, una sala por cada canal sin destino".
Este diseño lo cumple en espíritu (todo canal tendrá destino navegable) pero
**desvía a redirección** dos grupos donde crear sala haría daño — marcado abajo.
El cliente puede revocar estas desviaciones en la revisión del spec:

1. **Geografía duplicada:** `mexicanos`, `argentinos`, `paraguayos`, `usa`… ya
   tienen sala de país (`mexico`, `argentina`…). Crear una sala paralela parte la
   audiencia y compite en SEO consigo misma → **redirect** a la sala existente.
2. **Marcas de terceros en uso:** `badoo`, `jswipe` (apps de citas vivas) →
   **redirect** a `amor` en vez de suplantar la marca. Las marcas de chat
   *extintas* (terra, latinchat, hispachat, messenger) **sí** se crean como sala
   "heredera/nostalgia" (búsqueda real, sin suplantación).

## Mecanismo

### Redirecciones (alias → canónico)

- Nuevo archivo `src/data/legacy-aliases.ts`:
  `export const LEGACY_ALIASES: Record<string, string>` (slug viejo → slug canónico real).
- En `src/app/chat/[slug]/page.tsx`, antes de `notFound()`: si `slug` está en
  `LEGACY_ALIASES`, llamar a `permanentRedirect(\`/chat/${LEGACY_ALIASES[slug]}\`)`
  (301, import de `next/navigation`).
- `generateStaticParams` incluye también las claves de `LEGACY_ALIASES`, para que
  cada URL vieja se prerenderice con su redirect.
- **Antes de implementar:** leer `node_modules/next/dist/docs/` sobre redirects /
  `permanentRedirect` en esta versión de Next (AGENTS.md), por si la API difiere.
- Test: cada clave de `LEGACY_ALIASES` apunta a un slug que existe en `ALL`; ningún
  alias colisiona con un slug real (no se puede aliasar algo que ya es sala).

### Salas nuevas

- Temáticas nuevas → `src/data/topics-extra.ts` (o nuevo `topics-legacy.ts` si se
  prefiere agrupar). Geográficas nuevas → `src/data/cities.ts`.
- Cada sala respeta el modelo de calidad: `intro` ≤160, `about` ≥400 chars único
  anti-IA, `channels`, `related` válidos, `users/votes/activity` plausibles.

## Clasificación completa (78 canales)

### CREAR — salas nuevas (~22)

| canal viejo | acción | slug nuevo | name | categoría |
|---|---|---|---|---|
| age-of-empires | CREAR | `age-of-empires` | Age of Empires | tematica (videojuegos retro) |
| fama | CREAR | `fama` | Fama ¡a bailar! | tematica (TV/realities) |
| gran-hermano | CREAR | `gran-hermano` | Gran Hermano | tematica (realities) |
| mujer | CREAR | `mujeres` | Mujeres | tematica (social) |
| pasapalabra | CREAR | `pasapalabra` | Pasapalabra | tematica (concursos) |
| poker | CREAR | `poker` | Póker | tematica (juegos/azar) |
| radio | CREAR | `radio` | Radio | tematica (música/ocio) |
| spanish | CREAR | `idiomas` | Idiomas | tematica (aprender lenguas) |
| trivial | CREAR | `trivial` | Trivial | tematica (concursos) |
| tv | CREAR | `television` | Televisión | tematica (TV) |
| animalear | CREAR | `mascotas` | Mascotas | tematica (animales) |
| bariloche | CREAR | `bariloche` | Bariloche | ciudad (parent: argentina) |
| terra | CREAR | `terra` | Chat Terra | tematica (nostalgia chat legacy) |
| amas | CREAR | `amas-de-casa` | Amas de casa | tematica (social) |
| camioneros | CREAR | `camioneros` | Camioneros | tematica (oficios/nicho) |
| chaco-corrientes | CREAR | `chaco-corrientes` | Chaco y Corrientes | ciudad (parent: argentina) |
| chicas | CREAR | `chicas` | Chicas | tematica (social) |
| cristiano-evangelico | CREAR | `cristianos` | Cristianos | tematica (religión) |
| frikinternet | CREAR | `frikis` | Frikis | tematica (cultura geek) |
| hispachat | CREAR | `hispachat` | Hispachat | tematica (nostalgia chat legacy) |
| latinchat-amigos | CREAR | `latinchat` | Latinchat | tematica (nostalgia chat legacy) |
| messenger | CREAR | `messenger` | Chat Messenger | tematica (nostalgia MSN) |

### REDIRECT — alias a sala existente (~56)

**Geografía duplicada:** `argentinos`→argentina · `arriba-argentina`→argentina ·
`mexicanos`→mexico · `paraguayos`→paraguay · `desdeparaguay`→paraguay ·
`yagua`→paraguay · `usa`→estados-unidos · `encuentros-de-colombia`→colombia ·
`colchat`→colombia · `gdl`→guadalajara · `cantv-con-camara`→venezuela.

**Sinónimos de amistad/amor/ligar:** `cafe`→amistad · `chatear`→amistad ·
`colegas`→amistad · `solos`→amistad · `sin-registro`→amistad · `whisper`→amistad ·
`interactivo`→amistad · `laguna2000`→amistad · `mama-luna`→amistad ·
`camara`→amistad · `con-camara`→amistad · `foto`→amistad · `romance`→amor ·
`sapio`→amor · `badoo`→amor · `badoo-espana`→amor · `jswipe`→amor ·
`ligame`→ligar · `ligue`→ligar · `ligar-con-chicos`→ligar.

**Sinónimos de chicas/lgtbi/lesbianas** (existen salas `gay`, `gay-barcelona`,
`chueca`, `lgtbi`, `lesbianas`): `chica`→chicas · `de-chicas`→chicas ·
`gays`→gay · `gayamigos`→gay · `gaybarcelona`→gay-barcelona · `gaybogota`→gay ·
`gaychilenos`→gay · `gaygranada`→gay · `gaylatino`→gay ·
`gayfrikinternet`→gay · `de-gays`→gay · `homosexual`→gay ·
`comunidad-lgbt`→lgtbi · `les`→lesbianas · `lesbianas-terra`→lesbianas.

**Otros sinónimos temáticos** (existen `latinos`, `videojuegos`, `cine`, `series`,
`politica`, `erotico`): `aoc`→age-of-empires · `the-conquerors`→age-of-empires ·
`juegos`→videojuegos · `goya`→cine · `el-pacto`→series · `latin`→latinos ·
`revolucionario`→politica · `sendero-del-peje`→politica · `cybersexo`→erotico ·
`cristiano-gitano`→cristianos.

(Nota: `cristiano-gitano`→`cristianos` y `chica`→`chicas` apuntan a salas que se
crean en este mismo sub-proyecto; el orden de implementación crea las salas antes
de registrar sus alias para que el test de "alias apunta a slug existente" pase.)

## Plan de verificación

1. `npm test` verde (aditivo).
2. Test nuevo: cada alias resuelve a un slug existente; ningún alias pisa un slug real.
3. `npm run build` prerenderiza las salas nuevas y las URLs alias (con su 301).
4. Comprobación manual: `/chat/mexicanos` redirige a `/chat/mexico`;
   `/chat/terra` abre la sala nueva.
5. Sitemap: las salas nuevas entran; los alias **no** deben emitir URL canónica
   propia (evitar contenido duplicado) — verificar exclusión en `next-sitemap.config.js`.
6. Unicidad de `about` entre todas las salas (incluido el test global existente).

## Fuera de alcance

- Votaciones persistidas / backend admin (sub-proyecto 3).
- Reescritura de la estructura de URLs.
