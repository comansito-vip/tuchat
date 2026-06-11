# TuChat.org — Diseño del portal (v1)

**Fecha:** 2026-06-11
**Estado:** Aprobado para planificación

## 1. Objetivo

Portal SEO de chat global en español. Web moderna, limpia, rápida y usable en desktop y mobile. Debe parecer un portal editorial real (no generado por IA): salas de chat, directorio de países/ciudades/temáticas, medio de contenidos, acceso rápido al webchat y rankings.

Esta primera versión es **visual y funcional**, con datos mock listos para sustituir por datos reales, y una arquitectura preparada para escalar a cientos de páginas SEO.

## 2. Stack y decisiones técnicas

- **Next.js 15 (App Router) + TypeScript** — SSR/SSG para SEO, rutas dinámicas, metadata por página.
- **Tailwind CSS** con design tokens (colores y tipografía como variables CSS). CSS mínimo, consistencia, buenos Core Web Vitals.
- **Fuente Inter** vía `next/font` (local, sin llamadas externas → mejor LCP).
- **Datos mock** en `src/data/*` con funciones getter (`getCity(slug)`, `getRooms()`, etc.). Sustituibles por API/BD sin tocar componentes.
- **SEO/LLM-friendly**: `generateMetadata` por ruta, JSON-LD Schema.org, `next-sitemap`, `robots.txt`, `llms.txt`, HTML semántico, `next/image` con lazy loading.

### Decisión visual aprobada
Dirección **A** ("Booking / Idealista"): hero dividido — texto + buscador a la izquierda, panel de salas activas a la derecha. Comercial, orientado a la acción, vivo.

## 3. Identidad visual

### Paleta
| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#F8FAFC` | Fondo principal |
| `--card` | `#FFFFFF` | Tarjetas |
| `--blue` | `#2563EB` | Azul principal / CTAs |
| `--blue-dark` | `#1E3A8A` | Azul oscuro / títulos de marca |
| `--text` | `#475569` | Texto gris de lectura |
| `--border` | `#E2E8F0` | Bordes suaves |
| `--green` | `#22C55E` | Indicador de actividad |
| rojo/amarillo | puntual | Solo rankings/tendencias |

### Tipografía
- Inter / system-ui. Títulos claros y grandes pero no exagerados. Texto de lectura cómodo. Mucho espacio blanco.

### Reglas anti-IA
- Textos naturales, concretos, humanos. Evitar frases vacías ("descubre una nueva experiencia").
- No repetir estructuras idénticas en todas las páginas.
- Detalles locales en ciudades importantes.
- Microcopy real: "Entra ahora", "Ver salas cercanas", "Usuarios hablando ahora".
- Diseño sobrio, sin estética futurista de IA ni degradados exagerados.

## 4. Estructura de carpetas

```
src/
  app/
    layout.tsx                  → layout raíz (Header, MobileBottomNav, Footer, fuentes, JSON-LD WebSite)
    page.tsx                    → Home
    chat/page.tsx               → índice de salas
    chat/[slug]/page.tsx        → plantilla única ciudad/país/temática (sala modelo: madrid)
    pais/[pais]/page.tsx        → andamiado
    ciudad/[ciudad]/page.tsx    → andamiado
    noticias/page.tsx           → andamiado
    noticias/[categoria]/page.tsx → andamiado
    tiempo/[ciudad]/page.tsx    → andamiado
    horoscopo/[signo]/page.tsx  → andamiado
    loterias/[pais]/page.tsx    → andamiado
    ranking/page.tsx            → andamiado
    webchat/page.tsx            → webchat funcional
  components/
    layout/    Header, MobileBottomNav, Footer, Breadcrumbs
    home/      HeroSearch, RoomCard, CountryGrid, CityList, CategoryCard,
               TrendingBlock, NewsGrid, RankingTable
    room/      RoomInfoPanel, RelatedRooms, SEOTextBlock, FAQBlock
    webchat/   WebchatFrame
    ui/        Button, Badge, Card, SectionTitle, SearchInput
  data/        countries.ts, cities.ts, topics.ts, rooms.ts, news.ts (+ getters)
  lib/         seo.ts, channels.ts, nick.ts
```

## 5. Componentes (lista completa)

Header, MobileBottomNav, HeroSearch, RoomCard, CountryGrid, CityList, CategoryCard, TrendingBlock, NewsGrid, RankingTable, WebchatFrame, Footer, Breadcrumbs, SEOTextBlock, RelatedRooms, FAQBlock. Más primitivas `ui/` (Button, Badge, Card, SectionTitle, SearchInput) para coherencia y no repetir estilos.

## 6. Páginas

### 6.1 Home (`/`) — funcional, completa
Bloques en orden:
1. **Header fijo ligero** — Logo TuChat; menú: Chat, Países, Ciudades, Temáticas, Noticias, Tiempo, Loterías, Horóscopo, Ranking; botón destacado "Entrar al chat".
2. **Hero (dirección A)** — Título "Chat gratis en español"; subtítulo del brief; buscador grande "Buscar ciudad, país o temática"; botón principal "Entrar al chat"; secundario "Ver salas populares"; mini-estadísticas (Salas por países, Ciudades disponibles, Usuarios conectados, Ranking diario); panel derecho con tarjetas de salas activas.
3. **Salas más activas** — RoomCards: bandera/icono, nombre, usuarios aprox., votos, botón "Entrar", etiqueta Popular/Nueva/Tendencia.
4. **Explora por país** — grid por continentes (España, Latinoamérica, Centroamérica, Norteamérica, Europa, África, Mundo) con enlaces internos SEO.
5. **Ciudades populares** — listado en columnas (Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, A Coruña, Vigo, Zaragoza, Alicante, Buenos Aires, CDMX, Bogotá, Lima, Santiago, Montevideo). Enlazan a `/chat/{ciudad}`.
6. **Temáticas** — CategoryCards (Amor, Amistad, LGTBI, Deportes, Música, Cine, Videojuegos, Filosofía, Tecnología, Bolsa, Viajes, Cocina, Salud, Tarot, Horóscopo).
7. **Tendencias del día** — formato editorial (Mundial 2026, resultados, loterías, horóscopo, tiempo, tecnología, actualidad).
8. **Noticias y contenidos** — tipo periódico: 1 noticia principal grande + 4 pequeñas. Categorías: Actualidad, Deportes, Tecnología, IA, Cultura, Viajes, Salud, Economía, Entretenimiento.
9. **Ranking de salas** — tabla: posición, sala, país/tema, actividad, botón entrar.
10. **Footer** — columnas: TuChat, Salas por país, Salas por ciudad, Temáticas, Noticias, Legal, Contacto.

### 6.2 Página de sala (`/chat/madrid`) — funcional, sala modelo
Plantilla única `chat/[slug]` que detecta tipo (ciudad/país/temática) y adapta contenido.
1. **Breadcrumb**: Inicio > España > Madrid.
2. **Hero**: "Chat Madrid gratis" + texto introductorio + botón "Entrar al chat de Madrid".
3. **Panel de información**: Sala `#madrid`, País España, Categoría Ciudad, Actividad Alta, "También conecta con: #espana, #amistad, #chatzona".
4. **Bloques SEO**: Sobre el chat de Madrid; Qué puedes encontrar; Consejos de seguridad; Otras salas cercanas; Noticias de Madrid; Tiempo en Madrid.
5. **Salas relacionadas**: Barcelona, Valencia, Sevilla, Bilbao, Málaga, España, Amistad, Amor.
6. **FAQ** (FAQBlock con JSON-LD FAQPage).

### 6.3 Webchat (`/webchat`) — funcional
- Lee query `canal` (ej. `?canal=madrid`).
- `lib/channels.ts` calcula canales relacionados:
  - Madrid → `#madrid,#espana,#amistad,#chatzona`
  - México → `#mexico,#internacional,#amistad,#chatzona`
  - Amor → `#amor,#amistad,#chatzona`
- `lib/nick.ts` genera `Invitado-XXXX` aleatorio (cliente).
- `WebchatFrame` monta:
  ```html
  <iframe
    src="https://chat.chatzona.org/index.html?clientId={CLIENT_ID}#nick={nick}&channel={canales}&show_password_box=false"
    width="100%" height="600" border="0"></iframe>
  ```
  `CLIENT_ID` configurable (variable de entorno, valor por defecto `af9476269cf237c0196b`).
- Layout: header mínimo, nombre de sala arriba, iframe grande (casi pantalla completa en móvil), debajo salas relacionadas y normas básicas.

### 6.4 Rutas andamiadas
`/chat`, `/pais/[pais]`, `/ciudad/[ciudad]`, `/noticias`, `/noticias/[categoria]`, `/tiempo/[ciudad]`, `/horoscopo/[signo]`, `/loterias/[pais]`, `/ranking` — con su layout, breadcrumb y metadata, listas para rellenar con datos.

## 7. Mobile (mobile-first)
- Header compacto: logo, icono menú, botón "Entrar".
- **Bottom navigation fija**: Inicio, Chat, Países, Noticias, Más.
- Hero en una columna; buscador arriba; botón "Entrar" visible sin scroll.
- Tarjetas en carrusel horizontal; rankings en listas simples.
- Sin elementos pesados; prioridad a la velocidad.

## 8. SEO y rendimiento
- Schema.org JSON-LD: WebSite (home), BreadcrumbList (páginas con breadcrumb), CollectionPage (índices/directorios), Article (noticias), FAQPage (bloques FAQ).
- `generateMetadata` por ruta (title, description, canonical, OpenGraph).
- `next-sitemap` para sitemap.xml + `robots.txt`; `llms.txt` para buscadores con IA.
- `next/image` + lazy loading; HTML semántico; URLs limpias; buen enlazado interno.
- Core Web Vitals: fuente local, CSS mínimo, sin JS innecesario en páginas de contenido.

## 9. Datos mock (v1)
- **Países**: España, México, Argentina, Colombia (+ resto del grid por continentes).
- **Ciudades**: Madrid (modelo, con detalle local), Barcelona, Valencia, Sevilla, Bilbao, Málaga, A Coruña, Vigo, Zaragoza, Alicante, Buenos Aires, CDMX, Bogotá, Lima, Santiago, Montevideo.
- **Temáticas**: las 15 listadas.
- **Noticias**: ejemplos por categoría.
- **Salas/ranking**: actividad y votos de ejemplo.

## 10. Fuera de alcance (v1)
- Backend real, base de datos, autenticación.
- Datos en tiempo real (usuarios conectados reales).
- Contenido real de noticias/tiempo/loterías/horóscopo (se rellenan después).
- CMS.

## 11. Criterios de éxito
- Home, `/chat/madrid` y `/webchat` funcionan y se ven pulidos en desktop y mobile.
- "Entrar" desde cualquier sala lleva a `/webchat?canal=...` y carga el iframe con canales y nick correctos.
- Todos los componentes de la lista existen y se reutilizan.
- Metadata + JSON-LD presentes; Lighthouse SEO y rendimiento altos.
- Cambiar un dato mock se refleja en la UI sin tocar componentes.
