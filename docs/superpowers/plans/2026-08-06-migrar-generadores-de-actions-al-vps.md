# Migrar los generadores de GitHub Actions a los VPS

**Decisión del 2026-08-06:** los generadores de contenido no siguen en GitHub Actions —
no se va a pagar el plan. Cada web ejecuta los suyos en el VPS que la aloja.

**Motivo inmediato:** Actions está bloqueado por facturación en los 14 repos privados
(*"recent account payments have failed or your spending limit needs to be increased"*),
así que esos generadores llevan días parados. tuchat.org es repo público y por eso el suyo
sigue corriendo gratis, pero se migra igual por coherencia.

---

## TERMINADO (2026-08-06). Casi todo estaba hecho ya

El inventario inicial de este documento decía «21 crons en 4 proyectos por migrar». **Era
falso.** Al ir a migrarlos resultó que Portalchat, Chatcámara y chatamigos llevaban tiempo
generando en sus VPS: lo único que seguía en Actions era tuchat.

El error vino de contar los workflows con `grep schedule:`, que marca como activos los que
tienen el cron **comentado**. Chatcámara, por ejemplo, ya llevaba escrito
`# schedule: DESACTIVADO — cron gestionado por crontab del VPS`. La comprobación correcta es
parsear el YAML y mirar si `schedule` está entre los disparadores de `on:`.

| Proyecto | Generadores | Dónde corre | Qué se hizo hoy |
|---|---:|---|---|
| tuchat | 1 | VPS 1, cron 05:00 UTC | **migrado** (ver abajo) |
| Portalchat | 12 | VPS 2, `/opt/portalchat-es/scripts/` | apagados los 12 workflows fantasma |
| chatamigos | 3 | VPS 3, `/var/www/chatamigos/gen-*.sh` | apagados los 3 workflows fantasma |
| Chatcámara | 5 | VPS 2, `/opt/chatcamara/scripts/` | nada: ya estaban desactivados |

Los workflows fantasma no eran inofensivos: seguían disparándose a diario y fallando, porque
Actions está bloqueado por facturación en los repos privados. Solo producían ruido y correos
de error que tapaban los fallos de verdad.

**Comprobado: 0 workflows con `schedule` activo en toda la red.** `ci.yml` y `deploy.yml` no
se tocan — no son generadores.

## El modelo que ya funciona: estoeschat.com

En el VPS `164.132.107.97` hay ~20 crons de estoeschat.com generando contenido desde hace
tiempo, con este patrón:

```cron
50 4 * * * cd /var/www/estoeschat.com && set -a && . ./.env && set +a && \
  DATASET=latam-nuevos-10k node scripts/cron-generar-latam.mjs 40 >> data/latam-10k-stdout.log 2>&1
```

Lo que lo hace viable: **estoeschat escribe su contenido en Postgres**, no en ficheros del
repositorio. El cron genera, guarda en la base de datos y no necesita git para nada.

## El nudo: tuchat escribe en un fichero versionado

`scripts/generate-news.ts` escribe en `src/data/news.ts` (línea 377), que está en git. Y el
deploy del VPS hace `git reset --hard origin/main` — así que **un cron que generase en el VPS
vería su trabajo borrado en el siguiente deploy**. Por eso la generación está hoy en Actions:
allí hay credenciales para commitear y empujar.

Migrarlo exige elegir una de estas dos vías:

### Opción A — dar credenciales de escritura al VPS
Una deploy key con permiso de escritura en el repo. El cron genera → commitea → empuja, y el
deploy siguiente ya trae el commit.

- A favor: cambio mínimo, el flujo actual se conserva entero, `news.ts` sigue en git y el
  contenido es revisable en el historial.
- En contra: una clave con permiso de escritura viviendo en el servidor.

### Opción B — sacar el contenido de git
Que las noticias vivan en un JSON bajo `.data/` (no versionado, ya excluido) y que la web lo
lea en runtime, como hace estoeschat con Postgres.

- A favor: ninguna credencial en el VPS; el `git reset --hard` deja de ser un peligro.
- En contra: toca código de la web (hoy `news.ts` se importa como módulo), el contenido deja
  de estar en el historial y hay que resolver la revalidación de las páginas ya construidas.

**Recomendación: opción A.** El coste es guardar bien una clave; la B obliga a rehacer cómo
la web consume las noticias, y el beneficio real es menor.

## Mapa de servidores

**VPS 1 — `164.132.107.97`** (OVH, Ubuntu, usuario `ubuntu`, sudo NOPASSWD).
Comprobado en `/var/www` y `pm2 list`:

- `tuchat.org` (pm2 :3001) — **generador ya migrado**
- `estoeschat.com` — ~20 crons de generación funcionando; es el modelo
- `chatbarcelona.es`, `chatligar.net` (Laravel, con su `schedule:run` cada minuto)

**VPS 2 — `164.132.41.192`** (OVH, Ubuntu 24.04, `vps-503956ae`, acceso con
`~/.ssh/id_ed25519`). Servidor **compartido**, según la nota de topología de Chatcámara:

- `chatzona.com`, `chatargentina`
- `portalchat.es` → `/opt/portalchat-es` — **12 crons por migrar**
- `elchatgay.net` → `/opt/elchatgay` (pm2 `elchatgay-web` :3001)
- `chatcamara.com` → `/opt/chatcamara` (pm2 `chatcamara-web` :3002) — **5 crons por migrar**

> ⚠️ Dos avisos para el VPS 2, ya documentados: **Chatcámara no es un repo git** (se despliega
> por `rsync` desde local), así que un generador que commitee no encaja ahí sin cambiar el
> método de despliegue. Y **dos builds simultáneos corrompen el `.next`** y tumban el sitio:
> hay que escalonar y lanzarlos detached.

**VPS 3 — `152.228.138.84`** (OVH, usuario `ubuntu`, sudo sin contraseña, Apache como proxy
inverso). Es donde vive el resto:

- `chatamigos.org` → `/var/www/chatamigos` (systemd `chatamigos.service`, :3002)
- `tarotgratuito.net` → `/opt/tarotgratuito` (:4324)
- `chatzona.net` → `/var/www/chatzona.net` (PHP, ~10 crons propios)
- `trivialchat.org` (:4323), `sexofacil.org` (Docker), `chatlesbianas` → `/opt/chatlesbianas`

Los tres VPS son OVH y se entra con `ubuntu`. El 1 con contraseña; el 2 y el 3 con
`~/.ssh/id_ed25519`.

## Estado: tuchat MIGRADO (2026-08-06)

Se eligió la **opción A**. Instalado y probado de extremo a extremo:

- Deploy key `~/.ssh/tuchat_deploy` con permiso de escritura (alias `github.com-tuchat`),
  remote del checkout cambiado de HTTPS a SSH.
- Las 8 variables `*_API_KEYS` copiadas al `.env` del VPS, que no tenía ninguna. Las dos
  que sí había (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) quedan comentadas: son inválidas y
  encabezaban la cadena, gastando dos intentos fallidos por categoría.
- `/home/ubuntu/generar-noticias-tuchat.sh` + cron a las 05:00 UTC.
- `generate-news.yml` se queda solo con `workflow_dispatch`.
- `tsx` declarado en package.json: se descargaba con `npx` en cada ejecución, lo que
  convertía la red en un punto de fallo diario.
- Copia versionada de los scripts en `deploy/`, con un README que explica los dos fallos
  de abajo.

### Dos fallos que solo aparecieron al probar

Ninguno se ve leyendo el código; los dos salieron ejecutando de verdad.

1. **Locks separados.** Generador y deploy usaban cada uno el suyo, con 30 minutos entre
   ambos crons. Si la generación se pasaba de ese margen, el `git reset --hard` del deploy
   arrancaba a mitad y se llevaba por delante el `news.ts` recién escrito. Ahora comparten
   `/tmp/tuchat-pipeline.lock`; el deploy espera hasta 30 minutos en vez de rendirse.

2. **El contenido se commiteaba pero no se publicaba.** El generador commitea en el mismo
   checkout que sirve el sitio, así que al terminar el VPS ya está en `origin/main` — y
   `deploy-tuchat.sh` sale por su comprobación `LOCAL = REMOTE` sin construir nada. El
   `.next` quedó 15 minutos por detrás de `news.ts` y las noticias no llegaron a la web.
   Con Actions no pasaba porque el commit se hacía en GitHub y el VPS sí quedaba por
   detrás. Ahora el generador reconstruye y reinicia él mismo tras el push.

**Es la lección para los 20 crons que faltan:** cualquier generador que commitee en el
checkout de producción tiene que reconstruir él mismo, y compartir lock con su deploy.

## Lo que queda

Nada de la migración en sí. Dos cosas sueltas que aparecieron por el camino:

1. **`chatcamara-news.log` cierra con `created=0 errors=6`** en su última pasada (2026-08-06
   18:30). El cron corre, pero ese día no creó ninguna pieza. Merece una mirada: puede ser la
   cuota de los LLM, compartida por toda la red.
2. **Actions sigue bloqueado por facturación.** Ya no afecta a los generadores, pero sí a
   `ci.yml` y `deploy.yml` de los repos privados, que tampoco pueden ejecutarse.

## Lo aprendido, por si aparece otro generador

- Un generador que commitea en el checkout de producción **tiene que reconstruir él mismo**, o
  compartir con el deploy una marca de «último commit construido». Comparar `HEAD` con
  `origin/main` no vale: el propio generador ya los ha igualado. chatamigos resuelve esto con
  un fichero `.last-built`, que es más limpio que reconstruir dentro del generador.
- Generador y deploy **comparten lock**. Los tres VPS lo hacen ya (`flock` sobre un fichero
  común), porque el deploy suele empezar con un `reset --hard` que a mitad de una generación
  se lleva por delante el trabajo.
- Para saber si un workflow está activo, **parsear el YAML**, no buscar `schedule:` con grep:
  medio inventario de este documento estaba mal por eso.
