# Segunda pasada de auditoría SEO — lo que la primera no miró

**Fecha:** 2026-08-10 (después de aplicar [la primera auditoría](./2026-08-10-auditoria-seo-onpage.md))
**Método:** build de las 4.991 páginas, `auditar-html.mjs` (ya ampliado), inventario de JSON-LD y
Open Graph a escala, y **comprobaciones contra producción en vivo**, que es donde ha salido lo
importante.

---

## Por qué esta segunda pasada no repite la primera

Los auditores ya no encuentran nada: `auditar-html.mjs` da **ninguna incidencia** sobre las
4.991 páginas y `npm run auditar` **0 avisos**. Repetirlos habría dado un informe en blanco. Así
que esta pasada mira otros ejes: los datos estructurados uno por uno, Open Graph, `hreflang`, el
peso del HTML, los enlaces salientes, las secciones que la primera no abrió (tarot, anime,
horóscopo, deportes, loterías, ranking, cómo funciona) y, sobre todo, **lo que se está sirviendo
ahora mismo en tuchat.org**, no lo que produce el build.

Ahí ha aparecido el hallazgo de la sesión.

---

## 1. ~400 páginas de `/tiempo` prometen una previsión que no dan · **ALTO**

`/tiempo/abrego`, en vivo, ahora mismo:

```
<title>       Tiempo en Ábrego · TuChat
description   Previsión del tiempo en Ábrego: temperaturas, lluvia y viento para
              los próximos días. Consulta el forecast actualizado en TuChat.
<h1>          El tiempo en Ábrego
cuerpo        «Sin datos meteorológicos disponibles para Ábrego.»
```

Y está en el sitemap.

**Alcance medido:**

| | |
|---|---:|
| Páginas de `/tiempo` en el build | 1.965 |
| Prerenderizadas **sin previsión** | **1.332** (68%) |
| De una muestra de 20 de esas, sin previsión también en producción | **6 (30%)** |
| Estimación de páginas en vivo sin previsión | **~400** |

**Causa.** `generateStaticParams` filtra por `hasWeather(slug)`, que solo comprueba que la
localidad tenga coordenadas en `CITY_COORDS`. Publicada la página, el contenido depende de
`fetchWeather()`, y esa función **se rinde al primer fallo**:

```ts
const res = await fetch(url, { next: { revalidate: 3600 } });
if (!res.ok) return null;          // ← sin reintento
```

Durante el build se piden las 1.965 localidades con los cinco workers de Next. Comprobado hoy:
40 peticiones seguidas a Open-Meteo responden 200, así que la API no está caída — es el volumen
del build el que la hace fallar. Cada fallo publica una landing vacía. El ISR las va rellenando
cuando alguien las visita, y por eso en producción "solo" queda el 30%: son las que nadie ha
pisado todavía. Googlebot, en una página fría, ve la versión vacía.

Esto es exactamente lo que el comentario de `tiempo/[ciudad]/page.tsx` dice querer evitar:

> *Publicar una landing titulada "Previsión del tiempo en X" que por dentro dice "sin datos
> disponibles" es contenido fino: promete un servicio que no presta, y en volumen (eran 1.970
> páginas) arrastra la calidad de todo el dominio.*

El filtro se puso, pero mira el dato equivocado: comprueba que **se puede** pedir la previsión,
no que se **haya obtenido**.

**Arreglo propuesto**, por orden:

1. **Reintentar en `fetchWeather`** ante 429/5xx con una espera corta. Es el arreglo real: el
   build deja de publicar vacías por prisa. (Mismo patrón que resolvió el backfill de H2, donde
   el 429 masivo también parecía cuota agotada y era ritmo.)
2. **Limitar la concurrencia del fetch durante el build** (una cola sencilla), que es la causa
   de fondo.
3. Si aun así una localidad no responde, **no publicar esa página** en vez de publicarla vacía
   — coherente con la decisión ya tomada para las que no tienen coordenadas.

## 2. `/como-funciona` emite dos `BreadcrumbList` idénticos · **MEDIO**

```
"@type":"BreadcrumbList" … "Inicio" → "Cómo funciona"
"@type":"BreadcrumbList" … "Inicio" → "Cómo funciona"     ← el mismo, repetido
```

Es la única página del sitio con datos estructurados duplicados, y la causa está localizada
(`src/app/como-funciona/page.tsx:66-68`):

```tsx
<JsonLd data={breadcrumbJsonLd(crumbs)} />   // ← emite el schema a mano
<JsonLd data={faqJsonLd(FAQ)} />
<Breadcrumbs crumbs={crumbs} />               // ← y este ya lo emite por dentro
```

`Breadcrumbs` incluye su propio `<JsonLd>` desde que se creó, así que la línea 66 sobra. Es la
única página que lo hace a mano; el resto confía en el componente. Google suele quedarse con el
primero, pero es un descuido de una línea.

## 3. 1.332 enlaces externos *dofollow* a open-meteo.com · **MEDIO**

Todos los enlaces externos del sitio van a un solo dominio, y **ninguno lleva `rel="nofollow"`**:

```
1332  open-meteo.com     (0 con nofollow)
```

No es casualidad que el número coincida con el del punto 1: ese enlace **solo aparece en el
estado "sin datos"** (`WeatherWidget.tsx:25`). Es decir, cada página rota regala además un
enlace saliente. Arreglando el punto 1 desaparece casi entero; la atribución que quede conviene
que sea `rel="nofollow noopener"`.

## 4. Producción va cinco commits por detrás · **INFO, pero condiciona todo**

Nada de lo arreglado hoy está desplegado. Comprobado en vivo:

```
/chat/madrid      <title>Chat Madrid gratis</title>      ← título anterior
/tiempo/petrer    404                                    ← sigue enlazado desde /chat/petrer
```

Los 76 enlaces a 404, las 20 huérfanas, los 2.561 H2 nuevos y los titles ampliados están en
`main` local, sin `push`. Mientras no se suba, la auditoría de producción seguirá dando los
fallos de la primera pasada.

---

## Lo que se comprobó y está bien

No todo hallazgo es un fallo; esto queda descartado con medición:

| Eje | Resultado |
|---|---|
| Open Graph (`og:title`, `og:url`, `og:image`) | completo en las 4.987 páginas reales; solo faltan en los stubs que no se sirven |
| `twitter:card` | en todas |
| `<html lang="es">` | correcto |
| `hreflang` | ausente, y **es lo correcto**: un solo idioma y ninguna variante por país que declarar |
| Tipos de JSON-LD | `WebSite` + `Organization` en todas, `BreadcrumbList` en 4.988, `FAQPage` 4.617, `CollectionPage` 4.615, `NewsArticle` 366, `ItemList` 137 |
| Combinaciones por sección | coherentes; ninguna sección se queda sin sus datos estructurados |
| Secciones no auditadas antes | `/anime`, `/tarot`, `/deportes`, `/horoscopo`, `/loterias`, `/ranking`, `/como-funciona`: un solo H1, H2 propios, 467-760 palabras |
| Enlaces externos | uno solo (open-meteo), sin fugas a terceros |
| `llms.txt` y `llms-full.txt` | presentes |
| Clave de IndexNow | presente en `public/` |

**Peso del HTML** (importa para el rastreo, no hay nada roto):

| Sección | Páginas | Medio | Mayor |
|---|---:|---:|---|
| `/chat` | 2.562 | 98 KB | **1.322 KB** (`/chat/espana`) |
| `/tiempo` | 1.966 | 50 KB | 613 KB (`/tiempo`) |
| home | 1 | 389 KB | — |
| `/noticias` | 376 | 61 KB | 267 KB |

`/chat/espana` lista las 893 ciudades y `/tiempo` las 1.966: son índices legítimos, pero 1,3 MB
es mucho para una página y conviene tenerlo en el radar si esas ciudades tardan en entrar al
índice.

---

## Orden de trabajo

| # | Qué | Dónde | Severidad | Estado |
|---|---|---|---|---|
| 1 | `push` de los commits | — | bloquea lo demás | **pendiente** |
| 2 | Reintento + ritmo limitado en `fetchWeather` | `src/lib/weather.ts` | ALTO | hecho |
| 3 | Quitar el `BreadcrumbList` duplicado | `app/como-funciona` | MEDIO | hecho |
| 4 | `rel="nofollow"` en la atribución a Open-Meteo | `WeatherWidget.tsx` | MEDIO | hecho |
| 5 | Enlazar a tuchat.org desde la red | **fuera de este repo** | mayor retorno | pendiente |

El punto 5 no ha cambiado desde el 6 de agosto: **3 URLs indexadas de 4.997 y ningún dominio de
la red enlaza a tuchat.org.**

---

# Qué se hizo (2026-08-11)

## Las páginas de `/tiempo`: de 1.332 vacías a 0

Hicieron falta tres arreglos, y el orden en que se descartaron importa porque el primero parecía
suficiente y no lo era:

1. **Reintento ante 429/5xx y errores de red** (`pedirConReintento`). Bajó de **1.332 a 467**.
   Un 4xx que no sea 429 no se reintenta: la petición está mal formada y repetirla gasta build.
2. **Ritmo limitado** (`MIN_MS_ENTRE_PETICIONES = 700`). Reintentar no bastaba porque el problema
   no era una petición que falla, sino todas lanzadas a la vez: con la API sana —60 peticiones
   seguidas dan 200, y las ciudades que fallaban responden bien de una en una— lo que sobraba era
   ritmo. La espera se calcula sobre la última petición hecha, así que una visita aislada en
   producción no espera nada.
3. **Memoización por slug**. `tiempo/[ciudad]` pide la previsión dos veces —`generateMetadata` y
   el cuerpo—; Next deduplica el fetch, pero el turno del limitador se consumía igual y cada
   página gastaba dos huecos de 700 ms. El build se iba de 13 minutos sin terminar.

Resultado del build completo:

```
1.965 páginas de /tiempo · 0 sin previsión · 773 s
```

**Coste a tener en cuenta:** el build pasa a ~13 minutos por el limitador. Es un cron nocturno en
el VPS, así que el cambio se paga solo, pero conviene saberlo antes de tocar
`MIN_MS_ENTRE_PETICIONES` a la baja.

## Los otros dos

- `/como-funciona` emitía su `BreadcrumbList` a mano además del que ya pinta `<Breadcrumbs>`.
  Ahora hay **uno**.
- La atribución a Open-Meteo lleva `rel="nofollow noopener noreferrer"`. Enlaces externos
  dofollow del sitio: **0** (eran 1.332, casi todos por las páginas rotas del punto anterior).

## Y el auditor aprende a verlo

`auditar-html.mjs` marca ahora el mismo bloque de JSON-LD repetido dentro de una página. Los
tipos que legítimamente aparecen varias veces (`ItemList`, uno por listado) se comparan por su
JSON completo, así que solo salta cuando el bloque es literalmente idéntico.

## Estado final verificado

| | |
|---|---|
| `auditar-html.mjs` (4.991 páginas) | **ninguna incidencia** |
| `npm run auditar` | 0 avisos |
| Tests | **431** |
| `tsc` / `eslint` | limpios |
| Páginas de `/tiempo` sin previsión | **0 de 1.965** |
| Enlaces externos dofollow | **0** |
| `BreadcrumbList` en `/como-funciona` | 1 |
| Referencias a `nip.io`, `localhost`, IPs o dominios de dev | **0** en código, HTML, sitemap, robots.txt e historial de git |
