# Keyword research y auditoría operativa — tuchat.org (2026-09-03)

Encargo mensual: estado de crons, auditoría técnica en vivo, GSC y keyword
research priorizado. Reaprovecha dos informes de esta misma semana que ya
cubrían GSC y técnico a fondo (`2026-09-01-keyword-research-tuchat.md`,
`2026-09-02-auditoria-tecnica-gsc.md`) — no se repiten esas medidas, se citan.
Lo nuevo de esta pasada: estado de los crons/VPS (no auditado antes), calidad
del contenido generado, auditoría on-page fresca (title/meta/H1/alt/canonical)
y el cruce de keyword research con el catálogo de verticales no-chat.

## 0. Hallazgo crítico — el pipeline del VPS lleva desde hoy con un rebase de git roto

**El checkout `/var/www/tuchat.org` está en medio de un `git rebase` sin
resolver desde las 02:41 UTC de hoy (2026-09-03) y sigue así en el momento de
escribir esto.** Efecto medido, no supuesto:

- **El goteo de salas de localidad de hoy se perdió entero.** El cron de las
  01:30 UTC (`generar-salas-tuchat.sh`) generó su lote de 50 localidades +
  3 términos, pero al hacer `git pull --rebase` tras un push rechazado
  encontró conflictos reales en `data/localidades/cron.log`,
  `data/localidades/generadas.json`, `data/localidades/progreso.json` y
  `src/data/cities-generadas.ts` (choque con cuatro commits manuales hechos
  desde este equipo entre las 01:37 y las 01:49 UTC que tocaban los mismos
  ficheros: `fea81cd`, `222d31b`, `04ff3d6`). El script murió ahí (`set -e`)
  sin commitear ni publicar nada. La generación de esas 50 fichas no quedó
  en ningún sitio: hay que rehacerla.
- **Las noticias de hoy también se perdieron**, por la misma causa indirecta.
  El cron de las 05:00 UTC (`generar-noticias-tuchat.sh`) sí generó el
  contenido y pasó los 526 tests, pero al intentar publicar el `git push`
  chocó con el mismo avance de `origin/main` y el `git pull --rebase` de
  reintento murió al instante con `fatal: It seems that there is already a
  rebase-merge directory` — el directorio de rebase roto que había dejado el
  cron de salas 2h25min antes seguía ahí, sin abortar. Confirmado en
  `src/data/news.ts`: hay 7 noticias fechadas `2026-09-01` y 8 fechadas
  `2026-09-02`, ninguna `2026-09-03`.
- **El sitio en vivo no se cayó** porque el deploy de las 05:30 UTC
  (`deploy-tuchat.sh`) sí consiguió el lock (los dos crons anteriores habían
  muerto y lo habían liberado), hizo `git reset --hard origin/main` sobre el
  estado que había en ese momento (commit `04ff3d6`, ya con los cuatro
  commits manuales de la madrugada) y reconstruyó bien — `BUILD_ID` de las
  05:37 UTC, `deploy OK` a las 05:42. El contenido publicado hoy es el de los
  commits manuales de esta sesión, no el de los dos crons automáticos.
- **El directorio `.git/rebase-merge` sigue ahí ahora mismo** (comprobado por
  SSH después del deploy): un `git reset --hard` no lo limpia, solo
  sobrescribe el árbol de trabajo. Mientras no se resuelva a mano
  (`git rebase --abort` es lo seguro — el HEAD ya coincide con `origin/main`
  gracias al reset del deploy, así que abortar no pierde nada que no esté ya
  perdido), **cualquier próximo `git pull --rebase` en ese checkout fallará
  igual de instantáneo**. Es decir: la próxima vez que un cron automático
  choque con un push manual desde este equipo (ha pasado varias veces esta
  semana, ver `fea81cd`/`222d31b`/`88ec3b8`/`8ee5e19`, todos de hoy), el cron
  correspondiente morirá sin publicar, sin excepción, hasta que alguien
  ejecute a mano en el VPS `cd /var/www/tuchat.org && git rebase --abort`.
- No se ha tocado el VPS para corregirlo (fuera de alcance de esta auditoría,
  solo lectura). **Se recomienda como acción manual prioritaria del usuario**,
  antes del cron de las 01:30 de mañana.

Efecto colateral menor detectado en el mismo log: el cron
`generar-terminos-tuchat.sh` (`0 3 * * *`, "goteo diario de salas de término,
3/día") lleva sus dos únicas ejecuciones registradas —2026-09-02 y
2026-09-03— saltándose por "pipeline ocupado". Aparte de la coincidencia con
el lío de hoy, este cron **parece redundante**: `generar-salas-tuchat.sh` ya
ejecuta `salas-termino.mjs --lote 3` dentro de su propia pasada de las 01:30
(ver `deploy/generar-salas-tuchat.sh` línea con el comentario "En la misma
pasada salen las tres salas de término del día"). Si la intención era 3
salas de término al día, ya se cumple sin el cron de las 03:00; revisar si
sobra.

## 1. Crons y calidad del contenido generado

Aparte del incidente de hoy, el patrón de fondo (repasando el log completo
desde el 16 de agosto) es sano: **"publicado ✓" prácticamente todos los días**,
tanto para noticias (05:00 UTC) como para salas (01:30 UTC), con tests en
verde cada vez (526 tests / 45 ficheros en la ejecución de hoy antes de morir
en el push). El único fallo de publicación en las últimas tres semanas es el
de hoy.

**Calidad de las noticias** (leídas 4 del lote de `2026-09-02`, el último que
sí se publicó, `src/data/news.ts` líneas 5528-5567):

- Longitud correcta: 4-5 párrafos, 350-500 palabras por pieza — dentro del
  rango 300-700 ya fijado como estándar del proyecto.
- Sin muletillas obvias de IA ("sumérgete", sin negritas de urgencia). Un
  matiz menor: la pieza de nutracéuticos cierra con "En síntesis, el auge
  de..." — variante suave de "en resumen", el tipo de cierre que ya se
  vigila; no rompe ninguna regla existente pero vale la pena que el
  verificador de curación lo trate igual que "en resumen".
- **Hallazgo nuevo, con dato exacto**: la pieza `la-relacion-entre-educacion-
  financiera-y-consumo-responsable` (fecha `2026-09-02`) tiene una palabra en
  **francés** colada en medio de una frase en español: *"la educación
  financiera se convierte en un motor de autonomía económica **plutôt** que
  en una mera regla de comportamiento."* ("plutôt" = "más bien"/"en vez de").
  Ni `npm run curar` ni `npm test` lo detectaron — no hay ninguna regla que
  compruebe idioma a nivel de palabra. Es un artefacto de generación LLM que
  se coló en producción. Impacto bajo (una palabra en un artículo, no afecta
  al posicionamiento del dominio), pero es exactamente el tipo de fallo que
  la puerta de "sin muletillas de IA" existe para atrapar y no atrapó.
- Proporcionalidad de llamadas LLM: el diseño ya es prudente — huella de
  `npm ci` por hash de `package-lock.json` para no reinstalar si no cambió,
  `check-llm-providers.mjs` para sondear cuota antes de generar, y el goteo
  de salas ya limitado a 50/día con reintento acotado (lote de 20 en modo
  "rehacer"). No se ve ninguna llamada redundante a proveedores.

## 2. Auditoría técnica on-page (en vivo, hoy)

Home + 4 páginas tipo, comprobado por `curl` directo a producción:

| URL | Title (long.) | Meta description (long.) | H1 | Canonical |
|---|---|---|---|---|
| `/` | "Chat gratis de amigos, chatear en España y Latinchat" (52) | 150 car. | "Chat gratis en español" | `https://www.tuchat.org` |
| `/chat/madrid` | "Chat Madrid gratis sin registro" (31) | 136 car. | "Chat Madrid gratis" | ok |
| `/chat/barcelona` | "Chat Barcelona gratis sin registro" (34) | 156 car. | "Chat Barcelona gratis" | ok |
| `/noticias` | "Noticias en español — Actualidad y últimas noticias · TuChat" (60) | 143 car. | "Noticias y actualidad" | ok |
| `/chat/republica-dominicana` | "Chat República Dominicana gratis sin registro" (45) | 153 car. | "Chat República Dominicana gratis" | ok |

**Las 5 páginas cumplen el estándar del proyecto** (title 30-65, meta
120-160) sin excepción, y sin duplicados entre ellas. El contenido de las
fichas de ciudad sigue anclado a datos reales y específicos (Metro de
madrugada y Malasaña-Vallecas en Madrid; Eixample/Gràcia en Barcelona;
merengue/bachata/mangú en R. Dominicana) — coherente con la técnica
anti-página-puerta ya aplicada al resto de la red.

Datos estructurados (JSON-LD) presentes y variados según tipo de página:
`Organization`, `WebSite`+`SearchAction`, `FAQPage`, y en las páginas de
ciudad además `BreadcrumbList` + `CollectionPage`/`ItemList`. Sin
`hreflang` en ninguna — correcto, el sitio es monolingüe en español y no
aplica.

`robots.txt` permite rastreo general y de los principales bots de IA
(GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot,
Google-Extended, CCBot), bloquea `/admin` y `/api`, declara host canónico
con `www` y el sitemap. `sitemap.xml` (índice) accesible y correcto,
apunta a `sitemap-0.xml`.

**Hallazgo con dato**: en `/chat/madrid`, de 8 etiquetas `<img>` en el HTML,
**6 tienen `alt=""` vacío** y solo la bandera de la Comunidad de Madrid lleva
alt descriptivo. Confirma con una muestra fresca el backlog ya conocido
("169 alt genéricos pendientes" en la memoria del proyecto) — aquí ni
siquiera es genérico, es vacío. No es nuevo, pero se documenta con cifra
concreta de esta sesión.

CWV, estado de indexación por muestreo, sitemaps enviados a Google y
rendimiento Lighthouse **no se han re-medido hoy**: ya están medidos en
detalle en `2026-09-02-auditoria-tecnica-gsc.md` (LCP 1,8-2,1s / score 0,99
en las 4 URLs medibles, `/noticias` sigue sin poder medirse por un error 500
de la propia herramienta PSI, sitemap sano sin errores/avisos). Repetirlo hoy
no habría cambiado nada — sin tráfico real nuevo desde ayer, PSI habría dado
el mismo resultado con más ruido de laboratorio.

## 3. GSC — resumen (reaprovechado de los informes de esta semana, sin repetir la consulta)

Fuente: `2026-09-01-keyword-research-tuchat.md` (propiedad
`https://www.tuchat.org/`) y `2026-09-02-auditoria-tecnica-gsc.md` (propiedad
`sc-domain:tuchat.org`, más completa). 90 días, lag de 2-3 días.

- **38 clics / 2.219 impresiones / CTR 1,71% / posición media 54,8** (dominio
  completo). 28d vs 28d anteriores: impresiones **+93%** (757 → 1.461) — la
  tendencia al alza sigue, es el dato más fuerte de las dos últimas medidas.
- 15 páginas con alguna impresión (de 3.465 URLs en sitemap): el rastreo
  sigue siendo el cuello de botella real, no hay ningún problema de
  contenido o técnico que lo explique (ya descartado en agosto y
  reconfirmado el 1 y el 2 de septiembre).
- Sitemaps: 0 errores, 0 avisos, descargados a diario por Google por su
  cuenta (3.465 web + 606 image).
- Muestra de 13 URLs por Inspección: 6/13 indexadas (sesgada a páginas
  grandes); sin patrón claro por tamaño de ciudad (`/chat/barcelona` y
  `/chat/mexico` indexadas, `/chat/madrid` no).

## 4. Keyword research priorizado

### (a) Defender — el único patrón con tracción real hoy: consultas "org"

Todas por debajo de 60 impresiones/90d, pero son lo único que entra en
posición 11-20 y lo que sostiene el crecimiento:

| Impr. (90d) | Posición | Consulta |
|---:|---:|---|
| 53 | 14,0 | chat gratis org |
| 7 | 11,4 | salas de chat org |
| 3 | 11,0 | chat amigos org |
| 3 | 13,0 | latin chat org |

No corresponden a ninguna sala: las imprime la home/dominio, no una landing
concreta. No hay copy que tocar aquí — es autoridad de dominio acumulándose,
y el trabajo es dejarlo seguir, no "reforzar" una página que no existe para
este patrón.

### (b) Empujar (11-20 → top 10) — sin landing identificable que reforzar

Añadidas a las de arriba: `sala de chat sin registro` (18,8), `calentarg
chat` / `chat movil hispano bdsm` / `chatear online gratis` / `chats
gratuito` (14-18, 1 imp cada una). Ninguna es accionable con una página
concreta — es ruido de cola larga sobre el dominio. La única página de
catálogo real con posición cercana al top 10 es `/chat/republica-dominicana`
(pos 11,2, 90d) — vigilarla, no tocarla (no hay ningún problema técnico
detectado en ella).

### (c) Crear — confirmado que no hay hueco de catálogo, con un matiz nuevo

El informe del 2026-09-01 ya cruzó el corpus de la red contra el catálogo de
salas grandes (madrid, barcelona, méxico, argentina, gay, chueca, r.
dominicana, colombia, perú, chile) y **tuchat.org no aparece en ninguno**,
ni siquiera en los de cientos de miles de impresiones de red — no es un
problema de qué páginas crear, todas existen ya.

Novedad de esta pasada: se cruzó también el corpus con los **verticales
no-chat** que el sitio ya tiene construidos y en producción —`/tarot`,
`/horoscopo`, `/ranking`, `/anime`— contra la demanda que la red ya capta en
esos mismos términos:

| Término (corpus red) | Impr. red (90d) | Pos. media red | tuchat.org aparece? |
|---|---:|---:|---|
| chat tarot gratis | 5.545 | 8,2 | No |
| chat de tarot gratis | 977 | 6,4 | No |
| chat tarot | 1.641 | 13,9 | No |
| horóscopo leo/tauro/géminis hoy (agregado) | ~1.400 | 20-30 | No |
| chat anime | 6 | 38,3 | **Sí** (única aparición, bajísimo volumen) |

Conclusión: **tampoco aquí hay páginas por crear** — tarot, horóscopo y
ranking ya existen como secciones del sitio, simplemente no reciben ninguna
impresión medible todavía (0 filas en el TSV propio de tuchat.org para
"tarot" y "horosc"). Es el mismo problema de fondo que el resto del dominio
(autoridad/rastreo), no un vacío de contenido — no se recomienda invertir en
escribir más sobre estos verticales hasta que el dominio tenga tracción
general; sería repetir el error ya descartado de "arreglar indexación con
más copy".

## 5. Pendientes accionables, ordenados

1. **(Crítico, manual, fuera de este alcance de solo-lectura)** Resolver el
   rebase roto en `/var/www/tuchat.org`: `git rebase --abort` en el VPS antes
   del cron de las 01:30 UTC de mañana. Sin esto, el próximo choque entre un
   push manual y un cron automático volverá a perder un día de contenido.
2. Rehacer a mano (o dejar que el goteo normal las alcance con tiempo) las
   ~50 localidades y las noticias del 2026-09-03 que se perdieron por el
   incidente de hoy.
3. Revisar si `generar-terminos-tuchat.sh` (cron de las 03:00) es redundante
   con las salas de término que ya genera `generar-salas-tuchat.sh` a las
   01:30 — si es duplicado, retirarlo simplifica el pipeline y libera una
   ventana del lock compartido.
4. Añadir al verificador de curación una comprobación de idioma (detectar
   palabras/frases que no sean español) — el caso concreto de "plutôt" en
   `la-relacion-entre-educacion-financiera-y-consumo-responsable` (fecha
   2026-09-02) es reproducible y gratis de corregir a mano ahora mismo si se
   quiere.
5. Añadir `alt` descriptivo a las imágenes de las fichas de ciudad (6 de 8
   vacías en la muestra de `/chat/madrid`) — trabajo de baja prioridad ya
   señalado en memoria del proyecto, se confirma con cifra fresca.
6. Nada de keyword research nuevo que ejecutar: catálogo de chat completo,
   verticales (tarot/horóscopo/ranking) completos y sin tracción por la
   misma causa de fondo (autoridad de dominio), no por falta de páginas.
   Próxima remedida de GSC recomendada: 2026-09-20/25, como ya estaba
   agendado.
