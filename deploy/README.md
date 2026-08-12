# Generación de contenido en el VPS

Copia versionada de lo que corre en producción. **La fuente de verdad es el VPS**
(`164.132.107.97`, usuario `ubuntu`); esto está aquí para no depender de que el
servidor siga en pie para saber qué hacía, y para poder revisar los cambios en el
historial. Si tocas el script en el VPS, actualiza también esta copia.

## Qué hay instalado

| Ruta en el VPS | Cuándo | Qué hace |
|---|---|---|
| `/home/ubuntu/generar-salas-tuchat.sh` | cron, 01:30 UTC | redacta 12 salas de localidad, pasa los tests, commitea, empuja y **reconstruye** |
| `/home/ubuntu/generar-noticias-tuchat.sh` | cron, 05:00 UTC | genera noticias, cura, pasa los tests, commitea, empuja y **reconstruye** |
| `/home/ubuntu/deploy-tuchat.sh` | cron, 05:30 UTC | despliega si `origin/main` trae commits nuevos (los hechos desde fuera del VPS) |

Los tres están aquí con el mismo nombre. `deploy-tuchat.sh` faltaba y se añadió el
2026-08-12, cuando resultó que compartía con los otros dos el fallo de más abajo.

Logs: `generar-salas-tuchat.log`, `generar-noticias-tuchat.log` y `deploy-tuchat.log`,
todos en `/home/ubuntu/`.

Los tres comparten `/tmp/tuchat-pipeline.lock` y van escalonados para no competir
entre ellos ni con los ~20 crons de estoeschat, que usan las mismas claves de LLM.

## Por qué el goteo corre a la 01:30 y no a las 03:40

Lo movimos el 11 de agosto de 2026, después de perder un día de noticias.

Aquel día el goteo arrancó a las 03:40 y **no terminó hasta las 05:49**, cuando
lo normal eran 14 minutos. La causa no fue el build: fue que Groq devolvía
`429 … on tokens` —cuota diaria agotada— y cada localidad reintenta con todos los
proveedores antes de darse por vencida, así que el lote entero se arrastró dos
horas y publicó 5 salas de 12. A las 05:10 el cron de noticias se encontró el
lock ocupado, esperó sus 10 minutos y se saltó el día.

Las dos cosas que lo causaron están arregladas:

- **El horario.** A las 03:40 arrancaba a la vez que un cron de estoeschat, y a
  las 03:50 otro; la cuota de Groq y Cerebras es común a toda la red, así que
  competían por ella. De 00:00 a 03:39 no corre nada, de modo que a la 01:30 el
  goteo tiene la cuota entera y casi cuatro horas de margen.
- **La espera del lock de las noticias**, de 10 a 40 minutos. Diez minutos no dan
  para que termine un goteo que se complique.

Para ver si vuelve a pasar: `grep "se salta" /home/ubuntu/generar-noticias-tuchat.log`
y `node scripts/check-llm-providers.mjs` desde `/var/www/tuchat.org` con el `.env`
cargado, que dice qué proveedores responden **en ese momento** (las cuotas se
reponen a lo largo del día: a mediodía suele haber Groq, Cerebras y NVIDIA).

## Por qué el generador reconstruye él mismo

Es lo menos evidente de todo esto y la razón de que exista este README.

El generador commitea **en el mismo checkout que sirve el sitio**. Al terminar, el VPS
ya está en `origin/main` — y `deploy-tuchat.sh` empieza comparando `HEAD` con
`origin/main` y sale si son iguales. Resultado: el deploy de las 05:30 no reconstruía
nada y el contenido se quedaba commiteado en git sin llegar nunca a la web.

Pasó en la primera prueba (2026-08-06): `.next` quedó 15 minutos por detrás de
`news.ts`. Con GitHub Actions no ocurría porque el commit se hacía en GitHub y el VPS
quedaba por detrás, así que el deploy sí detectaba trabajo pendiente.

Por eso el generador termina con `rm -rf .next && npm run build && pm2 restart`.
El deploy de las 05:30 sigue existiendo para recoger lo que se empuje desde fuera.

## Nunca borres `.next` con `rm -rf` mientras pm2 sirve

Es la causa de las dos únicas caídas que ha tenido el sitio, y las dos veces se
diagnosticó mal.

pm2 sigue sirviendo mientras se construye, y cada visita que dispara ISR escribe un
`.html` dentro de `.next/server/app`. `rm -rf` vacía el directorio y luego hace `rmdir`:
si en ese hueco entra una visita, el `rmdir` falla con **ENOTEMPTY**. Como los tres
scripts llevan `set -e`, mueren ahí —**antes** de `npm run build` y de `pm2 restart`—.

Lo que queda es lo peor de los dos mundos: `.next` medio borrado, sin `BUILD_ID` ni
`app-paths-manifest.json`, y un proceso pm2 vivo que sigue respondiendo 200 desde
memoria. El sitio parece sano y en realidad está sostenido por un proceso que no puede
reiniciarse: al primer `pm2 restart` se cae entero.

| Fecha | Cómo se vio | Qué se pensó entonces |
|---|---|---|
| 2026-08-05 | 500 en la home; `rmdir` de `.next/server/app/chat/asturias.segments` | «build incremental corrupto» → se pasó a borrar entero, que corre la misma carrera |
| 2026-08-12 | `/tiempo` en 500 y `/tiempo/*` en 404 durante toda la mañana | se vio a tiempo: el log terminaba en el `rm` y no había `BUILD_ID` |

El arreglo es no borrar, sino **apartar**:

```bash
rm -rf .next-viejo-* 2>/dev/null || true
[ -d .next ] && mv .next ".next-viejo-$$"
npm run build
pm2 restart tuchat.org
rm -rf .next-viejo-*        # ya nadie escribe dentro
```

`mv` es un `rename()` atómico: no recorre el directorio, así que no hay ventana que
perder por mucho tráfico que haya. Está aplicado en los tres scripts.

Para comprobar de un vistazo que un build terminó de verdad:

```bash
ls /var/www/tuchat.org/.next/BUILD_ID   # si no existe, NO hay build en disco
```

## Lock compartido

Los tres usan **`/tmp/tuchat-pipeline.lock`**, no uno cada uno. Manipulan el mismo árbol
de git y el deploy hace `git reset --hard`: si arrancara a mitad de una generación, se
llevaría por delante el `news.ts` recién escrito.

Cuánto espera cada uno antes de rendirse, y por qué:

| Script | Espera | Motivo |
|---|---:|---|
| goteo de salas | 15 min | corre el primero, a la 01:30, y no debería encontrarse nada |
| noticias | **40 min** | va detrás del goteo, que algún día se alarga; con 10 minutos se perdió el día entero (ver arriba) |
| deploy | 30 min | si la generación se alarga es él quien publica su trabajo, y saltárselo dejaría el contenido del día sin salir |

## Credenciales

- **Deploy key con escritura** (`~/.ssh/tuchat_deploy`, alias `github.com-tuchat` en
  `~/.ssh/config`). Hace falta porque las noticias viven en `src/data/news.ts`, que
  está versionado: sin push, el `git reset --hard` del deploy las borraría.
- **Claves de LLM** en `/var/www/tuchat.org/.env`, no en el entorno del cron. El
  script hace `set -a; . ./.env; set +a`.

Para comprobar que los proveedores siguen respondiendo:
`node scripts/check-llm-providers.mjs`.

## Si algo no se publica

1. `tail -40 /home/ubuntu/generar-noticias-tuchat.log`
2. ¿Se quedó sin proveedores? → `node scripts/check-llm-providers.mjs`
3. ¿Falló en los tests? Es a propósito: si el contenido del día rompe una regla del
   sitio, no se publica. El log dice qué test cayó.
4. Como red de seguridad, el workflow `generate-news.yml` sigue existiendo con
   `workflow_dispatch` y puede lanzarse a mano desde GitHub.

## No pidas una URL nueva mientras el build viejo sigue sirviendo

Pasó el 11 de agosto de 2026 con `/chat/gay-euskadi` y costó un rato entenderlo.

Mientras el deploy construye, pm2 sigue sirviendo el build **anterior**. Si en ese momento
alguien pide una URL que solo existe en el commit nuevo —yo, comprobando si ya había
salido—, Next la resuelve por ISR contra el catálogo viejo, no la encuentra, devuelve 404
**y lo cachea en disco**: deja un `.html` de «Página no encontrada» y un `.meta` con
`"status":404` en `.next/server/app/chat/`.

Lo malo es que ese fichero **sobrevive al build**. La página termina prerenderizada de
verdad, el `prerender-manifest.json` la lista, el HTML pesa lo que debe… y aun así el
servidor responde 404 con `Internal: NoFallbackError` en
`~/.pm2/logs/tuchat.org-error.log`, porque se encuentra antes la entrada cacheada.

Cómo se detecta y se arregla:

```bash
cd /var/www/tuchat.org/.next/server/app/chat
for f in *.meta; do grep -l '"status":404' "$f"; done        # rutas con 404 cacheado
rm -rf <slug>.html <slug>.meta <slug>.rsc <slug>.segments     # se borra la entrada
pm2 restart tuchat.org                                        # y se regenera al pedirla
```

La pista rápida es el tamaño: una sala real pesa 90-100 KB de HTML y la versión 404 se
queda en unos 27 KB.

**La regla:** comprobar el resultado de un deploy en el **origen** solo cuando ha
terminado (`ps -ef | grep "next build"` vacío y pm2 reiniciado). Antes de eso, mirar el
progreso por los ficheros generados —`ls .next/server/app/tiempo/*.html | wc -l`— y no
por HTTP.
