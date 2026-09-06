@AGENTS.md

## SEO: keywords objetivo (2026-09)

Datos de Search Console (90d, lag 2-3 días) y del corpus de demanda de la red
(`/home/javier/red-seo`). Informe completo:
`docs/superpowers/plans/keyword-research-2026-09.md`.

**Patrón "org" — lo único con tracción real hoy** (todo por debajo de 60
impr./90d, pero es lo que sostiene el crecimiento del dominio; no hay landing
que reforzar, las imprime la home):

| Consulta | Impr. (90d) | Posición |
|---|---:|---:|
| chat gratis org | 53 | 14,0 |
| salas de chat org | 7 | 11,4 |
| chat amigos org | 3 | 11,0 |
| latin chat org | 3 | 13,0 |
| sala de chat sin registro | 4 | 18,8 |

**Panorama general (top por impresiones, todas fuera del top 20 salvo "org")**:

| Consulta | Impr. (90d) | Posición |
|---|---:|---:|
| chat gratis | 39 | 66,9 |
| chat online gratis | 38 | 71,3 |
| chat en linea gratis | 34 | 64,0 |
| chats gratis | 32 | 62,0 |
| salas de chat gratis | 26 | 24,1 |
| chat gratis en español | 21 | 75,8 |
| chat español | 16 | 55,4 |
| paginas de chat | 14 | 76,7 |
| tuchat | 14 | 52,6 |
| chatear en español | 12 | 66,2 |
| salas de chat | 12 | 56,7 |
| chat online | 11 | 102,5 |

**Única sala de catálogo cerca del top 10**: `/chat/republica-dominicana`
(pos 11,2, 90d) — vigilar, no tocar, sin problema técnico detectado.

**Catálogo cerrado, sin huecos**: tuchat.org no aparece en NINGÚN término
grande de "chat + lugar" del corpus de la red (madrid, barcelona, méxico,
argentina, gay, r. dominicana, colombia, perú, chile...), ni tampoco en
"chat tarot gratis" (5.545 impr. de red, pos 8,2) ni en horóscopo, pese a
tener `/tarot`, `/horoscopo`, `/ranking`, `/anime` ya construidos. El
diagnóstico es autoridad/rastreo del dominio, no falta de páginas — no crear
contenido nuevo para intentar arreglarlo, ya se descartó esa vía en agosto.

### Pendientes más importantes (ordenados, revisado 2026-09-06 noche)

Informe de la última pasada (SEO/GEO/UX móvil, cuatro tandas de correcciones):
`docs/superpowers/plans/2026-09-06-revision-seo-geo-ux-movil.md`.

Todo lo de la lista anterior está resuelto: rebase del VPS, idioma en la
curación, `/chat` partido en `/chat/temas` (PSI móvil 0,72 → 0,95), `alt` en
todas las banderas y escudos, cron `generar-terminos` retirado del VPS, title
y description de la home reescritos (2026-09-06, a petición del cliente), y
los contadores de usuarios pasan a ser **medida real de la red IRC**
(`scripts/irc-muestra.mjs` → `data/irc-muestra.json`, lanzado por el cron de
salas; `src/lib/irc-muestra.ts`). El campo `users` de las fichas ya es solo
peso de ordenación: no volver a enseñarlo como cifra.

1. Vigilar en GSC (2026-09-20/25) el efecto del nuevo title: "chat gratis
   org" (pos 14,5), `/chat` (pos 5,6) y las consultas "sin registro".
2. La muestra IRC la toma el cron de salas a las 01:30 UTC (03:30 en España):
   si las cifras salen bajas, mover la toma a las 21:00-23:00 UTC.

Próxima remedida de GSC: 2026-09-20/25.
