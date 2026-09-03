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

### Pendientes más importantes (ordenados)

1. **Crítico**: `/var/www/tuchat.org` en el VPS quedó con un `git rebase`
   sin resolver desde el 2026-09-03 (choque entre un cron automático y
   pushes manuales desde este equipo). Hasta que alguien ejecute a mano
   `git rebase --abort` en el VPS, el próximo choque similar volverá a
   perder un día entero de contenido sin publicar (pasó hoy: se perdieron
   el goteo de 50 localidades y las noticias del día).
2. Rehacer las localidades y noticias del 2026-09-03 perdidas por el
   incidente anterior.
3. Revisar si el cron `generar-terminos-tuchat.sh` (03:00 UTC) es redundante
   con las salas de término que ya genera `generar-salas-tuchat.sh` (01:30).
4. Añadir comprobación de idioma a la curación de noticias: se coló una
   palabra en francés ("plutôt") en una noticia publicada el 2026-09-02.
5. `alt` vacío en 6 de 8 imágenes muestreadas en `/chat/madrid` — backlog
   conocido, confirmado con dato fresco.

Próxima remedida de GSC: 2026-09-20/25.
