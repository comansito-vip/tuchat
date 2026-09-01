# Keyword research y remedida de indexación — tuchat.org (2026-09-01)

Datos de Search Console API (`gsc_search_analytics`, propiedad `https://www.tuchat.org/`,
90 días = 2026-06-01 a 2026-08-29, lag de 3 días) y del corpus de demanda de la red
(`/home/javier/red-seo`, 66.538 consultas / 41,1M impresiones de 18 propiedades, 90 días).

## 1. Remedida de indexación — mejora real y medible desde el 2026-08-18

| Métrica (90d) | 2026-08-18 (memoria) | 2026-09-01 (hoy) |
|---|---:|---:|
| Páginas con alguna impresión | 6 | **15** |
| Consultas con datos | 483 | 538 |
| Impresiones | 1.161 | 1.592 |
| Clics | 7 | 3 |

Tendencia 28d vs 28d previos (dato nuevo, no estaba medido antes): de **5 páginas /
524 imp / 10 clics** a **14 páginas / 1.499 imp / 24 clics**. El rastreo sigue
ampliándose, despacio pero sin frenarse.

Páginas nuevas que entraron desde la última medida (no estaban en la lista de 6):
`/chat/republica-dominicana` (pos 11,2 — la mejor página de sala hasta ahora),
`/chat/amigos`, `/chat/alicante`, `/chat/mexico`, y con 1 impresión cada una:
`/chat/a-coruna`, `/chat/almeria`, `/chat/badalona`, `/chat/barcelona`, `/chat/caceres`.
Nota de fiabilidad: al cruzar página+query, `/chat/republica-dominicana` solo aparece
con 1 imp/pos 73 en "chat de republica dominicana" — el resto de sus 15 impresiones
vienen de consultas que la API anonimiza al combinar dos dimensiones (umbral de
privacidad de GSC); la cifra de 15 imp/pos 11,2 del informe por página es la fiable,
no hay forma de saber a qué consulta exacta corresponde el resto.

**El patrón "org" se confirma otra vez** y sigue siendo la única puerta de entrada al
top 20: "chat gratis org" pos 14,0 (antes 13,4), "salas de chat org" pos 11,4 (antes
7,7, empeoró algo), "chat amigos org" pos 11,0, "latin chat org" pos 13,0. Todas por
debajo de 60 impresiones.

**Hallazgo nuevo, no visto en la medida anterior:** dos consultas SIN "org" ya entran
en la franja 21-30, algo que en agosto no pasaba (todo lo no-org estaba en 60-70):
"salas de chat gratis" pos 24,1 (26 imp) y "sala de chat gratis" pos 22,6 (10 imp).
Es la primera señal de que el dominio empieza a tener algo de tracción fuera del
patrón "org", aunque todavía muy débil.

## 2. Queries en posición 11-20 (franja accionable)

| Impr. | Posición | Consulta |
|---:|---:|---|
| 53 | 14,0 | chat gratis org |
| 7 | 11,4 | salas de chat org |
| 4 | 18,8 | sala de chat sin registro |
| 3 | 11,0 | chat amigos org |
| 3 | 13,0 | latin chat org |
| 1 | 17,0 | calentarg chat |
| 1 | 17,0 | chat movil hispano bdsm |
| 1 | 15,0 | chatear online gratis |
| 1 | 14,0 | chats gratuito |

Ninguna de estas corresponde a una sala identificable del catálogo (todas las imprime
la home, como ya se sabía). No hay una landing concreta que "reforzar" para subir
estas consultas — el sujeto que rankea es el dominio/home, no una sala.

## 3. Cruce con el corpus de la red — gaps de catálogo

Se buscaron en el corpus (68k consultas, 18 propiedades) los términos de salas grandes
del catálogo de tuchat: madrid, barcelona, mexico, argentina, gay, chueca, república
dominicana, colombia, perú, chile. **tuchat.org no aparece en el listado de dominios
de NINGUNO de estos términos** — ni en los de cientos de miles de impresiones ("chat
madrid" 169.632 imp, pos media de red 7,7) ni en los medianos. Es decir: no hay huecos
de catálogo que capturar (las salas ya existen todas), el problema es 100% de
autoridad/rastreo del dominio, consistente con el diagnóstico ya cerrado en agosto.
Tampoco se encontró ningún término de alta demanda para el que tuchat.org tenga sala
pero no aparezca — no aplica: directamente no aparece en ningún término grande de la
categoría "chat + lugar", con o sin sala.

`--huecos 5000` (demanda alta / posición mala en TODA la red) no devolvió ninguna fila
con tuchat.org entre los dominios — refuerza que el dominio simplemente no tiene peso
suficiente todavía para competir por volumen alto, en ningún término.

## 4. Top 15 queries por impresiones (90d, panorama general)

| Impr. | Clics | Posición | Consulta |
|---:|---:|---:|---|
| 53 | 0 | 14,0 | chat gratis org |
| 39 | 0 | 66,9 | chat gratis |
| 38 | 0 | 71,3 | chat online gratis |
| 34 | 0 | 64,0 | chat en linea gratis |
| 32 | 0 | 62,0 | chats gratis |
| 26 | 0 | 24,1 | salas de chat gratis |
| 21 | 1 | 75,8 | chat gratis en español |
| 16 | 0 | 55,4 | chat español |
| 14 | 0 | 76,7 | paginas de chat |
| 14 | 0 | 52,6 | tuchat |
| 12 | 0 | 66,2 | chatear en español |
| 12 | 0 | 56,7 | salas de chat |
| 11 | 0 | 102,5 | chat online |
| 10 | 0 | 66,3 | chat español gratis |
| 10 | 0 | 60,0 | chats en español |

## 5. Recomendación (dato, no opinión)

No hay trabajo de copy ni de catálogo que hacer: ya se descartó en agosto y esta
medida lo reconfirma (0 apariciones de tuchat.org en los términos grandes del
corpus). Lo único con tracción real y creciente para reforzar —sin tocar el
argumento "arreglar indexación con copy", que sigue descartado— son las páginas que
YA reciben impresión: `/chat/republica-dominicana` (pos 11,2, la más cercana al
top 10 de cualquier sala hasta ahora) y, en menor medida, `/chat/mexico`,
`/chat/galicia`, `/chat/argentina`, `/chat/amigos`. Si se quiere invertir esfuerzo,
es en verificar que esas páginas concretas no tengan ningún problema técnico
residual (no es el caso medido hasta ahora) y dejar que el rastreo siga su curso:
la tendencia 28d/28d (×3 en páginas con impresión, ×2,9 en impresiones) es la señal
más fuerte de todo el informe y no requiere ninguna acción nueva, solo tiempo.

Próxima remedida recomendada: dentro de 2-3 semanas (hacia 2026-09-20/25), siguiendo
el mismo ritmo que las dos anteriores.
