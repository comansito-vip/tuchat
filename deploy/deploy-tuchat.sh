#!/bin/bash
# Auto-deploy de tuchat.org: si hay commits nuevos en origin/main, pull+build+restart.
# Corre por cron tras el workflow de noticias (05:00 UTC) y también recoge
# cualquier otro cambio pusheado durante el día.
set -e
# Lock COMPARTIDO con generar-noticias-tuchat.sh. Espera en vez de rendirse: si
# la generación de las 05:00 se alarga, este deploy es el que publica su trabajo,
# y saltárselo dejaría las noticias del día sin salir hasta mañana.
exec 9>/tmp/tuchat-pipeline.lock
flock -w 1800 9 || { echo "[$(date -u +%FT%TZ)] pipeline ocupado 30 min; deploy pospuesto"; exit 0; }
cd /var/www/tuchat.org
git fetch origin main --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi
echo "[$(date -u +%FT%TZ)] deploy: $LOCAL -> $REMOTE"
# El build regenera public/sitemap-0.xml (trackeado) y ensucia el árbol,
# lo que hacía abortar al pull. Un checkout de deploy no tiene nada local
# que conservar: se sincroniza duro contra origin.
git reset --hard origin/main --quiet
# `npm ci` borra node_modules y reinstala de cero: en esta máquina son un par de
# minutos, y casi todos los deploys son contenido (salas, noticias, copy) sin un
# solo cambio de dependencias. Era el único de los tres scripts que lo hacía
# siempre; ahora comparte con ellos la misma huella, así que si el goteo de la
# 01:30 ya instaló, este no repite el trabajo.
HUELLA=.git/npm-ci-lock-hash
ACTUAL=$(sha1sum package-lock.json | cut -d' ' -f1)
if [ ! -d node_modules ] || [ ! -f "$HUELLA" ] || [ "$(cat $HUELLA)" != "$ACTUAL" ]; then
  echo "[$(date -u +%FT%TZ)] package-lock cambió: npm ci"
  npm ci --silent
  echo "$ACTUAL" > "$HUELLA"
fi
# .next se aparta con `mv` antes de construir; se parte siempre de cero porque un
# checkout de deploy no gana nada reutilizando caché.
#
# Y se aparta en vez de borrarse porque `rm -rf` compite con el pm2 que sigue
# sirviendo: vacía el directorio y luego hace rmdir, y una visita que dispare ISR en
# ese hueco deja un .html dentro y el rmdir falla con ENOTEMPTY. Con `set -e` eso mata
# el script antes de construir. Pasó el 2026-08-05 (rmdir de
# .next/server/app/chat/asturias.segments) y otra vez el 2026-08-12. `mv` es un
# rename() atómico y no tiene esa ventana.
rm -rf .next-viejo-* 2>/dev/null || true
[ -d .next ] && mv .next ".next-viejo-$$"
# El .env trae WEATHER_MIN_MS, que ajusta el ritmo de las peticiones a
# Open-Meteo al hecho de que aqui Next construye con UN worker. Next carga .env
# por su cuenta, pero se hace explicito para no depender de ello.
set -a; [ -f ./.env ] && . ./.env; set +a
# `npm run build` dispara antes el `prebuild` del package.json, que baja las 1.965
# previsiones en lotes de 100 (unos 4 min) y deja la cache caliente. Sin el, cada
# pagina de /tiempo las pedia de una en una con 700 ms de separacion y el
# prerender se llevaba 18,6 de los 20,6 minutos del deploy.
npm run build
/usr/lib/node_modules/pm2/bin/pm2 restart tuchat.org
# Ya nadie escribe en el .next viejo: se puede borrar sin carrera.
rm -rf .next-viejo-* 2>/dev/null || true
# IndexNow: reenviar todas las URLs del sitemap tras cada deploy (no fatal).
sleep 5
node scripts/indexnow-submit.mjs >> /home/ubuntu/tuchat-indexnow.log 2>&1 || true
echo "[$(date -u +%FT%TZ)] indexnow enviado"
echo "[$(date -u +%FT%TZ)] deploy OK"
