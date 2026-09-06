# Revisión SEO / GEO / UX móvil — tuchat.org (2026-09-06)

Encargo: repasar la home y el sitio "como SEO manager" con Search Console,
keyword research externo y medición móvil real, y corregir lo que se pudiera
corregir en la misma pasada. Fuentes: API de Search Console
(`sc-domain:tuchat.org`, 90/28/7 días, lag de 3 días), corpus de demanda de la
red (`/home/javier/red-seo`), PageSpeed Insights móvil con API key, HTML en
producción descargado con `curl`, SERPs reales de Google para los términos
cabecera, y el estado del VPS por SSH (solo lectura).

## 1. Qué se ha corregido en esta pasada (todo commiteado)

| # | Hallazgo (con dato) | Corrección |
|---|---|---|
| 1 | `gtag.js` (152 KB) era el script que más hilo principal comía en móvil: 296 ms en la home, 732 ms en `/chat`, cargado `afterInteractive`. TBT de la home 570 ms (score 0,52), de `/chat` 1.440 ms (0,15). | Cargado con `strategy="lazyOnload"` en `layout.tsx`: sale de la ventana que mide TBT/INP sin perder la página vista. |
| 2 | Único fallo SEO de Lighthouse en todas las URLs medidas (score 0,92): el enlace "Más información" del banner de cookies, sin texto descriptivo. | Texto cambiado a "Más información sobre cookies". Score SEO esperado: 1,0 en todo el sitio. |
| 3 | El enlace **"Países"** de las tres navegaciones (escritorio, menú móvil y barra inferior) apuntaba a `/chat/espana`: cada página del sitio pasaba ese ancla a la sala de España, y quien buscaba México o Argentina aterrizaba en España. | Apunta a `/chat#paises`; la sección "Países y ciudades" de `/chat` lleva ahora ese `id` (con `scroll-mt-20` para que la cabecera fija no lo tape). |
| 4 | Las FAQ de la home y de `/chat` (y su `FAQPage` JSON-LD) decían **"más de 2.500 salas"** y **"casi 2.000 ciudades"** con 2.831 salas y 2.156 ciudades reales; `llms.txt` daba a su vez otras cifras. Un sitio que se queda corto sobre su propio tamaño delante de Google y de los motores de respuesta. | Las cifras se calculan del catálogo en cada render (redondeo a la centena inferior: "más de 2.800 salas", "más de 2.100 ciudades", "30 países"). Se actualizan solas con el goteo diario. |
| 5 | `llms.txt` llevaba semanas diciendo **"3300 páginas en el sitemap"** con 3.581 URLs reales: el patrón de sustitución del generador exigía una tilde `~` que la primera pasada ya había borrado, así que la cifra quedó congelada. | Patrón corregido (`~?`) en `generar-llms-full.ts`. Se refresca solo en el próximo build del VPS (el `postbuild` regenera sitemap y luego llms.txt). |
| 6 | En la home, las 4 salas de "Salas más activas" volvían a salir en la fila siguiente, "Todas las salas" (12 tarjetas que incluían esas 4). En móvil: ocho tarjetas para ver cuatro salas, y una cabecera que decía "todas" con 12 de 2.831. | La segunda fila excluye las cuatro de arriba y pasa a llamarse "Más salas con gente". |
| 7 | La noticia destacada de la home mostraba un **bloque gris vacío 16:9** con solo la categoría dentro ("Subtle image placeholder"), cuando la misma noticia abre `/noticias` con su foto propia. | Se pinta la foto propia (`/img/noticias/...`), lazy, `alt` = titular, con la categoría superpuesta como en `/noticias`. |

**Segunda tanda, a petición del cliente ("haz lo de /chat, mejora todos los alt")**

| # | Hallazgo | Corrección |
|---|---|---|
| 8 | `/chat` pesaba 861 KB con 979 enlaces (645 eran chips de temáticas) y tardaba 5,7 s en ser interactiva en móvil. | Las temáticas agrupadas salen a **`/chat/temas`** (página propia: title, H1, breadcrumbs, FAQ, JSON-LD, prioridad 0,8 en el sitemap, citada en `llms.txt`). En `/chat` queda un chip por categoría con su recuento (56 chips) enlazando al bloque correspondiente. La lógica de agrupado vive en `src/lib/topic-groups.ts`, compartida por las dos páginas y con tests propios (ninguna temática se pierde ni se repite). Medido en `next dev`: **458 enlaces (−53 %) y 215 KB de marcado sin scripts (antes ~380 KB)**; el peso final en producción se remide tras el deploy. |
| 9 | Banderas con `alt=""` en todo el sitio (163 en la home, 226 en `/chat`, 7 de 8 en cada sala) y escudos de equipo sin `alt` en `/deportes`. | Todas las banderas llevan ahora `alt="Bandera de {país/comunidad}"` (RoomCard, CityList, RankingTable, Sidebar, CountryGrid, RelatedRooms, hero de sala, tarjetas de país y región de `/chat`) y los escudos `alt="Escudo del {equipo}"`. En `CityList` el enlace lleva siempre `aria-label` con el nombre de la ciudad para que el nombre accesible no sea "Bandera de Comunidad de Madrid Madrid". **0 imágenes con alt vacío** en home, `/chat`, `/chat/temas`, `/chat/madrid` y `/deportes`. |

Verificación de la segunda tanda: `tsc` y `eslint` limpios, **535 tests en verde
(47 ficheros)**, HTML renderizado con `next dev` en el puerto 3118. Desplegado
a mano con `deploy-tuchat.sh` (deploy OK 07:32 UTC, `47d97d9`), caché de
Cloudflare purgada, y **remedido en producción con PSI móvil**:

| URL | Perf. antes → después | TBT antes → después | Hilo principal | SEO | A11y | Enlaces | alt vacíos |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 0,84 → **0,97** | 570 ms → **150 ms** | 3,4 s → 1,5 s | 1,0 | 1,0 | 301 | 159 → **0** |
| `/chat` | 0,72 → **0,97** | 1.440 ms → **130 ms** | 6,9 s → 1,9 s | 1,0 | 0,97* | 979 → **459** | 226 → **0** |
| `/chat/temas` (nueva) | — → **0,97** | — → **110 ms** | 1,5 s | 1,0 | 1,0 | 650 | 0 |

\* un aviso `link-in-text-block` (enlace en párrafo distinguible solo por
color) en la línea "También por su otro nombre"; corregido con subrayado
permanente en la tercera tanda (`061dc28`, desplegada 07:41 UTC): `/chat`
remedido después da **Perf. 0,95 · A11y 1,0 · SEO 1,0**, TBT 230 ms, LCP 1,7 s. `llms.txt` en producción dice ya "3591
páginas en el sitemap" y `/chat/temas` está en el sitemap.

Verificación de la primera: `tsc` limpio, `eslint` limpio en los ficheros tocados, **532 tests
en verde (46 ficheros)**, y HTML comprobado con `next dev` en el puerto 3117:
cabeceras nuevas, FAQ con "2.800"/"2.100", los tres enlaces a `/chat#paises`,
`id="paises"` presente en `/chat`, foto de la noticia con `alt`, un solo
`gtag/js`. Sale a producción con el deploy automático de las 05:30 UTC.

**Cuarta tanda ("lo del título y demás, arreglado también")**

| # | Hallazgo | Corrección |
|---|---|---|
| 10 | Cron `generar-terminos-tuchat.sh` redundante y saltándose a diario. | Retirado del crontab del VPS por SSH, con copia previa en `/home/ubuntu/crontab.bak.2026-09-06`. Quedan los cuatro crons de tuchat: noticias 05:00, deploy 05:30, salas 01:30 y rehacer 02:30 UTC. |
| 11 | Title y description de la home heredados: el único title del top 10 sin "sin registro" ni "en español", y una description que hablaba de "registrar tu nick" en un sitio cuya promesa es no registrarse. | Title: **"Chat gratis en español sin registro · Chatear y hacer amigos"** (60 car.). Description: "Chat gratis en español sin registro: elige un nick y entra. Salas por países, ciudades y temáticas para chatear, hacer amigos y ligar, con Latinchat incluido." (158 car.). Se conservan "amigos" y "Latinchat", los términos con tracción real en GSC. |
| 12 | Todos los contadores ("9.062 usuarios conectados", "1.240 online", "N hablando ahora" en cada sala) eran sumas de un campo escrito a mano. | **Medida real de la red IRC**: `scripts/irc-muestra.mjs` se conecta a `irc.chatzona.org`, pide LIST y LUSERS y guarda usuarios por canal y totales en `data/irc-muestra.json` (portado del cron de canales de estoeschat, que ya sortea el antibot de la red). El cron de salas del VPS lo lanza cada noche antes de commitear. `src/lib/irc-muestra.ts` resuelve los conectados de cada sala por su primer canal propio (el de red, #chatzona, solo si es el único) y la web enseña la cifra **con su hora** ("234 en el canal a las 21:26", "6.477 conectados a las 21:26"); si un canal no está en la muestra, no se inventa nada ("Canal compartido con su zona"). El campo `users` queda solo como peso editorial de ordenación. Primera muestra: 6.477 usuarios en la red, 532 canales, #amistad 1.102, #mexico 818, #madrid 234. Si la muestra no es del día, la web lo dice ("el 6 sep a las 21:26") en vez de fingir que es de hoy. A las 19:39 UTC la red rechazaba la IP del VPS (G-line "VPN"); a las 20:11 UTC ya conectaba (547 canales, 6.925 usuarios), así que el cron de salas toma la muestra cada noche sin más. |

## 2. Search Console — estado hoy (2026-06-05 → 2026-09-03)

| Ventana | Impresiones | Clics | Posición media |
|---|---:|---:|---:|
| 90 días | 2.421 | 42 | 54,5 |
| 28 días | 1.403 | 22 | 54,4 |
| 7 días | 363 | 8 | 53,0 |

La tendencia sigue al alza (el 28d actual equivale a 1.400 vs 757 del 28d
anterior medido el día 2). Móvil manda: 1.307 impresiones móviles frente a
1.066 escritorio, y la posición móvil es mejor (51,8 vs 59,8) — todo lo de
esta pasada está medido y corregido en móvil por eso.

**La home concentra el 88 % de las impresiones** (2.119 de 2.421). Páginas con
señal propia: `/chat` (62 impr., pos 5,6), `/chat/republica-dominicana` (15,
pos 11,2), `/anime` (13, pos 24), `/chat/amigos` (11, pos 5,3), `/ranking`
(4, pos 5,8). Apex `https://tuchat.org/` acumuló 251 impresiones en 90d y **0
en los últimos 28**: la redirección 301 a `www` ya se ha consolidado.

Consultas de la home (90d, las que importan):

| Consulta | Impr. | Pos. | Comentario |
|---|---:|---:|---|
| chat gratis org | 55 | 14,5 | Único término en 11-20. Es la marca ".org" del dominio. |
| chat gratis | 42 | 66,2 | 2,78 M impresiones de red en este término. |
| chat en linea gratis | 38 | 63,0 | Cubierto en FAQ desde agosto; sigue lejos. |
| chat online gratis | 38 | 71,3 | |
| chat gratis en español | 26 | 78,8 | Título de página en la SERP: todos los rivales llevan "sin registro". |
| chat español | 17 | 54,8 | |
| chatear en español | 14 | 65,7 | |
| chat org sevilla | 5 | 6,8 | Patrón "org" + ciudad ya en top 10. |

Lectura: no hay ninguna consulta accionable "a un empujón" salvo las del
patrón "org", y esas no tienen landing que reforzar (las imprime la home).
Lo demás está en 55-80: distancia de autoridad, no de on-page.

## 3. Keyword research externo (SERPs reales, hoy)

Se han mirado las SERPs de "chat gratis en español sin registro", "salas de
chat gratis", "chatear gratis" y "chat online gratis en español". Los diez
primeros son siempre los mismos: chatsfriends, chatzona (.com y .org),
chathispano, terrachat, chateagratis, chatealo, chatea-chat, chateamos,
dalechatea, canalchat, gentechat, salasdechatgratis. **Cuatro de ellos son
de la red** (chatzona.com, chatzona.org, canalchat, portalchat según término).

Patrón de título que domina esas SERPs: `Chat gratis [en español] sin registro
· Chatear …`. Todos incluyen "gratis"; casi todos "sin registro"; varios
"chatear". El título de la home de tuchat.org es **"Chat gratis de amigos,
chatear en España y Latinchat"** — no lleva "sin registro" ni "en español", y
es el único de la SERP con esa forma. Está así **por decisión explícita del
cliente** (comentario en `layout.tsx`: mantener el indexado histórico), así
que no se ha tocado. Es, con diferencia, la palanca on-page más grande que
queda en la home, y es una decisión suya, no técnica: si se quiere abrir,
la forma coherente con la SERP sería algo como "Chat gratis en español sin
registro · Chatear y hacer amigos" (54 caracteres). El `H1` ("Chat gratis en
español") y la meta description (también fijada por el cliente) se quedan
igual.

Corpus de la red para las cabeceras que imprime la home (90d, 18
propiedades): "chat gratis" 2,78 M impr. pos 6,5 · "chatear gratis" 484 K
pos 5,2 · "latinchat" 241 K pos 4,5 · "chat online" 164 K pos 8,2 · "salas de
chat" 127 K pos 4,2 · "chat sin registro" 103 K pos 6,5 · "chat en linea"
70 K pos 4,3 · "chat español" 34 K pos 5,4. tuchat.org no aparece en ninguno
de ellos entre los dominios de la red que sí imprimen — misma conclusión que
el 1 y el 3 de septiembre: el catálogo está completo, falta autoridad.

## 4. Auditoría técnica y móvil (PSI móvil, 2026-09-06)

| URL | Perf. | SEO | A11y | LCP | TBT | TTI | HTML | Enlaces |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 0,84 | 0,92 → 1,0* | 1,0 | 2,3 s | 570 ms | 3,9 s | 392 KB (214 KB es payload RSC) | 309 |
| `/chat` | 0,72 | 0,92 → 1,0* | — | 2,0 s | 1.440 ms | 5,7 s | **861 KB** (478 KB RSC) | **979** |
| `/chat/madrid` | PSI devolvió error dos veces ("Something went wrong"); medido el día 2: LCP 1,8-2,1 s, score 0,99 | | | | | | 97 KB | |

\* tras la corrección del enlace del banner. Sin datos de campo (CrUX) en
ninguna URL: el origen no tiene tráfico suficiente, todo es laboratorio.

CLS 0 en todas. Sin datos de campo. `robots.txt`, sitemap índice (3.581 URLs),
`llms.txt` + `llms-full.txt` (2,57 MB), `opengraph-image` (200, 100 KB),
`icon.svg`, `site.webmanifest`, 404 con código 404, `/chat/` → 308 a sin
barra, apex y `http://` → 301 a `https://www.`: todo correcto. Cabeceras de
seguridad completas (HSTS, nosniff, frame-options, referrer, permissions).

**Lo que no se ha corregido y por qué:**

- ~~`/chat` pesa 861 KB~~ y ~~`alt=""` en las banderas~~: corregidos en la
  segunda tanda (filas 8 y 9 de la sección 1).
- ~~"9.062 usuarios conectados" / "1.240 online"~~: corregido en la cuarta
  tanda (sección 1b): ahora son medidas reales de la red IRC.
- **`info@chatzona.org`** como contacto en `/contacto`, en la FAQ de `/chat`
  y en el `Organization` JSON-LD. Es el correo real del operador, así que no
  se toca; pero es la única mención explícita de otro dominio de la red en
  tuchat.org, y el JSON-LD la sirve en todas las páginas. Si algún día se
  quiere que los dominios parezcan operaciones separadas, este es el primer
  sitio.

## 5. GEO (visibilidad en motores de respuesta)

Lo que ya está bien: `llms.txt` como índice y `llms-full.txt` con las 2.831
fichas en texto plano; `robots.txt` abierto explícitamente a GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot,
Google-Extended y CCBot; JSON-LD por tipo de página (`WebSite`+`SearchAction`,
`Organization`, `FAQPage`, `CollectionPage`, `ItemList`, `BreadcrumbList`,
`NewsArticle` con `wordCount`, `image` propia a 1600 px, `datePublished`,
`author`/`publisher`); `lang="es"`; canónicos correctos; definición clara de
qué es el sitio en el primer párrafo de la home. Con esta pasada, además, las
cifras que un modelo lee en la FAQ, en el JSON-LD y en `llms.txt` son por fin
las mismas.

Nada más que añadir aquí que no sea autoridad: los motores de respuesta citan
lo que Google ya rankea.

## 6. VPS — estado real hoy (comprobado por SSH, solo lectura)

- **El rebase roto ya no existe**: `.git/rebase-merge` ha desaparecido,
  `HEAD` = `origin/main` = `d8e8c8b` (noticias del 2026-09-05), árbol limpio
  salvo el `llms.txt` que regenera el propio build. Los crons han publicado
  con normalidad los días 4 y 5 (`publicado ✓` en salas 02:23, rehacer 03:15
  y noticias 05:41 del día 5). **El pendiente crítico #1 está resuelto.**
- **`generar-terminos-tuchat.sh` sigue saltándose cada día** ("pipeline
  ocupado; se salta" el 2, 3, 4 y 5 de septiembre a las 03:15 UTC): choca
  con el lock de `generar-salas-rehacer` (03:15 del día 5). Como
  `generar-salas-tuchat.sh` ya genera las tres salas de término en su pasada,
  este cron es redundante y nunca ha llegado a ejecutarse. **Se intentó
  retirarlo por SSH y el entorno bloqueó la edición del crontab** (cambio de
  estado en producción). Queda para ejecutar a mano en el VPS, con copia
  previa:

  ```bash
  crontab -l > /home/ubuntu/crontab.bak.2026-09-06
  crontab -l | grep -v 'generar-terminos-tuchat' | grep -v 'salas de término' | crontab -
  ```
- El servidor va **muy cargado durante los crons**: los logs registran CPU
  98-99 % y RAM 93-98 % en las pasadas de noticias y deploy. No se ha lanzado
  ningún deploy manual por eso: el de las 05:30 UTC publicará esta pasada.

## 7. Pendientes, ordenados

1. **Decisión del cliente**: título de la home sin "sin registro" ni "en
   español" cuando los 10 primeros de la SERP lo llevan (sección 3).
2. Retirar el cron `generar-terminos-tuchat.sh` a mano en el VPS (comando en
   la sección 6): redundante y lleva cuatro días sin ejecutarse por el lock.
3. Contadores de usuarios "en vivo" que no lo son (sección 4): decidir si se
   conectan al IRC real o se reformulan.
4. Remedida de GSC: 2026-09-20/25, como estaba. Revisar entonces si el
   patrón "org" (pos 14,5) ha entrado en top 10 y si `/chat` (pos 5,6) gana
   impresiones tras el enlace "Países".
