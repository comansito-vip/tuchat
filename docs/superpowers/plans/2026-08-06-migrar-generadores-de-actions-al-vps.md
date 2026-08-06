# Migrar los generadores de GitHub Actions a los VPS

**Decisión del 2026-08-06:** los generadores de contenido no siguen en GitHub Actions —
no se va a pagar el plan. Cada web ejecuta los suyos en el VPS que la aloja.

**Motivo inmediato:** Actions está bloqueado por facturación en los 14 repos privados
(*"recent account payments have failed or your spending limit needs to be increased"*),
así que esos generadores llevan días parados. tuchat.org es repo público y por eso el suyo
sigue corriendo gratis, pero se migra igual por coherencia.

---

## Qué hay que migrar: 21 crons en 4 proyectos

| Proyecto | Workflows con `schedule:` | Estado hoy |
|---|---:|---|
| Portalchat | 12 (noticias ×2, horóscopo ×2, loterías, previas, SEO de salas ×4, deportes, tiempo) | parado |
| Chatcámara | 5 (noticias, horóscopo, loterías, deportes, curación) | parado |
| chatamigos | 3 (noticias, horóscopo, loterías) | parado |
| tuchat | 1 (noticias + curación) | funcionando (repo público) |

Los `ci.yml` y `deploy.yml` **no se tocan**: son de integración y despliegue, no generadores,
y en repo público no cuestan nada.

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

## Además, falta localizar dos servidores

El VPS `164.132.107.97` aloja **tuchat.org, chatbarcelona.es, chatligar.net y estoeschat.com**
(comprobado: `/var/www` y `pm2 list`). Pero **Portalchat, Chatcámara y chatamigos no están
ahí** — Portalchat despliega a `/var/www/portalchat.es` en un host que el workflow guarda como
secret `VPS_HOST`, y su IP no se puede resolver por DNS porque todo va tras Cloudflare.

Antes de migrar esos tres hay que averiguar en qué servidor viven y si tienen Node y cron
disponibles.

## Orden de trabajo propuesto

1. Localizar el servidor de Portalchat, Chatcámara y chatamigos.
2. Decidir A o B para tuchat (arriba).
3. Migrar tuchat primero: es el único con el generador vivo, así que sirve de banco de pruebas
   sin arriesgar contenido que ya no se está generando.
4. Portar los 20 crons restantes con el patrón de estoeschat, escalonando las horas: comparten
   las mismas claves de LLM y la cuota diaria de Groq y Cerebras es común a toda la red.
5. Registrar en cada repo qué cron quedó instalado y dónde, y borrar el workflow ya migrado
   para que no quede un generador fantasma.
