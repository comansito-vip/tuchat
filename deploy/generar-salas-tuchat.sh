#!/bin/bash
# Goteo diario de salas de localidad de tuchat.org.
#
# Publica un bloque de 50 al día y no más (el cliente lo subió de 12 a 50 el
# 2026-08-18, al ampliar la cobertura a los municipios de más de 4.000 habitantes
# de nueve comunidades y a México y Ecuador). Con la cola en miles de localidades
# siguen siendo meses, y esa es la idea: un sitio que aparece de golpe con miles
# de páginas de pueblos parece una granja de páginas puerta por buenas que sean
# las fichas.
#
# En la misma pasada salen las tres salas de término del día
# (scripts/cron/salas-termino.mjs): comparten checkout, lock, tests y build, así
# que hacerlo aquí evita un segundo ciclo de construcción diario.
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

# Arreglar va ANTES que añadir. Mientras queden fichas en rehacer.json —las 94
# que salieron con el párrafo inventado sobre la propia sala, ver
# scripts/localidades/curar-costura.mjs— el lote del día se gasta en
# reescribirlas y no se publica ninguna localidad nueva. Sumar páginas encima de
# un molde que hay que corregir solo multiplica el trabajo pendiente.
#
# Las fichas se reescriben EN SU SITIO: la URL no desaparece en ningún momento.
if [ -s data/localidades/rehacer.json ] && [ "$(tr -d '[] \n' < data/localidades/rehacer.json)" != "" ]; then
  echo "[$(date -u +%FT%TZ)] quedan fichas por rehacer: hoy no se publican salas nuevas"
  # Lote de 30 y no de 50: las claves de Groq son de la misma organización y
  # comparten el cubo de tokens por minuto, así que encadenar más solo produce
  # 429 seguidos. Con la pausa de diez segundos que mete el script, treinta
  # fichas son algo más de hora y media de cron.
  npx tsx scripts/cron/salas-geo.mjs --rehacer --lote 30
else
  npx tsx scripts/cron/salas-geo.mjs --lote 50
fi
npx tsx scripts/cron/salas-termino.mjs --lote 3

if [ -z "$(git status --porcelain src/data data/localidades data/terminos)" ]; then
  echo "[$(date -u +%FT%TZ)] ninguna sala nueva superó los controles"
  exit 0
fi

# Los tests son la última barrera antes de publicar: si el lote rompe una regla
# del sitio, mejor quedarse sin salas ese día que publicarlas mal.
npm test

git -c user.name="tuchat-bot" -c user.email="bot@tuchat.org" \
    commit -q -m "chore(salas): goteo diario de salas de localidad y de término" -- src/data data/localidades data/terminos

PUSHED=0
for intento in 1 2 3; do
  if git push --quiet origin main 2>/dev/null; then PUSHED=1; break; fi
  git pull --rebase --quiet origin main
done
[ "$PUSHED" -eq 1 ] || { echo "[$(date -u +%FT%TZ)] ERROR: no se pudo empujar"; exit 1; }

echo "[$(date -u +%FT%TZ)] reconstruyendo con las salas nuevas"
# `mv` y no `rm -rf`: borrar .next mientras pm2 escribe caché ISR dentro compite con
# el runtime y aborta con ENOTEMPTY, y con `set -e` el script muere sin construir.
# La explicación larga, con las dos veces que pasó, está en generar-noticias-tuchat.sh.
rm -rf .next-viejo-* 2>/dev/null || true
[ -d .next ] && mv .next ".next-viejo-$$"
npm run build
/usr/lib/node_modules/pm2/bin/pm2 restart tuchat.org
sleep 5
rm -rf .next-viejo-* 2>/dev/null || true
node scripts/indexnow-submit.mjs >> /home/ubuntu/tuchat-indexnow.log 2>&1 || true
echo "[$(date -u +%FT%TZ)] publicado ✓"
