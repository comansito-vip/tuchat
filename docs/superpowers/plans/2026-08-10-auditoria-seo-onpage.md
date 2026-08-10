# Auditoría SEO on-page — H1, H2, alt, enlaces e indexación

**Fecha:** 2026-08-10 · **Alcance:** las 4.991 páginas del build (`e0fefac`), más producción y
Search Console.
**Método:** build completo, `auditar-html.mjs`, `auditar-contenido.ts`, un auditor a escala
escrito para esta sesión (grafo de enlaces, H2 repetidos, volumen de texto), verificación con
`next start` de los códigos HTTP, y datos reales de la API de Search Console.

---

## Resumen

**Lo on-page está prácticamente limpio.** Los dos auditores del repo dan 3 avisos MEDIO y 1
aviso en total sobre 4.991 páginas. No hay ni un `<img>` sin alt, ni un H1 duplicado en todo el
sitio, ni una sola página sin meta description, y el sitemap coteja exacto con las páginas
publicadas: 4.997 URLs, cero sobrantes, cero faltantes, cero duplicadas.

Los fallos que sí quedan son cuatro, y ninguno es de etiquetado:

1. **76 enlaces internos que devuelven 404** desde páginas indexables (verificado con HTTP).
2. **20 páginas huérfanas** que están en el sitemap y no las enlaza nadie.
3. **2.559 de 2.561 salas** siguen con el H2 genérico `Sobre el chat de X`.
4. **1.966 páginas de `/tiempo`** con una mediana de 174 palabras — el 39% del sitemap.

Y por encima de todo: **el diagnóstico del 6-7 de agosto sigue vigente y no ha mejorado.** De
18 URLs inspeccionadas hoy, 3 están indexadas. En 90 días el dominio suma 828 impresiones y 15
clics, y el 96% de esas impresiones son de la home. Ninguno de los 16 dominios hermanos del
disco enlaza a tuchat.org — comprobado archivo por archivo, cero menciones. Mientras eso siga
así, arreglar los cuatro puntos de arriba mejora la calidad pero no traerá tráfico por sí solo.

---

## 1. Lo que está bien (y conviene no tocar)

Medido sobre las 4.991 páginas del build:

| Comprobación | Resultado |
|---|---|
| `<title>` presente y único | 4.991/4.991 · 0 duplicados |
| meta description presente | 4.991/4.991 · 0 duplicadas · 3 pasan de 170 car. |
| `<link rel=canonical>` | en todas · 0 repetidos entre rutas |
| Un solo `<h1>` por página | sí, en todas |
| **H1 duplicados entre páginas** | **0 textos repetidos en todo el sitio** |
| `<img>` sin `alt` | **0 de 16.202 imágenes** |
| Jerarquía de encabezados sin saltos | sin saltos |
| Encabezados vacíos | 0 |
| Enlaces sin nombre accesible | 0 |
| JSON-LD parseable y con `@type` | en todas |
| `noindex` accidental | 0 (solo `/webchat`, que es deliberado y correcto) |
| Sitemap vs páginas reales | 4.997 = 4.997, sin sobrantes ni faltantes |
| robots.txt | correcto, con los bots de IA declarados uno a uno |
| `tuchat.org` → `www` | 301 limpio · HSTS · caché de Cloudflare activa |

Sobre los `alt`: de las 16.202 imágenes, 13.639 llevan `alt=""`. **No es un fallo**: son las
banderas de las tarjetas de sala, que van acompañadas del nombre en texto justo al lado, y ahí
`alt=""` es lo correcto (con alt, el lector de pantalla lee el nombre dos veces). Las imágenes
que sí son contenido — las 414 de noticias — llevan el titular completo como alt. Está bien
resuelto.

Los 414 `<img>` "sin width/height" que marca el auditor son `next/image` con `fill`, que
posiciona en absoluto sobre un contenedor con proporción fija: no generan CLS. Falso positivo.

---

## 2. Los 76 enlaces internos a 404 · **prioridad alta, arreglo mecánico**

Cada sala que no es temática pinta una tarjeta «Tiempo en X» que enlaza a `/tiempo/{slug}`
([`chat/[slug]/page.tsx:219-232`](../../../src/app/chat/[slug]/page.tsx)). Pero
`tiempo/[ciudad]/page.tsx:13` declara `dynamicParams = false` y solo genera las localidades con
previsión real — decisión correcta y bien razonada en su comentario. El efecto colateral es que
**75 salas enlazan a una página de tiempo que no existe**, y Next responde 404, no un redirect.

Verificado con el servidor real:

```
200  /tiempo/madrid
404  /tiempo/petrer          ←  enlazado desde /chat/petrer
404  /tiempo/washington      ←  enlazado desde /chat/washington
404  /loterias/belice        ←  enlazado desde /chat/belice
```

Son 76 destinos (75 de `/tiempo` + `/loterias/belice`), cada uno enlazado desde su sala. Salen
sobre todo en las localidades nuevas del cron de goteo y en las ciudades de América.

**Arreglo:** condicionar la tarjeta a que la localidad tenga previsión, igual que ya hace
`generateStaticParams` — el predicado `hasWeather(slug)` ya existe. Mismo patrón para la
tarjeta de loterías, que solo debe pintarse si el país está en el catálogo.

> Merece una prueba de regresión: es exactamente el tipo de fallo que reaparece cada vez que el
> cron publica una tanda de salas nuevas.

## 3. Las 20 páginas huérfanas de `/ranking` · **prioridad media**

`ranking/[pais]/page.tsx` genera las 30 páginas de país. `/ranking` solo pinta enlaces a las
que devuelve `getRankingByKind("pais", 10)` — **diez**. Las otras veinte están en el sitemap
con `priority 0.7` y no las enlaza ninguna página del sitio:

```
/ranking/alemania   /ranking/belice     /ranking/bolivia    /ranking/canada
/ranking/costa-rica /ranking/cuba       /ranking/el-salvador /ranking/francia
/ranking/guatemala  /ranking/guinea-ecuatorial /ranking/honduras /ranking/italia
/ranking/marruecos  /ranking/nicaragua  /ranking/panama     /ranking/paraguay
/ranking/portugal   /ranking/puerto-rico /ranking/reino-unido /ranking/uruguay
```

Son las únicas 20 páginas huérfanas de todo el sitio; el resto del enlazado interno está bien
tejido (profundidad de clic desde la home: 150 páginas a 1 clic, 4.568 a 2, 248 a 3).

**Arreglo:** en la fila de chips de `/ranking`, listar los 30 países en vez del top 10 — el
ranking numérico de arriba puede seguir mostrando 10. Alternativa: enlazar `/ranking/{país}`
desde la propia sala del país.

## 4. El H2 de las salas sigue siendo plantilla en el 99,9% · **prioridad media**

El commit `196ce65` introdujo que cada sala estrene su propio H2 desde su contenido
(`place.aboutTitle`), con un comentario que lo explica muy bien: *«El genérico "Sobre el chat de
X" repetido en 4.900 páginas es la definición de plantilla con hueco, que es lo que Google lee
como página puerta»*. Medido sobre el HTML generado:

| H2 | páginas |
|---|---:|
| `Sobre el chat de X` (genérico) | **2.559** |
| Título propio de la sala (`aboutTitle`) | **2** |
| `Preguntas frecuentes` | 4.617 |
| `Qué puedes encontrar en esta sala` | 2.561 |
| `Otras salas que te pueden gustar` | 2.561 |
| `Información de la sala` | 2.561 |

Es decir: el mecanismo está construido y funciona, pero **solo lo han estrenado las 2 salas que
ha tocado el cron de goteo desde entonces**. A 12 salas/día tardaría siete meses en cubrir el
catálogo. Los otros tres H2 son fijos por diseño y eso es defendible (son secciones de la
plantilla, no contenido), pero el primero es el que lleva el peso semántico de la página.

**Arreglo:** una pasada de backfill que genere `aboutTitle` para las 2.559 salas restantes a
partir del `about` que ya tienen — el texto es único en todas ellas (lo confirma `npm run
auditar`), así que la materia prima está. No hace falta redactar contenido nuevo.

## 5. `/tiempo`: 1.966 páginas de 174 palabras · **prioridad media-baja, decisión de negocio**

| Sección | páginas | mediana de palabras |
|---|---:|---:|
| `/chat` | 2.562 | 645 |
| **`/tiempo`** | **1.966** | **174** |
| `/noticias` | 376 | 577 |
| `/ranking` | 31 | 253 |
| `/loterias` | 30 | 295 |
| home | 1 | 1.182 |

`/tiempo` es el 39% del sitemap con la cuarta parte de texto que una sala. En su descargo: el
valor de una página de previsión es el dato, no la prosa, y está bien hecha — la descripción, la
entradilla y las FAQ salen de la previsión real de cada ciudad, con cifras distintas por
localidad, no de una plantilla con hueco. Y ya se filtró para publicar solo donde hay datos.

Aun así, en un dominio al que Google todavía no le concede rastreo, 1.966 URLs finas compiten
por el mismo presupuesto que las 2.562 salas, que son las que de verdad interesan.

**Opciones**, por orden de lo que yo haría:
1. Dejarlo como está y revisarlo cuando el dominio ya tenga rastreo — el contenido no es malo.
2. Bajar `priority` de `/tiempo/*` a 0.3 en `next-sitemap.config.js` para señalar la jerarquía.
3. Recortar el sitemap de `/tiempo` a las capitales y ciudades grandes, dejando el resto
   accesible pero sin enviarlo.

No recomiendo borrarlas: dan servicio real y ya cumplen el filtro de «solo donde hay datos».

## 6. Cabos sueltos menores

- **`/contacto`**: 28 palabras y ningún H2 — la única página del sitio sin H2. Está en el
  sitemap. Un párrafo con las vías de contacto y un H2 la dejaría presentable.
- **3 meta descriptions pasan de 170 caracteres**: `/tiempo/concepcion-paraguay` (173),
  `/tiempo/san-marcos-guatemala` (173), `/tiempo/ushuaia` (178). Se cortan en el SERP.
- **`aboutLead`**: 11 salas comparten molde («la sala corresponde a X en X X»), lo detecta
  `npm run auditar`.
- **H1 idéntico al `<title>` en 2.940 páginas.** No es un fallo — el `roomTitle` es bueno —,
  pero desaprovecha una variante: el title puede llevar el término de búsqueda largo («Chat de
  Madrid gratis sin registro») y el H1 la versión limpia, cubriendo dos formulaciones.
- **`/chat/espana` pesa 1,35 MB con 1.206 enlaces** y `/tiempo` 2.050 enlaces. Google trunca
  páginas muy grandes al rastrearlas; conviene tenerlo en el radar si esas ciudades tardan en
  entrar al índice, aunque ahora mismo no es el cuello de botella.

---

## 7. El contexto que ordena todo lo anterior

Search Console, 2026-05-12 → 2026-08-07 (90 días):

| | |
|---|---:|
| Impresiones | 828 |
| Clics | 15 |
| Posición media | 52,4 |
| **URLs con al menos una impresión** | **5 de 4.997** |

Las 5: `/` (799 imp), `/chat` (31), `/anime` (9), `/chat/galicia` (3), `/chat/argentina` (2).
Donde entra, entra alto: `/chat` está en posición 6,2 y `/chat/argentina` en 3,5.

URL Inspection sobre 18 URLs representativas, hoy:

| Estado | URLs |
|---|---:|
| Enviada e indexada | **3** (`/`, `/chat`, `/anime`) |
| Descubierta: actualmente sin indexar | 9 |
| Google no reconoce esta URL | 6 |

Entre las que Google **ni siquiera reconoce** están `/noticias`, `/ranking`, `/tarot`,
`/como-funciona` y `/chat/ligar` — todas en el sitemap desde julio. Las «descubiertas» tienen
`lastCrawlTime` a null: nunca han sido rastreadas ni una vez.

Comprobado también hoy, uno por uno, en los 16 proyectos de la red que hay en disco
(chatzona.com, chatzona.net, portalchat.es, sexofacil, chatamigos, elchatgay, chatcamara,
chatligar, chatbarcelona, chatargentina, trivialchat, tarotgratuito, chatlesbianas, sumisas,
forochat, estoeschat):

> **cero menciones a tuchat.org.** Ninguno enlaza al dominio.

Es el mismo hallazgo de [`2026-08-07-continuar-aqui.md`](./2026-08-07-continuar-aqui.md), sin
cambios cuatro días después. Un dominio sin un solo enlace entrante no recibe presupuesto de
rastreo, y sin rastreo el mejor H2 del mundo no se llega a leer.

**La acción de mayor retorno sigue siendo enlazar a tuchat.org desde la red** — chatzona.org
(19,8 M impresiones) y canalchat.org (11,6 M) a la cabeza. Está fuera de este repositorio, pero
condiciona el rendimiento de todo lo que se haga dentro.

---

## Orden de trabajo propuesto

| # | Qué | Dónde | Esfuerzo |
|---|---|---|---|
| 1 | Enlazar a tuchat.org desde 2-3 dominios de la red | **fuera de este repo** | bajo |
| 2 | Quitar los 76 enlaces a 404 (`/tiempo`, `/loterias`) + test | `chat/[slug]/page.tsx` | bajo |
| 3 | Enlazar los 30 países en `/ranking` (20 huérfanas) | `ranking/page.tsx` | bajo |
| 4 | Backfill de `aboutTitle` en las 2.559 salas | script de contenido | medio |
| 5 | `/contacto` con contenido y H2 · 3 descriptions largas | varios | bajo |
| 6 | Decidir qué hacer con la escala de `/tiempo` | `next-sitemap.config.js` | decisión |

## Cómo repetir esta auditoría

```bash
npm run build
node scripts/content/auditar-html.mjs      # metadatos, H1, alt, JSON-LD (puerta de calidad)
npm run auditar                            # duplicados y plantilla en el contenido de origen
php scripts/diagnostico-indexacion.php 40  # estado real en Search Console
```

Lo que ninguno de los tres cubre todavía, y que ha destapado los puntos 2, 3 y 4 de este
informe: **el grafo de enlaces internos** (destinos a 404, páginas huérfanas), **los H2
repetidos a escala** y **el volumen de texto por sección**. Vale la pena incorporarlo a
`auditar-html.mjs`, que ya recorre el mismo HTML y no costaría una pasada extra.
