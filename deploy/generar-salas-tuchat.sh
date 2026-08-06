#!/bin/bash
# Goteo diario de salas de localidad de tuchat.org.
#
# Publica una docena al día y no más. Con ~2.900 localidades en cola son meses,
# y esa es la idea: un sitio que aparece de golpe con miles de páginas de pueblos
# parece una granja de páginas puerta por buenas que sean las fichas.
#
# Comparte el lock con la generación de noticias y con el deploy
# (/tmp/tuchat-pipeline.lock): los tres tocan el mismo checkout y el deploy hace
# `git reset --hard`, que a mitad de una generación se lleva por delante lo
# recién escrito.
#
# Reconstruye al final por lo mismo que el cron de noticias: commitea en el
# checkout que sirve el sitio, así que al terminar el VPS ya está en origin/main
# y deploy-tuchat.sh saldría por su comprobación `LOCAL = REMOTE` sin construir.
set -e
exec 9>/tmp/tuchat-pipeline.lock
flock -w 900 9 || { echo "[$(date -u +%FT%TZ)] pipeline ocupado; se salta"; exit 0; }

cd /var/www/tuchat.org

LOG=/home/ubuntu/generar-salas-tuchat.log
if [ -f "$LOG" ] && [ "$(stat -c%s "$LOG")" -gt 2097152 ]; then
  tail -c 500000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

echo "[$(date -u +%FT%TZ)] === goteo de salas ==="
git fetch origin main --quiet
git reset --hard origin/main --quiet

HUELLA=.git/npm-ci-lock-hash
ACTUAL=$(sha1sum package-lock.json | cut -d' ' -f1)
if [ ! -f "$HUELLA" ] || [ "$(cat $HUELLA)" != "$ACTUAL" ]; then
  npm ci --silent
  echo "$ACTUAL" > "$HUELLA"
fi

set -a
. ./.env
set +a

npx tsx scripts/cron/salas-geo.mjs --lote 3

if [ -z "$(git status --porcelain src/data data/localidades)" ]; then
  echo "[$(date -u +%FT%TZ)] ninguna sala nueva superó los controles"
  exit 0
fi

# Los tests son la última barrera antes de publicar: si el lote rompe una regla
# del sitio, mejor quedarse sin salas ese día que publicarlas mal.
npm test

git -c user.name="tuchat-bot" -c user.email="bot@tuchat.org" \
    commit -q -m "chore(salas): goteo diario de salas de localidad" -- src/data data/localidades

PUSHED=0
for intento in 1 2 3; do
  if git push --quiet origin main 2>/dev/null; then PUSHED=1; break; fi
  git pull --rebase --quiet origin main
done
[ "$PUSHED" -eq 1 ] || { echo "[$(date -u +%FT%TZ)] ERROR: no se pudo empujar"; exit 1; }

echo "[$(date -u +%FT%TZ)] reconstruyendo con las salas nuevas"
rm -rf .next
npm run build
/usr/lib/node_modules/pm2/bin/pm2 restart tuchat.org
sleep 5
node scripts/indexnow-submit.mjs >> /home/ubuntu/tuchat-indexnow.log 2>&1 || true
echo "[$(date -u +%FT%TZ)] publicado ✓"
