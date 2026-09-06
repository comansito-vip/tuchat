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

### Pendientes más importantes (ordenados, revisado 2026-09-06)

Informe de la última pasada (SEO/GEO/UX móvil, con correcciones aplicadas):
`docs/superpowers/plans/2026-09-06-revision-seo-geo-ux-movil.md`.

1. **Decisión del cliente**: el título de la home ("Chat gratis de amigos,
   chatear en España y Latinchat") es el único del top 10 de las SERPs de
   "chat gratis…" sin "sin registro" ni "en español". Está fijado a
   propósito por el cliente (comentario en `layout.tsx`); no tocarlo sin que
   lo pida, pero es la palanca on-page más grande que queda.
2. Retirar el cron `generar-terminos-tuchat.sh` (03:00 UTC): redundante con
   las salas de término de `generar-salas-tuchat.sh` y lleva desde el
   2026-09-02 saltándose cada día por "pipeline ocupado".
3. `/chat` pesa 861 KB de HTML (979 enlaces, 478 KB de payload RSC) y tarda
   5,7 s en ser interactiva en móvil. Sacar "Más salas temáticas" (645
   chips) a su propia página o cargar los grupos bajo demanda.
4. Los contadores "N usuarios conectados / hablando ahora" son sumas de un
   campo estático, no una medida. Decidir si se conectan al IRC real.

Resueltos desde la lista anterior: el rebase roto del VPS (desapareció solo,
crons publicando con normalidad los días 4 y 5), la comprobación de idioma
en la curación (`515fc6e`), y el `alt=""` de las banderas, que se cierra
**sin acción**: van pegadas al nombre en el mismo enlace, un `alt`
descriptivo lo duplicaría en el lector de pantalla, y Lighthouse
Accessibility ya da 1,0.

Próxima remedida de GSC: 2026-09-20/25.
