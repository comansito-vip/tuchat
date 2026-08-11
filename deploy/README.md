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

## Lock compartido

Ambos scripts usan **`/tmp/tuchat-pipeline.lock`**, no uno cada uno. Manipulan el
mismo árbol de git y el deploy hace `git reset --hard`: si arrancara a mitad de una
generación, se llevaría por delante el `news.ts` recién escrito. El generador espera
10 minutos y se rinde; el deploy espera 30, porque si la generación se alarga es él
quien publica su trabajo y saltárselo dejaría las noticias del día sin salir.

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
