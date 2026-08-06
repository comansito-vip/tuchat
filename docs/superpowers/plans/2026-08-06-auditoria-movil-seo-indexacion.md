# Auditoría de UX móvil, SEO, Search Console y calidad de contenido

**Fecha:** 2026-08-06 · **Alcance:** tuchat.org en detalle, los 17 dominios de la red en superficie.
**Método:** datos reales (Search Console API, URL Inspection, HTML servido en producción con
user-agent de iPhone), no lectura de código.

---

## Resumen

Lo técnico está bien y **el problema es de indexación, no de calidad**: de 4.954 URLs enviadas
en el sitemap, Google tiene indexado en torno al 12%, y casi la mitad de la muestra ni siquiera
ha sido descubierta. Donde sí entra, rankea muy alto (posiciones 3 a 6). No hay nada que
"arreglar" en el HTML: hay que hacer que Google quiera gastar rastreo en este dominio.

---

## 1. Search Console — la red

Ventana 2026-07-06 → 2026-08-03, comparada con los 28 días previos.

| Propiedad | Clics | Impresiones | Pos. media | vs. previo |
|---|---:|---:|---:|---:|
| sexofacil.org | 57.050 | 724.665 | 7,1 | +10% |
| chatzona.com | 21.360 | 2.336.705 | 8,1 | +133% |
| chatzona.net | 11.486 | 205.793 | 10,7 | **−23%** |
| elchatgay.net | 4.938 | 121.133 | 12,6 | +244% |
| portalchat.es | 4.816 | 123.696 | 19,1 | +5% |
| chatamigos.org | 3.303 | 93.159 | 18,5 | −10% |
| chatcamara.com | 717 | 13.583 | 26,4 | +172% |
| trivialchat.org | 472 | 16.013 | 21,1 | −10% |
| chatligar.net | 422 | 8.901 | 15,6 | nuevo |
| chatbarcelona.es | 122 | 9.089 | 17,4 | nuevo |
| tarotgratuito.net | 43 | 4.374 | 38,7 | +43% |
| estoeschat.com | 31 | 590 | 5,4 | nuevo |
| chatargentina.net | 18 | 460 | 59,1 | **−83%** |
| tuchat.org | 15 | 898 | 54,0 | +1400% |
| forochat.net | 7 | 61 | 24,2 | nuevo |
| chatlesbianas.net | 0 | 0 | — | — |
| sumisas.net | 0 | 0 | — | — |

Siguiendo el criterio de la red (las posiciones 11-20 son las accionables, de la 40 se sube con
trabajo de fondo), el orden de trabajo por rentabilidad es: **elchatgay.net (12,6)**,
**chatligar.net (15,6)**, **chatbarcelona.es (17,4)**, **chatamigos.org (18,5)** y
**portalchat.es (19,1)**. Son los cinco que tienen un salto al top 10 al alcance.

Dos caídas que merecen mirada aparte: chatzona.net (−23% sobre 11.486 clics es la pérdida
absoluta mayor de la red) y chatargentina.net (−83%).

## 2. Search Console — tuchat.org en detalle

**Sitemap:** enviado el 2026-07-24, procesado el 2026-08-03, **0 errores y 0 avisos**.
4.954 URLs enviadas.

**Indexación real** (URL Inspection sobre 34 URLs: las de cabecera más 20 tomadas del sitemap
a intervalos regulares):

| Estado | URLs | % |
|---|---:|---:|
| Enviada e indexada | 4 | 11,8% |
| Descubierta: actualmente sin indexar | 14 | 41,2% |
| Google no reconoce esta URL | 16 | 47,1% |

Ese 47% es lo llamativo: están en un sitemap que Google descarga sin errores, y aun así no las
ha visitado nunca. No es un fallo de configuración, es Google racionando rastreo en un dominio
de julio de 2026 con 4.954 URLs y sin autoridad todavía.

**Contraste:** las pocas páginas que sí entran rinden muy por encima de la media del sitio.

| Página | Clics | Impresiones | Posición |
|---|---:|---:|---:|
| `/` | 7 | 621 | 53,1 |
| `/chat` | 3 | 31 | **6,2** |
| `/chat/argentina` | 0 | 2 | **3,5** |
| `/chat/galicia` | 0 | 3 | **4,7** |
| `/anime` | 0 | 7 | 24,0 |

Solo cinco páginas de 4.954 acumulan impresiones. La calidad no es el cuello de botella: donde
Google entra, coloca la página entre los primeros resultados.

**Reparto por dispositivo:** móvil 336 impresiones con CTR 2,38% y posición 45,1; escritorio 301
con CTR 0,66% y posición 59,6. El móvil rinde mejor en ambas métricas, así que es la superficie
que hay que cuidar — y está cuidada (sección 3).

## 3. UX / UI móvil — sin incidencias

Verificado sobre el HTML realmente servido a un user-agent de iPhone 17.

- **Viewport:** `width=device-width, initial-scale=1, viewport-fit=cover`. El `viewport-fit=cover`
  es lo que activa las safe-areas del notch, y está.
- **Safe areas:** `env(safe-area-inset-*)` aplicado en los cinco sitios que lo necesitan — footer,
  `LayoutShell`, nav inferior, banner de cookies y la cabecera del webchat.
- **Tap targets:** `min-h-[44px]` en la nav inferior, `NickInput` y `SearchInput`, que es el mínimo
  de Apple. Único punto flojo: el input de `ChatSearch` se queda en ~40px.
- **Zoom de iOS:** los tres inputs públicos usan `text-base` (16px) en móvil con `sm:text-sm` para
  escritorio. Por debajo de 16px, Safari hace zoom al enfocar y no lo deshace; está resuelto.
- **Desbordes horizontales:** ninguno suelto. Los dos casos de scroll horizontal (carrusel de la
  home, tablas de ranking y resultados) están contenidos en su propio `overflow-x-auto`.
- **Imágenes:** con `loading="lazy"` y `width`/`height`, que es lo que evita saltos de layout.

**Peso real transferido** (Brotli vía Cloudflare, que es lo que llega al móvil):

| Página | Sin comprimir | Transferido | Tiempo |
|---|---:|---:|---:|
| `/chat/madrid` | 96 KB | 13 KB | 0,12 s |
| `/` | — | 27 KB | 0,12 s |
| `/chat` | — | 46 KB | 0,26 s |
| `/chat/espana` | 1,32 MB | **80 KB** | 0,18 s |

`/chat/espana` asusta en crudo (1,32 MB, 1.208 enlaces, 56% payload RSC) pero comprimido son
80 KB y responde en 0,18 s. No es un problema en producción.

**Recursos críticos:** 197 KB de JS en 10 ficheros + 12 KB de CSS = ~210 KB. Dentro de lo
razonable para Next.js.

> No se pudo obtener Lighthouse/Core Web Vitals de campo: la PageSpeed Insights API no está
> habilitada en ninguno de los proyectos de Google Cloud de las claves disponibles. Habilitarla
> permitiría medir LCP/CLS/INP reales sin depender de estimaciones.

## 4. SEO técnico — sin incidencias

Comprobado en `/chat/madrid`, `/chat/amor` y `/noticias`:

- `<link rel="canonical">` correcto y absoluto en las tres.
- Un solo `<h1>` por página, coherente con el `<title>`.
- Sin `noindex` accidental.
- Entre 10 y 12 bloques de JSON-LD por página: `BreadcrumbList`, `CollectionPage`, `FAQPage`,
  `ItemList`, `Organization`, `WebSite` con `SearchAction`, `ImageObject`.
- `robots.txt` correcto, con `/admin` y `/api` bloqueados.

Auditorías internas del proyecto (`npm run auditar` y `npm run auditar:html`): **0 avisos** sobre
4.948 páginas. Sin muletillas de IA, sin plantillas con hueco, sin títulos ni descripciones fuera
de rango, sin duplicados de apertura, enlazado interno íntegro.

## 5. Qué hacer

El diagnóstico manda: no hay bugs que arreglar, hay que ganar rastreo.

1. **Reducir el sitemap a lo que puede competir hoy.** 4.954 URLs en un dominio nuevo diluyen el
   presupuesto de rastreo entre miles de páginas que Google no va a visitar. Concentrarlo en las
   que ya demuestran tracción (hubs, capitales, temáticas con impresiones) y añadir el resto por
   tandas, a medida que entren.
2. **Enlazar desde donde ya hay autoridad.** `/chat` está en posición 6,2 y `/chat/argentina` en
   3,5: son las páginas que Google visita. Los enlaces a las salas que se quieran indexar deben
   salir de ahí, no de un índice profundo.
3. **Atacar primero los cinco dominios en posiciones 12-19**, donde el mismo esfuerzo entra en el
   top 10, en lugar de empujar tuchat desde la 54.
4. **Subir el input de `ChatSearch` a 44px** de alto (único hallazgo de UX móvil).
5. **Habilitar la PageSpeed Insights API** en un proyecto de Google Cloud para poder medir Core
   Web Vitals de campo en las próximas revisiones.

## Anexos: hallazgos fuera del encargo

- **sumisas.net no resuelve.** Dominio activo hasta 2027-07-17, zona creada en Cloudflare el
  2026-08-02 y activa, pero su DNS solo tiene el TXT de verificación de Google: **falta el
  registro A/CNAME**. `/home/javier/sumisas/` está vacío, así que tampoco hay proyecto detrás.
- **GitHub Actions bloqueadas por facturación** en los 14 repos privados: *"recent account
  payments have failed or your spending limit needs to be increased"*. Afecta a los generadores
  de contenido de Portalchat, Chatcámara y chatamigos, entre otros. tuchat es público y por eso
  sigue funcionando.
- Los otros 16 dominios responden 200 con tiempos de 0,3 a 0,8 s.
