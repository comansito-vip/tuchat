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

| # | Qué | Dónde | Severidad |
|---|---|---|---|
| 1 | `push` de los cinco commits ya hechos | — | bloquea todo lo demás |
| 2 | Reintento + concurrencia limitada en `fetchWeather` | `src/lib/weather.ts` | **ALTO** |
| 3 | Quitar el `BreadcrumbList` duplicado de `/como-funciona` | `app/como-funciona` | MEDIO |
| 4 | `rel="nofollow"` en la atribución a Open-Meteo | `WeatherWidget.tsx` | MEDIO |
| 5 | Enlazar a tuchat.org desde la red | **fuera de este repo** | sigue siendo lo de mayor retorno |

El punto 5 no ha cambiado desde el 6 de agosto: **3 URLs indexadas de 4.997 y ningún dominio de
la red enlaza a tuchat.org.**
