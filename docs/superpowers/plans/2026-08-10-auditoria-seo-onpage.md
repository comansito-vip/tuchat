# Auditoría SEO on-page — H1, H2, alt, enlaces e indexación

**Fecha:** 2026-08-10 · **Alcance:** las 4.991 páginas del build (`e0fefac`), más producción y
Search Console.
**Método:** build completo, `auditar-html.mjs`, `auditar-contenido.ts`, un auditor a escala
escrito para esta sesión (grafo de enlaces, H2 repetidos, volumen de texto), verificación con
`next start` de los códigos HTTP, y datos reales de la API de Search Console.

> **Estado: los seis puntos de la auditoría están aplicados.** Lo que sigue es el diagnóstico
> tal como se levantó; al final, en «Qué se hizo», está lo que se cambió en cada uno y con qué
> commit. Lo único que sigue pendiente no está en este repositorio: **nadie de la red enlaza a
> tuchat.org**, y sin eso lo demás rinde poco.

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

---

# Qué se hizo

Todo lo de la tabla salvo el punto 1, que está fuera de este repositorio.

## Los 76 enlaces a 404 → `roomServiceCards()` · `fc9ae27`

Las tarjetas de "Más sobre X" ya no se pintan a ojo: `roomServiceCards(place)` decide cuáles
puede ofrecer la sala consultando **el mismo predicado que usa `generateStaticParams` de cada
ruta** (`hasWeather(slug)` y `slug in LOTERIA_INFO`), no una lista paralela que se
desincronizaría a la primera tanda de salas nuevas.

El test recorre el catálogo entero, no una muestra, porque el fallo se repone solo: cada
localidad que publica el cron de goteo llega sin coordenadas.

## Las 20 huérfanas → `getRankedCountries()` · `fc9ae27`

`/ranking` pinta ahora un chip por cada uno de los 30 países que tienen página. La tabla
numérica sigue mostrando el top 10: lo que cambia es el enlazado, no el ranking.

## El H2 de las 2.561 salas · `scripts/content/backfill-about-titles.mjs`

De 2 salas con H2 propio a **2.561**. El resultado vive en `src/data/about-titles.ts` (un mapa
slug → título que `index.ts` aplica en `conAboutTitle`, y donde el título de la ficha siempre
gana), no repartido por los once ficheros de datos: así el backfill entero se lee de un vistazo
y se revierte borrando un fichero.

**El material de origen es el `about` que cada sala ya tenía escrito y verificado**, y nada
más. El modelo no puede introducir un dato que no estuviera ya en la página, que es el riesgo
habitual de estos backfills. Aun así se verifica sala a sala y de forma determinista: todo
nombre propio y toda cifra del título tienen que aparecer en el about, más las reglas de
`calidad.mjs` (25-70 caracteres, nada de encabezados genéricos ni cargos, sin muletillas) y dos
comprobaciones de escala —título ya usado y molde repetido más de diez veces—.

Resultado sobre los 2.559 generados:

| | |
|---|---:|
| Con algún dato no respaldado por el about | **0** |
| Títulos únicos | 2.559 / 2.559 |
| Molde más repetido | 1× |
| Longitud (mín / mediana / máx) | 25 / 38 / 70 |
| Rechazados por la verificación durante el proceso | ~1.100 |

Ese último número es la parte que importa: el verificador tumbó y reintentó más de mil títulos
antes de dar por bueno el que se publica.

Tres cosas que costaron una pasada entera cada una, anotadas por si el script se reutiliza:
`maxTokens: 1200` truncaba el JSON porque varios modelos de la cadena gastan tokens razonando;
el 429 masivo era límite **por minuto**, no cuota diaria, y se arregla esperando; y reintentar
sin decirle al modelo qué falló dejó 24 salas devolviendo el mismo título corto una y otra vez.

## `/contacto`, las descriptions y dos textos absurdos · `fc9ae27`, `59a8392`

`/contacto` pasa de 28 palabras sin ningún H2 a cuatro secciones con lo que hay que contar en
cada caso. `weatherMetaDescription()` elige la variante más completa que cabe en 170 caracteres
en vez de cortar la frase. Y al mirar el HTML a escala salieron dos textos que llevaban tiempo
publicados sin que nada los mirara:

- 14 ciudades servían «Administrativamente Buenos Aires está en Buenos Aires, dentro de Buenos
  Aires» y «Es una de las 1 localidades de Campeche con sala propia».
- En América la división administrativa suele llamarse como su capital, así que «Santiago de
  Cuba, en Provincia de Santiago de Cuba» era la única frase del párrafo en once salas, que
  compartían molde por eso.

## El `<title>` de las salas · `1f91950`

El `<title>` y el H1 eran el mismo texto en 2.940 páginas, con 21 caracteres de mediana sobre
los ~60 que muestra Google. La opción evidente —rotar el sufijo entre salas— la descarta el
corpus de la red (`/home/javier/red-seo`, 26 M de impresiones en consultas que empiezan por
"chat"):

| Forma de buscar una sala | Impresiones | % |
|---|---:|---:|
| «chat madrid» a secas | 12.841.393 | 87,4% |
| «chat madrid gratis» | 1.711.514 | 11,6% |
| «chat madrid online / en línea» | 83.145 | 0,6% |
| «chat madrid sin registro» | 49.323 | 0,3% |

Y de las 173 salas con demanda medible en formas con sufijo, **en 167 gana "gratis"**. Rotar
habría cambiado el 11,6% por el 0,3%. Así que `roomMetaTitle()` **añade** en vez de sustituir:

```
<title>  Chat Madrid gratis sin registro
H1       Chat Madrid gratis
```

Las tres salas donde el corpus da otro ganador llevan el suyo (`portugal`, `arg`, `nudismo` →
"online"; Portugal acumula 2.424 impresiones en "chat portugal online" frente a 490 en
"gratis"). El complemento se omite entero si no cabe en 60 y no se duplica en los hubs cuyo
título propio ya lo dice.

## `/tiempo` en el sitemap · `59a8392`

Baja a `priority 0.3`. Es la opción 2 de las tres que planteaba el diagnóstico: no quita
páginas —dan un servicio real y ya pasan el filtro de "solo donde hay datos"— pero deja dicho
que primero van las salas. Conviene no esperar mucho de este cambio: Google trata `priority`
como una pista débil.

## El auditor ya vigila lo que se le escapó · `59a8392`

`auditar-html.mjs` gana el grafo de enlaces internos (enlaces a páginas que no existen → ALTO,
huérfanas → MEDIO), H1 duplicados entre páginas y páginas sin ningún H2. Los tres fallos de
esta auditoría eran invisibles mirando una página aislada, que es como miraba todo lo demás.
Probado contra el build anterior: marcó los 76 + 24 exactos.

## Estado final

Medido sobre el build de las 4.991 páginas, con el auditor ya ampliado:

| Comprobación | Antes | Después |
|---|---|---|
| `auditar-html.mjs` | 76 ALTO · 24 MEDIO | **ninguna incidencia** |
| `npm run auditar` | 1 aviso | **0 avisos** |
| Tests | 409 | **425** |
| Salas con H2 propio | 2 / 2.561 | **2.561 / 2.561** |
| Enlaces internos a 404 | 76 | **0** |
| Páginas huérfanas | 20 | **0** |
| Páginas sin ningún H2 | 1 | **0** |
| `<title>` = H1 | 2.940 páginas | **0** |

Comprobado en el HTML servido, no solo en los datos:

```
/chat/madrid   <title>Chat Madrid gratis sin registro</title>
               <h1>Chat Madrid gratis</h1>
               <h2>Planes de fin de semana y Metro a las tantas</h2>

/chat/vigo     <h2>Empanadas de berberechos y Celta de Vigo</h2>
/chat/cocula   <h2>Cuna del mariachi y la música</h2>
```

Y cero ocurrencias de «Sobre el chat de» en las 2.561 páginas de sala.

**Lo que no ha cambiado es lo que más pesa:** tuchat.org sigue con 3 URLs indexadas de 4.997 y
ningún dominio de la red enlaza a él. Todo lo de arriba quita motivos para no indexar; no
sustituye al enlace que falta.

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
