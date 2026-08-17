# El problema no es el contenido: Google no rastrea el sitio

**Fecha:** 17 de agosto de 2026
**Datos:** Search Console por API, ventana 2026-07-18 → 2026-08-14 (los datos llevan 2-3 días de retraso)

## El dato

```
TOTAL: 14 clics · 1.047 impresiones · posición media 53,5
```

De **5.261 URLs en el sitemap, solo 5 reciben alguna impresión**, y la home se lleva
el 98 %:

| Página | Impresiones | Clics | Posición |
|---|---:|---:|---:|
| `/` | 1.023 | 11 | 54,4 |
| `/chat` | 27 | 3 | 5,6 |
| `/anime` | 11 | 0 | 27,3 |
| `/chat/galicia` | 4 | 1 | 4,2 |
| `/chat/argentina` | 2 | 0 | 3,5 |

Fíjate en la columna de posición: **cuando una sala aparece, aparece arriba**
(`/chat/galicia` en 4,2; `/chat/argentina` en 3,5; `/chat` en 5,6). El contenido no es
el problema. El problema es que casi ninguna página llega a competir.

## La causa, confirmada con la API de inspección

| URL | Veredicto | Cobertura | Último rastreo |
|---|---|---|---|
| `/` | PASS | Enviada e indexada | 2026-08-15 |
| `/chat` | PASS | Enviada e indexada | 2026-07-26 |
| `/anime` | PASS | Enviada e indexada | 2026-08-01 |
| `/ranking` | PASS | Enviada e indexada | 2026-08-15 |
| `/chat/madrid` | NEUTRAL | Descubierta: sin indexar | **nunca** |
| `/chat/barcelona` | NEUTRAL | Descubierta: sin indexar | **nunca** |
| `/chat/gay-madrid` | NEUTRAL | Descubierta: sin indexar | **nunca** |
| `/chat/amistad` | NEUTRAL | Descubierta: sin indexar | **nunca** |
| `/noticias` | NEUTRAL | Descubierta: sin indexar | **nunca** |
| `/tiempo/madrid` | NEUTRAL | Descubierta: sin indexar | **nunca** |

**Cuatro páginas indexadas de 5.261.** El resto Google las conoce —están en el sitemap y
las ha «descubierto»— pero **no las ha rastreado ni una sola vez**. No es un problema de
calidad del texto, ni de metadatos, ni de canonical: es presupuesto de rastreo. El dominio
es nuevo y Google le concede muy poco.

## Lo que ya está descartado

- **No es técnico.** TTFB de 0,18–0,31 s desde fuera, todas las URLs a 200, sin errores de
  consola, sin desbordes, `robots.txt` permite todo salvo `/admin` y `/api`, el canonical
  y el `og:url` van con www, y `/webchat` es rastreable para que su `noindex` cuente.
- **No es el sitemap.** Las URLs comprobadas están todas dentro, y el índice y los dos
  shards responden 200.
- **No es contenido plantillado.** `npm run auditar` está a cero avisos: sin muletillas de
  IA, sin aperturas repetidas, sin moldes por encima del umbral, títulos y descripciones
  únicos y dentro de límite.
- **No es IndexNow.** Se envía en cada deploy, pero IndexNow lo consumen Bing y Yandex;
  Google no participa.

## La composición del sitemap, que sí es decisión nuestra

| Sección | URLs | % |
|---|---:|---:|
| `/chat/*` (salas) | 2.721 | 52 % |
| `/tiempo/*` | 1.966 | **37 %** |
| `/noticias/*` | 481 | 9 % |
| resto | 93 | 2 % |

Mientras Google conceda cuatro rastreos, el 37 % del sitemap son páginas de tiempo con una
mediana de 174 palabras frente a las 645 de una sala. `priority: 0.3` ya está puesto, pero
Google ignora `priority` en la práctica.

**Recomendación (no aplicada, es decisión del cliente):** sacar `/tiempo/*` del sitemap
durante unos meses. Las páginas siguen vivas y accesibles; solo dejan de pedir rastreo.
Es la única palanca de peso que queda sin tocar el enlazado interno.

## Lo accionable a corto plazo

Una sola consulta está en la franja 11-20, que es de donde se sube con un empujón:

| Consulta | Impresiones | Posición |
|---|---:|---:|
| `chat gratis org` | 49 | 12,8 |

El resto vive por debajo de la 50. Con cuatro páginas indexadas no hay más margen: **la
prioridad no es optimizar páginas, es conseguir que las rastreen.**

## Qué NO hay que concluir de aquí

Que las salas estén sin indexar no significa que sobren ni que haya que podarlas. Cuando
una entra, entra arriba —Galicia en 4,2, Argentina en 3,5—. El trabajo es de rastreo.
