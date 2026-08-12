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
npm ci --silent
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
npm run build
/usr/lib/node_modules/pm2/bin/pm2 restart tuchat.org
# Ya nadie escribe en el .next viejo: se puede borrar sin carrera.
rm -rf .next-viejo-* 2>/dev/null || true
# IndexNow: reenviar todas las URLs del sitemap tras cada deploy (no fatal).
sleep 5
node scripts/indexnow-submit.mjs >> /home/ubuntu/tuchat-indexnow.log 2>&1 || true
echo "[$(date -u +%FT%TZ)] indexnow enviado"
echo "[$(date -u +%FT%TZ)] deploy OK"
