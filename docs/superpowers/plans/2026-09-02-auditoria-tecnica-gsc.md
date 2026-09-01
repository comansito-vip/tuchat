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

## 4. Core Web Vitals — NO MEDIDO, limitación de esta sesión

No se pudo obtener ni datos de campo (CrUX) ni de laboratorio:
- **PageSpeed Insights API**: sin API key configurada en ningún proyecto de la red, la cuota compartida sin key se agotó a la primera URL (`429 Quota exceeded... Queries per day`).
- **Lighthouse local**: CLI instalado (`npx lighthouse` responde) pero no hay Chrome/Chromium disponible en este entorno (`Unable to connect to Chrome`).

Lo único que hay de referencia es TTFB medido en sesiones anteriores desde el VPS: **0,11-0,14 s con la Cache Rule de Cloudflare activa** (memoria `project_production_deploy`), que es un buen indicio indirecto pero no sustituye a LCP/INP/CLS reales.

**Recomendación para desbloquear esto**: crear una API key gratuita de Google Cloud (PageSpeed Insights API, cuota generosísima con key) y guardarla en algún `.env` de la red, o revisar el informe "Core Web Vitals" directamente en el panel de Search Console — es una vista agregada que solo existe ahí, la API nunca la expone.

## 5. Vídeo

**No aplica.** Revisado el código fuente completo (`src/`): no hay ningún `VideoObject` en JSON-LD, ninguna etiqueta `<video>`, ningún embed de YouTube/Vimeo. tuchat.org no tiene contenido de vídeo, así que no hay nada que auditar en esta categoría ni ninguna oportunidad perdida de rich results de vídeo (no sería aplicable sin contenido real que mostrar).

## 6. Otros hallazgos

- El propio informe de Sitemaps de Google no es fiable para "cuántas están indexadas" (ver sección 2) — si en el futuro se quiere automatizar una alerta de indexación, basarla en Search Analytics (`page` con alguna impresión) o en URL Inspection por muestreo, nunca en `sitemaps.contents[].indexed`.
- robots.txt ya contempla explícitamente los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, CCBot, OAI-SearchBot) con acceso permitido — coherente con el esfuerzo ya hecho de `llms-full.txt` para presencia en motores de respuesta.
- No se ha tocado ningún sitemap, no se ha reenviado nada a Google — todo lectura.

## Prioridades recomendadas (sin aplicar, a decidir)

1. **Conseguir una API key de PageSpeed Insights** (gratis, 5 minutos en Google Cloud Console) para poder medir Core Web Vitals de verdad en la próxima auditoría — ahora mismo es un punto ciego real.
2. Nada más es urgente a nivel técnico: sitemap sano, robots.txt correcto, rich results (breadcrumbs) funcionando en todo lo indexado, sin vídeo que auditar.
3. El único frente que sigue abierto es el ya conocido: **más rastreo/indexación**, no algo que un cambio técnico vaya a resolver (ya se descartó contenido y enlazado interno). Seguir con el monitoreo periódico de Search Console (próxima remedida ya agendada 20-25 de septiembre).
4. Opcional, bajo impacto: investigar por qué `/chat/madrid` (alto volumen esperado) no está indexada mientras `/chat/barcelona` y `/chat/mexico` sí — no hay patrón obvio por tamaño de ciudad, podría valer una inspección puntual más adelante si el patrón se repite en un muestreo más grande.
