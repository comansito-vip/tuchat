# Continuación — qué está hecho y qué toca ahora

Traspaso desde la sesión abierta en `trivialchat` (6-7 agosto 2026). Todo lo de
abajo está commiteado en `main` (`7cdb4d4`), con 399 tests, `tsc` y `eslint` en
verde. El análisis completo está en
[`2026-08-06-cobertura-salas-y-canales.md`](./2026-08-06-cobertura-salas-y-canales.md).

## Lo primero, porque cambia las prioridades

**El problema de tuchat.org no es de contenido, es de rastreo.** Inspeccionando
40 URLs con la API de Search Console:

| Estado | URLs |
|---|---:|
| Google no reconoce esta URL | 19 |
| Descubierta, actualmente sin indexar | 17 |
| Enviada e indexada | **4** |

36 de 40 **nunca han sido rastreadas**. Y no hay nada roto: robots.txt permite
todo, el sitemap tiene las 4.983 URLs y las incluye (`/chat/madrid` está), la
home enlaza a 127 salas y `/chat` a 733. Las 4 páginas que Google sí rastreó
están todas `ALLOWED / INDEXING_ALLOWED`.

La causa está en otro sitio: **ningún dominio de la red enlaza a tuchat.org.**
Comprobado — cero menciones en chatzona.com, chatzona.net y portalchat.es. Un
dominio nuevo sin un solo enlace entrante no recibe presupuesto de rastreo.

> **Acción de mayor retorno de todo este documento:** enlazar a tuchat.org desde
> chatzona.org (19,8 M impresiones) y canalchat.org (11,6 M). Es gratis, es de la
> propia red y sin ello lo demás rinde poco. Requiere tocar esos dominios, así
> que queda fuera de este repositorio.

Repetir el diagnóstico cuando se quiera: `php scripts/diagnostico-indexacion.php 40`.

## Hecho

- **Cron de goteo**: `npm run salas:cron` (12/día). 12 salas ya publicadas.
- **Cola**: 2.973 localidades con fuente, 1.377 con web de ayuntamiento.
  Regenerar con `npm run salas:cola` (~15 min).
- **Cobertura**: España 94 %, América >20.000 al 49 %; Colombia 53 %,
  Argentina 40 %, Uruguay 25 %, **Perú 16 %**. `npm run salas:cobertura`.
- **Corpus de demanda de la red** en `/home/javier/red-seo/` (68.305 consultas,
  18 dominios). `php /home/javier/red-seo/scripts/buscar.php <término>`.
- **city-regions.ts**: 962 ciudades americanas con su provincia/estado, que antes
  colgaban solo del país.

## Lo que toca ahora, por orden

1. ~~**Dar de alta el cron en el VPS.**~~ **HECHO el 2026-08-07.**
   `/home/ubuntu/generar-salas-tuchat.sh`, cron a las **03:40 UTC**, log en
   `generar-salas-tuchat.log`. Copia versionada en `deploy/`.

   Tres cosas que no estaban en la receta original y hacían falta:
   - **La ruta del VPS es `/var/www/tuchat.org`**, no `/home/javier/tuchat`.
   - **El script reconstruye y reinicia al terminar.** Commitea en el mismo
     checkout que sirve el sitio, así que al acabar el VPS ya está en
     `origin/main` y `deploy-tuchat.sh` se saltaría el build por su comprobación
     `LOCAL = REMOTE`: las salas se quedarían en git sin salir publicadas. Pasó
     con el cron de noticias el 2026-08-06 (`.next` quedó 15 minutos por detrás
     de `news.ts`).
   - **Comparte lock con los otros dos crons** (`/tmp/tuchat-pipeline.lock`).
     El deploy empieza con `git reset --hard`, que a mitad de una generación se
     lleva por delante lo escrito.

   Horario: 03:40, por delante de las noticias (05:00) y del deploy (05:30), y
   en el hueco anterior a los crons de estoeschat (04:10). Comparten claves de
   LLM y la cuota diaria de Groq y Cerebras es común a toda la red.

2. **Salas de estado de México.** Los seis slugs están libres, comprobado:
   `nuevo-leon`, `sonora`, `jalisco`, `yucatan`, `coahuila`, `sinaloa`. Suman
   ~188.000 impresiones y sus canales de IRC existen (`#nuevo_leon`, `#sonora`,
   `#jalisco`, `#yucatan`, `#coahuila`, `#sinaloa`). Con `city-regions.ts` ya
   tienen ciudades que colgar: jalisco 37, coahuila-de-zaragoza 6, nuevo-leon 4,
   sonora 3, sinaloa 3, yucatan 1.
   **Aviso:** las ciudades de Coahuila están bajo `coahuila-de-zaragoza` (nombre
   del censo). Si la sala se crea como `coahuila`, hay que alinear el slug en
   `mapear-regiones.mjs` o no agrupará nada.

3. **`chachipen`**, que es el mayor hueco de la red: 113.898 impresiones y
   **88.914 clics** sin una sola página, con `#chachipen` ya lleno. Sumando
   `gitano` (35.335) y `dikelame` (25.039), ~174.000 impresiones. El contenido
   tiene que escribirlo alguien que conozca el caló de verdad, no un LLM con una
   definición de diccionario.

4. **«chat gay de {ciudad}»** — Málaga, Medellín, Puebla, Monterrey, Cali, Lima,
   CDMX, Tijuana, Guadalajara, Vigo, Baleares. ~138.000 impresiones y el patrón
   ya existe (`gay-madrid`, `gaybarcelona`, `gaybogota`). En chatzona.org
   `chat gay` está en posición 8,7 con 342.835 impresiones: ahí sí hay un
   empujón que da top 10.

5. **Contrastar el censo de 5.000 con los institutos nacionales.** Lo que hay
   sale de Wikidata, que no es un padrón: Colombia tiene 1.103 municipios y el
   censo solo ve 607 por encima de 5.000. Es un suelo. DANE, INEI, INE-UY, INDEC.

6. **Revisar a mano** `data/localidades/revisar.json` (599 localidades con una
   sala a menos de 10 km) y `sin-fuente.json` (314 sin fuente utilizable).

## Cosas que conviene no volver a descubrir

- **No proponer salas de menores.** `adolescentes`, `13 a 18` y `12 a 15` suman
  ~45.000 impresiones y aun así están fuera: `irc-real-channels.ts` excluye
  `#de_13_a_18` «sin excepción». Está aquí escrito para que el número no tiente
  dentro de tres meses.
- **Una sala solo entra a canales de `irc-real-channels.ts`.** Las reglas están
  en `src/data/irc-canal.ts`, compartidas por el cron, `fix-irc-channels.ts` y
  `rehacer-canales.mjs`. No duplicarlas otra vez.
- **Salían como huecos y ya existen** (fallo de normalizador con singular/plural):
  `travestis`, `cornudos`, `sumisas`, `nudismo`, `trans`, `lesbianas`,
  `esoterismo`, `mas-de-50`, `mas-de-60`, `a-coruna`.
- **`gsc_all_sites()` no lista todas las propiedades accesibles**: `chatzona.org`
  y `chatvenezuela.net` responden aunque no aparezcan. `canalchat.org` no lo ven
  las credenciales — sus datos son un volcado a mano en
  `/home/javier/red-seo/data/volcados/`.
- La tasa de descarte del cron pasa de la mitad y **es intencionada**: el
  verificador tumba fichas por afirmaciones que la fuente no respalda. Cada
  localidad se reintenta tres días distintos antes de abandonarse, y un fallo de
  infraestructura no gasta intento.
