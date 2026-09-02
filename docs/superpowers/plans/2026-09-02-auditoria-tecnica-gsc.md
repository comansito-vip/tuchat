# Auditoría técnica GSC — tuchat.org (2026-09-02)

Medido por API (`sc-domain:tuchat.org`, la propiedad de dominio — agrega http/https/www/apex, más completa que la de prefijo `https://www.tuchat.org/`) más PageSpeed Insights y comprobación en vivo de robots/sitemap. Continúa el diagnóstico de indexación cerrado ayer (2026-09-01): aquí el foco es la parte técnica (sitemap, Core Web Vitals, muestra de páginas, vídeo), no se remide el rendimiento de búsqueda en detalle otra vez.

## 1. Rendimiento (Search Analytics)

90 días (2026-06-01 a 2026-08-30, lag de 3 días):
- **38 clics, 2.219 impresiones, CTR 1,71%, posición media 54,8.**
- Por dispositivo: móvil 22 clics/1.202 impr/pos 51,5 · escritorio 15/970/pos 60,9 · tablet 1/47/pos 12,7 (n muy bajo en tablet, no sacar conclusiones).
- `searchAppearance`: sin filas — no hay suficiente volumen para que Google desglose por tipo de resultado enriquecido en este informe.

28 días actuales vs 28 anteriores: **22 clics/1.461 impr vs 15/757 — impresiones casi se duplican (+93%)**, coherente con la tendencia al alza ya documentada.

No hay ningún problema específico de un dispositivo frente a otro más allá del ruido esperable con este volumen.

## 2. Sitemap

Dos sitemaps enviados, ambos sanos:

| Sitemap | Última descarga | Errores | Avisos | Contenido |
|---|---|---|---|---|
| `sitemap.xml` (índice) | 2026-08-31 08:46 | 0 | 0 | 3.465 web + 606 image submitted |
| `sitemap-0.xml` | 2026-09-01 05:05 | 0 | 0 | 3.465 web + 606 image submitted |

- Coincide con las **3.465-3.469 URLs** que maneja IndexNow — el sitemap está al día, Google lo descarga a diario por su cuenta (no hace falta reenviarlo a mano).
- **El campo `indexed` del propio informe de sitemaps marca 0 para todo** (web e imagen). Esto es un campo conocido por ser poco fiable en la API de Search Console — la fuente de verdad real es la inspección URL por URL (sección siguiente), que sí muestra páginas indexadas. No se interpreta como "0 páginas indexadas de verdad": ya sabemos por Search Analytics e inspección directa que hay más.
- robots.txt correcto: permite rastreo general y de los bots de IA (GPTBot, ClaudeBot, PerplexityBot, CCBot…), bloquea `/admin` y `/api`, declara el sitemap y el host canónico con www.

## 3. Estado de indexación — muestra de 13 URLs (URL Inspection API)

| URL | Estado | Última rastreo | Rich results |
|---|---|---|---|
| `/` | ✅ Enviada e indexada | 2026-09-01 | — |
| `/chat/barcelona` | ✅ Enviada e indexada | 2026-08-27 | Rutas de exploración (PASS) |
| `/chat/mexico` | ✅ Enviada e indexada | 2026-08-24 | Rutas de exploración (PASS) |
| `/ranking` | ✅ Enviada e indexada | 2026-08-30 | Rutas de exploración (PASS) |
| `/chat` | ✅ Enviada e indexada | 2026-08-28 | Rutas de exploración (PASS) |
| `/anime` | ✅ Enviada e indexada | 2026-08-30 | Rutas de exploración (PASS) |
| `/chat/madrid` | ❌ Descubierta, sin indexar | nunca | — |
| `/chat/buenos-aires` | ❌ Descubierta, sin indexar | nunca | — |
| `/noticias` | ❌ Descubierta, sin indexar | nunca | — |
| `/tiempo` | ❌ Descubierta, sin indexar | nunca | — |
| `/tarot` | ❌ Google no reconoce la URL | nunca | — |
| `/chat/palermo-colombia` | ❌ Google no reconoce la URL | nunca | — |
| `/chat/turmero` | ❌ Google no reconoce la URL | nunca | — |

**6 de 13 indexadas (46% en esta muestra, sesgada a lo grande — el ratio real del sitio completo sigue siendo mucho menor, ~15 de 3.465 por lo medido ayer).** Dato llamativo: `/chat/barcelona` y `/chat/mexico` están indexadas pero **`/chat/madrid` no** — no es un patrón de "las ciudades grandes sí, las pequeñas no", es más irregular que eso. Todas las páginas indexadas devuelven `richResultsVerdict: PASS` con breadcrumbs (`BreadcrumbList`) reconocidos — el schema funciona. Ninguna mostró error de rich results.

`mobileUsabilityVerdict` sale `VERDICT_UNSPECIFIED` en las 13 — Google retiró el informe independiente de Usabilidad móvil en 2023 (lo sustituyó por Core Web Vitals), así que este campo ya no se rellena; no es un fallo de la sonda ni del sitio.

## 4. Core Web Vitals — MEDIDO (actualizado 2026-09-02, tras conseguir API key)

El usuario dio una API key propia de PageSpeed Insights (guardada en `.env.local` como
`PAGESPEED_API_KEY`, potencialmente reutilizable en el resto de proyectos de la red).
Con ella, PSI responde con datos de laboratorio (Lighthouse); **no hay datos de campo
(CrUX) todavía** — `loadingExperience` viene vacío en todas las URLs probadas porque el
origen no tiene tráfico real suficiente en los últimos 28 días que Chrome pueda agregar
(coherente con las 38 clics/90 días medidos en la sección 1). Datos de laboratorio,
estrategia mobile (la que manda para el ranking):

| URL | LCP | CLS | TBT | Lighthouse Performance |
|---|---:|---:|---:|---:|
| `/` (home) | 2,1 s | 0 | 10 ms | 0,99 |
| `/chat` (listado) | 1,8 s | 0,057 | 80 ms | 0,99 |
| `/chat/palermo-colombia` (ciudad pequeña) | 2,1 s | 0 | 20 ms | 0,99 |
| `/chat/barcelona` (ciudad grande) | 2,1 s | 0 | — | 0,99 |
| `/noticias` (hub) | sin medir (ver abajo) | — | — | — |

**REMEDIDO el mismo día: el 4,2s de Barcelona era ruido de una sola pasada.**
Repetido dos veces más y salió 2,1s ambas (score 0,99), con el mismo desglose de LCP
(`lcp-breakdown-insight`: TTFB ~2ms + render delay ~207ms, nada que explique 4 segundos).
Lección: con PSI, no dar un hallazgo de "Needs improvement" por bueno sin repetir la
medición al menos una vez — la variabilidad entre ejecuciones puede ser de segundos
enteros sin que cambie nada real en el sitio.

**`/noticias` no se pudo medir: PageSpeed Insights falla con error 500 de Lighthouse
de forma consistente** (4 intentos: mobile y desktop, con y sin filtro de categoría,
todos `"Lighthouse returned error: Something went wrong"`). Comprobado que el fallo NO
es del sitio: `curl` a la URL responde 200, 242 KB, 1,4 s, HTML bien formado — 48
`<img>` con `next/image` en modo `fill`, solo la primera (destacada) sin `loading="lazy"`
(correcto, es la candidata a LCP), las otras 47 en lazy. No hay indicio de nada roto en
el código. Se deja documentado como fallo de la herramienta (PSI/Lighthouse), no del
sitio — reintentar en otra sesión antes de investigar más a fondo.

**Patrón real (corregido):** todas las páginas medibles —home, listado general, ciudad
pequeña y ciudad grande— están en zona "Good" (LCP ~1,8-2,1s, score Lighthouse 0,99).
CLS se mantiene en 0 salvo el listado (0,057, todavía dentro de "Good" &lt;0,1). No hay
ningún problema real de rendimiento en las páginas que se pudieron medir. La única
incógnita es `/noticias`, que no se pudo medir por el fallo de herramienta ya descrito
arriba — no hay ninguna señal (curl, HTML, imágenes) de que el sitio tenga un problema
ahí, así que no se trata como hallazgo hasta poder medirlo de verdad.

## 5. Vídeo

**No aplica.** Revisado el código fuente completo (`src/`): no hay ningún `VideoObject` en JSON-LD, ninguna etiqueta `<video>`, ningún embed de YouTube/Vimeo. tuchat.org no tiene contenido de vídeo, así que no hay nada que auditar en esta categoría ni ninguna oportunidad perdida de rich results de vídeo (no sería aplicable sin contenido real que mostrar).

## 6. Otros hallazgos

- El propio informe de Sitemaps de Google no es fiable para "cuántas están indexadas" (ver sección 2) — si en el futuro se quiere automatizar una alerta de indexación, basarla en Search Analytics (`page` con alguna impresión) o en URL Inspection por muestreo, nunca en `sitemaps.contents[].indexed`.
- robots.txt ya contempla explícitamente los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, CCBot, OAI-SearchBot) con acceso permitido — coherente con el esfuerzo ya hecho de `llms-full.txt` para presencia en motores de respuesta.
- No se ha tocado ningún sitemap, no se ha reenviado nada a Google — todo lectura.

## Prioridades recomendadas (sin aplicar, a decidir)

1. ~~Conseguir una API key de PageSpeed Insights~~ — **hecho el 2026-09-02**, el usuario la dio y ya está en `.env.local`. Core Web Vitals medidos (sección 4): todo en zona "Good", sin problema real de rendimiento.
2. **Reintentar medir `/noticias`** en otra sesión (PSI le da 500 de forma consistente por ahora) antes de investigar nada — puede que sea un problema temporal de la herramienta, no del sitio.
3. Nada más es urgente a nivel técnico: sitemap sano, robots.txt correcto, rich results (breadcrumbs) funcionando en todo lo indexado, sin vídeo que auditar.
4. El único frente que sigue abierto es el ya conocido: **más rastreo/indexación**, no algo que un cambio técnico vaya a resolver (ya se descartó contenido y enlazado interno). Seguir con el monitoreo periódico de Search Console (próxima remedida ya agendada 20-25 de septiembre).
5. Opcional, bajo impacto: investigar por qué `/chat/madrid` (alto volumen esperado) no está indexada mientras `/chat/barcelona` y `/chat/mexico` sí — no hay patrón obvio por tamaño de ciudad, podría valer una inspección puntual más adelante si el patrón se repite en un muestreo más grande.
