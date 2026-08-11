# Search Console, con los números delante

**Fecha:** 2026-08-12 (datos hasta el 8 de agosto: la API va 2-3 días por detrás)
**Cómo reproducirlo:** cliente `chatargentina/includes/gsc.php`, definiendo `CONFIG` y
`CACHE_DIR` antes del `require`. Ojo con las `siteUrl`: varias propiedades son
`sc-domain:dominio.net` y no `https://www.dominio.net/`, y pedirlas mal devuelve
«ninguna cuenta configurada ve la propiedad», que parece un problema de permisos y no lo es.

---

## tuchat.org: el contenido no es el cuello de botella

Últimos 30 días:

| | |
|---|---:|
| Impresiones | **674** |
| Clics | **1** |
| Consultas con datos | 342 |
| **Páginas con alguna impresión** | **5** |

Cinco. El sitio tiene 5.148 páginas publicadas y solo cinco han aparecido alguna vez en
un resultado: `/`, `/chat`, `/anime`, `/chat/galicia` y `/chat/argentina`.

Lo interesante es **cómo posicionan las que sí entran**:

| Página | Impresiones | Posición media |
|---|---:|---:|
| `/` | 838 | 53,2 |
| `/chat` | 31 | **6,2** |
| `/chat/galicia` | 3 | **4,7** |
| `/chat/argentina` | 2 | **3,5** |

Y por consulta: «chat org sevilla» posición 6,8; «salas de chat org» 7,7; «chat gratis
org» 11,4. Cuando Google decide mostrar una página de este sitio, la coloca arriba. El
problema no es que las páginas sean malas: es que no las rastrea.

La inspección de URL lo confirma sin ambigüedad:

| URL | Estado | Último rastreo |
|---|---|---|
| `/` | Enviada e indexada | 2026-08-09 |
| `/chat` | Enviada e indexada | 2026-07-26 |
| `/chat/galicia` | Enviada e indexada | 2026-07-15 |
| `/chat/madrid` | **Google no reconoce esta URL** | nunca |
| `/chat/mexico` | **Google no reconoce esta URL** | nunca |
| `/chat/jalisco` | **Google no reconoce esta URL** | nunca |

## La comparación con la red, que es la que duele

Mismos 30 días, mismos criterios:

| Propiedad | Impresiones | Clics |
|---|---:|---:|
| chatzona.org | 7.300.374 | 202.075 |
| chatzona.com | 2.475.644 | 23.328 |
| sexofacil.org | 701.484 | 56.289 |
| chatvenezuela.net | 315.742 | 92.141 |
| chatzona.net | 196.668 | 11.244 |
| elchatgay.net | 153.937 | 5.966 |
| portalchat.es | 113.064 | 4.832 |
| chatamigos.org | 100.727 | 3.283 |
| **tuchat.org** | **1.117** | **21** |

Tres órdenes de magnitud por debajo de sus hermanos, con 5.148 páginas de contenido
propio, verificado y auditado sin incidencias. La diferencia no está en el contenido.

## El sitemap estaba bien, pero olvidado

`sitemap.xml`: 0 errores, 0 avisos, enviado el 24 de julio… y **último descargado por
Google el 3 de agosto**, con un solo shard de 5.000 URLs registrado cuando desde el 11 de
agosto son dos. Reenviados los tres (`sitemap.xml`, `sitemap-0.xml`, `sitemap-1.xml`) el
12 de agosto para forzar la relectura.

## Dos avisos sobre otros dominios de la red

Al repasar las 17 propiedades aparecieron dos caídas de más del 90% respecto al periodo
anterior. Mirando la evolución semanal, **no son sitios asentados que se hundan**, que es
lo que parecía: son picos iniciales que se desinflaron.

```
chatargentina.net   W25: 2.189 → W27: 84 → W32: 46
tarotgratuito.net   W28: 4.302 → W29: 57 → W32: 9
```

Los dos responden 200 y tienen `robots.txt` correcto, así que no es una caída técnica.
El patrón —subir de cero a unos miles y volver a cero en una o dos semanas— es el de
contenido que Google prueba y luego retira. Queda anotado aquí porque son otros
repositorios y no se ha tocado nada, pero conviene mirarlos.

## Qué hacer con esto

Lo que dice el dato es lo mismo que llevan diciendo los diagnósticos desde el 6 de
agosto, ahora con la comparativa al lado: **el trabajo pendiente de más retorno no es
publicar más salas, es conseguir que alguien enlace a tuchat.org**. Cada lote de salas
nuevas añade páginas excelentes a un sitio que Google apenas visita.

El enlazado interno ya se ha exprimido en lo que se podía: los breadcrumbs pasan por la
región (963 ciudades), `/chat/mexico` enlaza a sus estados y las salas nuevas cuelgan de
sus hubs. Lo que falta es de fuera, y vive en los otros repositorios de la red.
