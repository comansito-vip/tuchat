# Generación de contenido en el VPS

Copia versionada de lo que corre en producción. **La fuente de verdad es el VPS**
(`164.132.107.97`, usuario `ubuntu`); esto está aquí para no depender de que el
servidor siga en pie para saber qué hacía, y para poder revisar los cambios en el
historial. Si tocas el script en el VPS, actualiza también esta copia.

## Qué hay instalado

| Ruta en el VPS | Cuándo | Qué hace |
|---|---|---|
| `/home/ubuntu/generar-noticias-tuchat.sh` | cron, 05:00 UTC | genera noticias, cura, pasa los tests, commitea, empuja y **reconstruye** |
| `/home/ubuntu/deploy-tuchat.sh` | cron, 05:30 UTC | despliega si `origin/main` trae commits nuevos (los hechos desde fuera del VPS) |

Logs: `generar-noticias-tuchat.log` y `deploy-tuchat.log` en `/home/ubuntu/`.

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
