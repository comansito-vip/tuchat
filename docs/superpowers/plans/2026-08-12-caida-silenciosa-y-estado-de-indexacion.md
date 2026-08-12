# La caída que no se veía, y qué dice Search Console ahora

**Fecha:** 2026-08-12
**Resumen:** el sitio llevaba la mañana entera sin build en disco y respondiendo
200; el sitemap servía una foto de las 00:13; y las URLs nuevas empiezan por fin
a aparecer como «Descubiertas» en Search Console.

---

## Lo que estaba roto y no lo parecía

A las 05:16 el cron de noticias commiteó, pasó los 457 tests y murió en
`rm -rf .next` con `cannot remove '.next/server/app': Directory not empty`. Con
`set -e`, morir ahí es morir **antes** de `npm run build` y del `pm2 restart`.

Lo que quedó es lo más engañoso que puede quedar: `.next` medio borrado —sin
`BUILD_ID`, sin `app-paths-manifest.json`— y un proceso pm2 vivo desde las 03:02
respondiendo 200 desde memoria. El sitio parecía sano. Estaba sostenido por un
proceso que no podía reiniciarse: al primer `pm2 restart`, caído entero.

Lo único que se notaba desde fuera era `/tiempo`, en 500, y `/tiempo/*` en 404.

**La causa es una carrera con nosotros mismos.** pm2 sigue sirviendo mientras se
construye y cada visita que dispara ISR escribe dentro de `.next/server/app`;
`rm -rf` vacía el directorio y luego hace `rmdir`, y si en ese hueco entra una
visita, falla con ENOTEMPTY. Ya había pasado el 2026-08-05 —el `rmdir` falló en
`.next/server/app/chat/asturias.segments`— pero se leyó como un build incremental
corrupto, y el remedio de entonces, borrar entero, corría exactamente la misma
carrera.

Arreglado en los tres scripts cambiando el borrado por `mv`, que es un `rename()`
atómico y no recorre el directorio. Detalle completo en `deploy/README.md`.

### Cómo se detecta en diez segundos

```bash
ls /var/www/tuchat.org/.next/BUILD_ID   # si no existe, NO hay build en disco
```

### Y la trampa en la que se cae mientras se comprueba

Está documentada desde el 11 de agosto y hoy se ha caído en ella **dos veces**:
pedir una URL que solo existe en el commit nuevo *mientras el build corre* hace
que Next la resuelva contra el catálogo viejo, devuelva 404 y **lo cachee en
disco**. Con el patrón `mv` el 404 se va con el `.next` apartado, pero si se pide
durante el build nuevo, se queda.

La regla, que ahora sí: **no pedir URLs nuevas hasta que `pgrep -f "next build"`
esté vacío**. Y no dar por terminado un deploy leyendo `tail` del log sin mirar
la fecha: la línea `deploy OK` que se lee puede ser la del 5 de agosto.

## El sitemap servía una foto vieja

El sitemap de producción de esta mañana no contenía **ninguna** de las salas
publicadas ayer ni hoy. El fichero versionado es del día 12 a las 00:13.

Los tres sitemaps estaban trackeados en git. El deploy hace `git reset --hard`
antes de construir, así que restauraba esa foto y la servía los quince minutos
del build. Y no se ponía al día sola: el único cron que commitea es el goteo, y
solo mete `src/data` y `data/localidades`.

Ya no se versionan. `postbuild` los regenera en cada build, que es lo que son:
artefactos.

## Search Console, con los números de hoy

Inspección por API (`sc-domain:tuchat.org`), 12 de agosto:

| URL | Cobertura | Último rastreo |
|---|---|---|
| `/` | Enviada e indexada | **2026-08-12** |
| `/chat` | Enviada e indexada | 2026-07-26 |
| `/chat/galicia` | Enviada e indexada | 2026-07-15 |
| `/chat/argentina` | Enviada e indexada | 2026-07-27 |
| `/chat/madrid` | **Descubierta: actualmente sin indexar** | nunca |
| `/chat/mexico` | **Descubierta: actualmente sin indexar** | nunca |
| `/chat/gay-malaga` | Descubierta: actualmente sin indexar | nunca |
| `/noticias` | Google no reconoce esta URL | nunca |
| `/ranking` | Google no reconoce esta URL | nunca |
| `/tiempo/madrid` | Google no reconoce esta URL | nunca |

**Hay movimiento real**: el 12 de agosto `/chat/madrid` y `/chat/mexico` eran
«Google no reconoce esta URL» y ahora son «Descubierta». El reenvío del sitemap
funcionó y están en cola.

Lo que no encaja: `/noticias`, `/ranking` y `/tiempo/madrid` **están en el shard
0**, el que Google sí conoce, y siguen sin reconocerse. No es un problema de
sitemap ni de robots. Es que a este dominio Google apenas le dedica rastreo.

Conclusión, otra vez y con más datos: **el trabajo pendiente de más retorno no
es publicar más salas, es que alguien enlace a tuchat.org**. Vive en los otros
repositorios de la red.

## Contenido publicado hoy

13 salas, todas con demanda medida en el corpus y fuente verificada por entidad:

| Sala | Por qué |
|---|---|
| `chachipen` | 227.636 impresiones y 94.416 clics en la red; tuchat no estaba |
| `gay-coruna`, `gay-chile`, `gay-la-rioja`, `gay-manizales`, `gay-usa`, `gay-bucaramanga` | cierran el hueco de salas de ambiente |
| `bcn`, `mty`, `cdmx`, `cba` | 131.477 impresiones entre las cuatro |
| `omegle`, `webchat` | 132.712 y 63.719 impresiones |

El hueco de ambiente queda **cerrado**: de 1.261 lugares con demanda, 59 tienen
sala y cubren 1.229.068 impresiones; el resto es ruido de intención o apodos.

## Lo siguiente, ya medido

Cruzando el corpus con el catálogo (243 términos con ≥4.000 impresiones y sin
página propia), casi todo lo grande resultó ser ruido de la heurística o algo ya
cubierto en plural —«hispano» lo recoge `hispanos`, «latino» lo recoge
`latinos`—. Lo que queda de verdad:

- **`/chat/merida`** — 52.339 impresiones en la consulta genérica «chat merida».
  Las tres Méridas existen desambiguadas (`merida-mexico`, `merida-venezuela`,
  `merida-espana`) pero el término a secas no tiene página. Lo natural sería una
  desambiguadora, que es sobre todo enlaces: queda a la espera.
- **Adultos** — «caliente» (293.101), «sex», «travesti», «cornudo». Hay sección
  de adultos en el sitio, pero entrar ahí es decisión del dueño, no del que pasa
  por aquí.
- **`adolescentes`** (58.279) — **no se toca**. Es tráfico de menores y esta red
  no publica salas de edad por debajo de la mayoría legal.
- Marcas ajenas sin ángulo propio: `netchat`, `bazocam`, `kiwi`, `friends`.

## Accesibilidad: sin hallazgos

Auditadas siete páginas del HTML servido (1.642 enlaces, 475 imágenes): cero
problemas. `lang`, un `h1` por página, `main`, `nav`, enlace de salto al
contenido, inputs etiquetados, sin saltos de encabezado. Los tokens de color ya
estaban elegidos por contraste medido.

Dos cosas que parecen fallos y no lo son, para no «arreglarlas» en el futuro:

- **Los acentos de categoría dan contrastes malísimos** (`text-juegos`, 2,04:1).
  No se usan como texto legible: van en un `<span aria-hidden>` que solo contiene
  un emoji, y el nombre de la categoría usa `text-ink`, con 16,88:1.
- **El aviso `click-events-have-key-events` de `SearchInput`** es un falso
  positivo del patrón combobox: el teclado se gestiona en el input con
  `aria-activedescendant`, y las opciones no reciben foco. Añadirles manejadores
  sería el error.

Queda `scripts/auditar-a11y.ts` para repetirlo (`BASE=… npx tsx …`, sale con 1 si
encuentra algo).
