# TuChat

Portal de chat global en español, orientado a SEO y tráfico orgánico long-tail:
salas por **países, ciudades y temáticas**, con landings de contenido único,
ranking por votos, hubs temáticos y generación de noticias multi-LLM.

Stack: **Next.js 16** (App Router, SSG/ISR), TypeScript, Tailwind, Vitest.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # rellena lo que necesites (todo es opcional salvo el client del webchat)
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (+ `postbuild` regenera el sitemap) |
| `npm start` | Sirve el build (Node) |
| `npm test` | Tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run generate:news` | Regenera `src/data/news.ts` con el pipeline multi-LLM |

## Arquitectura de datos

Todo el contenido vive en `src/data/` como datos tipados (`Place`), sin base de
datos: `countries.ts`, `cities.ts`, `cities-world.ts`, `topics.ts`,
`topics-extra.ts`, `news.ts`. `/chat/[slug]` prerenderiza cada sala.

## Funciones que usan integraciones externas

Todas degradan con elegancia: **funcionan sin configurar nada** y se activan al
definir las variables de `.env.example`.

- **Votos y ranking** (`/api/vote`, `/ranking`): los votos se guardan como
  incrementos sobre el conteo base. El almacén es conectable
  (`src/lib/votes-store.ts`):
  - **VPS dedicado** → store en fichero `.data/votes.json`, **durable** sin más.
  - **Serverless** → define `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`
    (Upstash Redis) y los usa automáticamente.
- **Noticias** (`npm run generate:news`): genera contenido editorial por
  categoría con Claude (primario) y OpenAI (fallback). Requiere `ANTHROPIC_API_KEY`.

## Despliegue en VPS (recomendado para este proyecto)

Un VPS dedicado es la opción más simple: hace durables los votos en fichero y
permite usar cron del sistema, sin servicios externos.

```bash
git clone <repo> && cd tuchat
npm ci
cp .env.example .env.local        # NEXT_PUBLIC_WEBCHAT_CLIENT_ID es lo único imprescindible
npm run build
npm start                         # escucha en :3000 (ponlo tras Nginx + TLS)
```

Recomendado: gestionar el proceso con **pm2** o un servicio **systemd**, y
servirlo detrás de **Nginx** como reverse proxy con HTTPS.

### Noticias automáticas (cron del VPS)

```cron
# /etc/crontab — cada día a las 05:00, regenera noticias y reconstruye
0 5 * * *  cd /ruta/tuchat && ANTHROPIC_API_KEY=... npm run generate:news && npm run build && pm2 restart tuchat
```

(Alternativa serverless/repo: el workflow `.github/workflows/generate-news.yml`
ya hace esto a diario y commitea `news.ts`; solo necesita el secret
`ANTHROPIC_API_KEY`.)

### SEO

`sitemap.xml` y `robots.txt` se generan en cada build (`next-sitemap`).
`/admin` y `/webchat` quedan excluidos. Recuerda apuntar `siteUrl` en
`next-sitemap.config.js` al dominio definitivo.
