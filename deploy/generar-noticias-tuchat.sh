#!/bin/bash
# Generación diaria de noticias de tuchat.org, en el VPS.
#
# Sustituye al workflow de GitHub Actions: Actions quedó bloqueado por facturación
# en los repos privados y se decidió (2026-08-06) que cada web genere en su propio
# servidor. tuchat es repo público y allí seguía funcionando, pero se migra por
# coherencia con el resto de la red.
#
# El commit se empuja con la deploy key ~/.ssh/tuchat_deploy (alias
# github.com-tuchat). Hace falta porque las noticias viven en src/data/news.ts,
# que está versionado: sin push, el `git reset --hard origin/main` del deploy
# borraría lo generado.
#
# Corre a las 05:00 UTC; deploy-tuchat.sh a las 05:30 recoge el commit y
# reconstruye. Los dos usan flock, y con media hora de separación no se solapan.
set -e
# Lock COMPARTIDO con deploy-tuchat.sh: ambos manipulan el mismo checkout.
#
# La espera era de 10 minutos y el 11 de agosto de 2026 eso costó un día de
# noticias: el goteo de salas se alargó hasta las 05:49 —los proveedores LLM
# estaban con la cuota agotada y cada localidad reintenta con todos antes de
# rendirse— y a las 05:10 este script se encontró el lock ocupado y se saltó.
# Con 40 minutos espera en vez de abandonar; si aun así no lo consigue, el
# problema es otro y saltarse el día es lo correcto.
exec 9>/tmp/tuchat-pipeline.lock
flock -w 2400 9 || { echo "[$(date -u +%FT%TZ)] el pipeline sigue ocupado tras 40 min; se salta"; exit 0; }

LOG=/home/ubuntu/generar-noticias-tuchat.log
# Sin esto el log crece sin fin: se conserva la última parte y se recorta el resto.
if [ -f "$LOG" ] && [ "$(stat -c%s "$LOG")" -gt 2097152 ]; then
  tail -c 500000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

cd /var/www/tuchat.org

echo "[$(date -u +%FT%TZ)] === generación de noticias ==="

# Partir del estado remoto: el build del deploy deja modificado public/sitemap-0.xml,
# que está trackeado, y con el árbol sucio el commit arrastraría ruido.
git fetch origin main --quiet
git reset --hard origin/main --quiet

# Si el reset trajo dependencias nuevas, instalarlas: si no, el generador correría
# con el node_modules de la versión anterior. npm ci completo tarda, así que solo
# se lanza cuando package-lock.json ha cambiado desde la última instalación.
HUELLA=.git/npm-ci-lock-hash
ACTUAL=$(sha1sum package-lock.json | cut -d' ' -f1)
if [ ! -f "$HUELLA" ] || [ "$(cat $HUELLA)" != "$ACTUAL" ]; then
  echo "[$(date -u +%FT%TZ)] package-lock cambió: npm ci"
  npm ci --silent
  echo "$ACTUAL" > "$HUELLA"
fi

# Las claves LLM viven en .env (no en el entorno del cron).
set -a
. ./.env
set +a

npm run generate:news

# La curación sale con 1 cuando la auditoría deja avisos que necesitan criterio
# humano. Eso es información, no un fallo: no debe frenar la publicación.
npm run curar || true

# Antes de commitear, las mismas reglas que exigía el workflow. Si el contenido
# del día rompe una regla del sitio (por ejemplo quedarse sin noticia destacada),
# es mejor no publicar que publicar roto.
npm test

if [ -z "$(git status --porcelain src/data)" ]; then
  echo "[$(date -u +%FT%TZ)] sin cambios en src/data"
  exit 0
fi

git -c user.name="tuchat-bot" -c user.email="bot@tuchat.org" \
    commit -q -m "chore: noticias diarias y curación de contenido" -- src/data

# Reintento con rebase: si algo se pushea a main mientras esto corre (~15 min),
# el push se rechaza y se perdería la generación del día.
PUSHED=0
for intento in 1 2 3; do
  if git push --quiet origin main 2>/dev/null; then
    echo "[$(date -u +%FT%TZ)] push OK (intento $intento) → $(git rev-parse --short HEAD)"
    PUSHED=1
    break
  fi
  echo "[$(date -u +%FT%TZ)] push rechazado; rebase y reintento"
  git pull --rebase --quiet origin main
done

if [ "$PUSHED" -eq 0 ]; then
  echo "[$(date -u +%FT%TZ)] ERROR: el push falló tras 3 intentos"
  exit 1
fi

# Reconstruir AQUÍ y no dejárselo al deploy de las 05:30. El commit se ha hecho en
# este mismo checkout, así que el VPS ya está en origin/main y deploy-tuchat.sh sale
# por su comprobación `LOCAL = REMOTE` sin construir nada: el contenido se quedaría
# en git sin llegar nunca al sitio. Pasó el 2026-08-06 en la primera prueba — .next
# quedó 15 minutos por detrás de news.ts.
echo "[$(date -u +%FT%TZ)] reconstruyendo con el contenido nuevo"
# .next se aparta con `mv`, NO con `rm -rf`, y esto es lo menos evidente del script.
#
# pm2 sigue sirviendo mientras nosotros construimos, y cada visita que dispara ISR
# escribe un .html dentro de .next/server/app. `rm -rf` vacía el directorio y luego
# hace rmdir; si en ese hueco entra una visita, el rmdir falla con ENOTEMPTY, y como
# aquí hay `set -e`, el script muere ANTES de construir y de reiniciar. El sitio se
# queda con .next medio borrado, sin BUILD_ID ni manifests, sirviendo sólo desde la
# memoria del proceso vivo: en pie hasta el primer restart, y luego caído.
#
# Pasó el 2026-08-05 (rmdir de .next/server/app/chat/asturias.segments) y se leyó como
# un problema de build incremental; el remedio de entonces —borrar entero— corría la
# misma carrera y volvió a pasar el 2026-08-12, dejando /tiempo en 500 toda la mañana.
#
# `mv` es un rename() atómico: no recorre el directorio, así que no hay ventana que
# perder. El viejo se borra después del restart, cuando ya nadie escribe en él.
rm -rf .next-viejo-* 2>/dev/null || true
[ -d .next ] && mv .next ".next-viejo-$$"
npm run build
/usr/lib/node_modules/pm2/bin/pm2 restart tuchat.org
sleep 5
rm -rf .next-viejo-* 2>/dev/null || true
node scripts/indexnow-submit.mjs >> /home/ubuntu/tuchat-indexnow.log 2>&1 || true
echo "[$(date -u +%FT%TZ)] publicado ✓"
exit 0
