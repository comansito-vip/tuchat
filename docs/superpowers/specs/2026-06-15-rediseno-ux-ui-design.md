# Rediseño UX/UI de TuChat — Contrato de diseño

Fecha: 2026-06-15
Dirección aprobada: **A + toques de B** (portal/directorio refinado con más imagen y heros de categoría).

## Diagnóstico

El código es moderno (Next 16, Tailwind v4, React 19), pero el resultado se ve "del 2000":

- Layout de embudo a **una sola columna**: secciones full-width apiladas, desperdicia el desktop.
- **Emojis como iconos** (incluidas banderas emoji): renderizan inconsistente y se ven amateur.
- **Paleta monocromo azul**: sin color por categoría, sin jerarquía cromática.
- **Salas sin tiers**: todas las cards pesan igual; falta el tier "Destacadas/HOT".
- **Cards planas** sin profundidad.

## Dirección estética: "Plaza en vivo"

Portal social hispano: cálido, vivo, con señales de actividad. Confiable como directorio pero
con energía moderna. Nada de azul corporativo frío y plano.

### Color (tokens en `globals.css` con `@theme`)

Anclaje estructural en índigo; acento de energía cálido (coral/rosa) para "en vivo / HOT / online".

```
--color-bg:        #FAF9F7   /* paper cálido, no slate frío */
--color-card:      #FFFFFF
--color-ink:       #16181D   /* casi negro cálido */
--color-muted:     #5B636E
--color-line:      #ECE9E4   /* borde cálido sutil */
--color-brand:     #4F46E5   /* índigo (estructura, links, botón primario) */
--color-brand-dark:#3730A3
--color-live:      #F43F5E   /* rosa-coral: punto en vivo, HOT, online count */
--color-live-soft: #FFF1F3
--color-active:    #16A34A   /* verde "online/alta actividad" */
```

Acentos por categoría (para color-coding de temáticas y secciones destacadas), como utilidades/
clases de datos: amor=rose, amistad=sky, deportes=emerald, música=violet, juegos=amber,
anime=fuchsia, tarot=indigo. Cada hub/temática puede llevar su acento en el icono/tile.

### Tipografía (next/font/google en `layout.tsx`)

- **Display** (h1/h2, hero, marca): `Bricolage Grotesque` → var `--font-display`.
- **Body**: `Plus Jakarta Sans` → var `--font-sans`.
- Prohibido Inter/Roboto/Arial/system como protagonista.

### Profundidad y textura

- Cards: `rounded-2xl`, borde `--color-line`, sombra cálida sutil (`shadow-[0_1px_3px_rgba(20,18,15,.06)]`),
  hover eleva (`hover:-translate-y-0.5` + sombra mayor + borde brand).
- Hero: gradiente mesh suave + adornos blur; CTA fuerte; contador "online ahora".
- Animación de carga escalonada en el hero (stagger con animation-delay), sutil.

## Sistema de componentes (contrato para agentes)

Primitivas que YA construye la base (no las redefinan; impórtenlas):

- `@/components/ui/Flag` → `<Flag emoji="🇪🇸" name="España" size={20} />`. Convierte el emoji bandera
  a código ISO y renderiza SVG real (flagcdn). Fallback al emoji si no hay código.
- `@/components/ui/icons` → set ampliado: `ChatIcon, ArrowRightIcon, UsersIcon, LiveDot` (ya existen) +
  nuevos: `SearchIcon, FireIcon, SparkIcon, WeatherIcon, StarIcon, TrophyIcon, MenuIcon, CloseIcon,
  GlobeIcon, ChevronIcon`. Todos SVG, `currentColor`.
- `@/components/ui/Card` → soporta `variant?: "base" | "interactive"` y `accent?` (color-coding).
- `@/components/ui/Badge` → soporta `RoomTag` + nuevos: `HOT` (rojo live), `NUEVO`, `EN VIVO`.
- `@/components/ui/SectionTitle` → con `eyebrow?`, icono opcional, descripción opcional, CTA.

### Reglas para todos los componentes

1. **Banderas**: cualquier país/ciudad usa `<Flag>`, nunca el emoji directo en el markup visible.
   (El emoji sigue en la data; `Flag` lo convierte.)
2. **Tiles de icono**: emojis temáticos pueden quedar pero dentro de un tile con acento de color
   (`rounded-xl` con fondo del acento al 10–12%), no sueltos.
3. **Online/actividad**: usar `LiveDot` + color `--color-live` o `--color-active`; números con
   `toLocaleString("es")`.
4. **Móvil primero**: una columna, CTA visible, touch targets ≥44px. La sidebar se apila debajo
   o se omite en móvil.
5. Mantener accesibilidad: `aria-hidden` en decorativos, contraste AA, foco visible.

## Layout objetivo

### Home (`app/page.tsx`)

1. **Hero** full-width (gradiente cálido): h1, subtítulo, buscador, CTAs, contador "online ahora",
   stats. (En desktop, columna derecha con top 3 salas — se mantiene.)
2. **Cuerpo a 2 columnas** dentro de `max-w-6xl` (desktop `lg:grid-cols-[1fr_320px]`):
   - **Main**: Salas destacadas (tier HOT) → Explora por país (con banderas) → Ciudades →
     Temáticas (color-coded) → Secciones destacadas (hubs) → Noticias.
   - **Sidebar sticky** (`lg:sticky lg:top-20`): widget "online ahora", clima, horóscopo del día,
     top salas/ranking compacto, herramientas (links a loterías/tarot/etc.).
   - En móvil: una columna; la sidebar se vuelve secciones apiladas al final o intercaladas.

### Chrome

- **Header**: marca + nav desktop + CTA. Limpio (una fila), sticky con blur. Iconos SVG.
- **Footer**: 4 columnas (Chat, Contenidos, Herramientas, Legal) + marca.
- **Móvil**: `MobileMenu` (drawer) + `MobileBottomNav` ya existen; refinarlos al nuevo estilo.

### Salas

- `RoomCard`: tile con bandera/icono, nombre, línea de actividad (LiveDot + online), badge tier,
  botón Entrar. Variante "destacada" para el tier HOT.
- `RoomHero` (página de sala): mantiene gradiente pero usa `<Flag>` para países/ciudades y el
  nuevo sistema de color; cohesionado con la home.

## Reparto de trabajo

- **Base (Claude principal)**: tokens, fuentes, `Flag`, `icons`, `Card`, `Badge`, `SectionTitle`,
  `next.config`.
- **A1 Hero**: `home/HeroSearch.tsx` (+ contador online client component si hace falta).
- **A2 Salas/grids**: `home/RoomCard.tsx`, `room/RoomHero.tsx`, `home/CountryGrid.tsx`,
  `home/CityList.tsx`, `home/CategoryCard.tsx`.
- **A3 Chrome**: `layout/Header.tsx`, `layout/Footer.tsx`, `layout/MobileMenu.tsx`,
  `layout/MobileBottomNav.tsx`.
- **A4 Sidebar+secundarios**: nuevo `home/Sidebar.tsx` (widgets clima/horóscopo/online/top/
  herramientas), `home/TrendingBlock.tsx`, `home/NewsGrid.tsx`, `home/RankingTable.tsx`.
- **Ensamblado (Claude principal)**: `app/page.tsx` a 2 columnas + verificación.

## Verificación

`npm run lint` y `npm run build` deben pasar; `npm test` verde; revisar en `npm run dev`
(desktop y móvil). Sin warnings nuevos de hidratación.
