# Search Console de tuchat.org: 5 páginas indexadas de 3.311, y qué se saca de ahí

**Fecha:** 18 de agosto de 2026
**Encargo:** «revisa google search console por si sacas ideas», junto con la ampliación
de cobertura a los municipios de más de 4.000 habitantes de nueve comunidades, México y
Ecuador.

## El dato que manda sobre todos los demás

Propiedad `sc-domain:tuchat.org`, 90 días (20 may – 15 ago 2026):

| | |
|---|---:|
| Consultas distintas | 483 |
| Impresiones | 1.161 |
| Clics | 7 |
| **Páginas con alguna impresión** | **6** |
| URLs en el sitemap | 3.311 |

Seis. Las seis son `/`, `/chat`, `/anime`, `/chat/galicia`, `/chat/argentina` y la home sin
`www`. Todo lo demás —las 2.100 ciudades, las 590 temáticas, los 440 artículos— no ha
impreso ni una vez.

La inspección de URL lo confirma y además distingue dos situaciones distintas:

| URL | Veredicto | Último rastreo |
|---|---|---|
| `/` | Enviada e indexada | 18 ago |
| `/chat` | Enviada e indexada | 26 jul |
| `/chat/galicia` | Enviada e indexada | 15 jul |
| `/chat/argentina` | Enviada e indexada | 27 jul |
| `/anime` | Enviada e indexada | 1 ago |
| `/chat/madrid` | **Descubierta: actualmente sin indexar** | nunca |
| `/chat/monterrey` | **Descubierta: actualmente sin indexar** | nunca |
| `/chat/gaybarcelona` | **Descubierta: actualmente sin indexar** | nunca |
| `/chat/vigo` | **Google no reconoce esta URL** | nunca |

«Descubierta pero nunca rastreada» quiere decir que Google tiene la URL por el sitemap y
ha decidido no gastar rastreo en ella. No es un problema de contenido —no lo ha leído—,
ni de robots, ni de sitemap: el sitemap responde 200, pesa 484 KB y trae 3.311 `<loc>`,
y `robots.txt` no bloquea nada relevante. Es presupuesto de rastreo en un dominio joven.

Lo que sí se mueve, se mueve despacio pero en la dirección buena:

| Periodo | Páginas con impresiones | Impresiones | Clics |
|---|---:|---:|---:|
| 20 jun – 18 jul | 3 | 328 | 8 |
| 18 jul – 15 ago | 6 | 1.103 | 19 |

## La idea que sale de los datos: el dominio rankea por «org»

De las 483 consultas, **32 están ya en el top 25**. Casi todas comparten una cosa:

| Consulta | Impresiones | Posición |
|---|---:|---:|
| chat gratis org | 52 | 13,4 |
| salas de chat org | 6 | 7,7 |
| chat org sevilla | 5 | 6,8 |
| mazmorra chat org | 4 | 9,2 |
| chat gratis.org | 3 | 10,3 |
| chat amigos org | 3 | 11,0 |
| latin chat org | 3 | 13,0 |
| chat gratis ecuador org | 2 | 4,0 |
| chat online org | 2 | 23,0 |
| latinchat org | 1 | 9,0 |
| chateando gratis org | 1 | 3,0 |
| chat tjb org | 1 | 4,0 |

Y las que no llevan «org» están en la posición 60 o peor: «chat gratis» en la 63,4, «chat
online gratis» en la 65,4, «chats gratis» en la 65,1.

La lectura es clara. Hay un grupo de gente que busca un chat que recuerda por su dominio
`.org` y escribe la palabra en la consulta. Ahí la competencia está despejada y tuchat.org
ya entra al top 10 casi sin ayuda. En el término genérico, en cambio, el dominio todavía no
pinta nada.

**Lo interesante es qué páginas imprimen por esas consultas: siempre la home.** «mazmorra
chat org» la imprime `/`, no `/chat/mazmorra`, que existe. «chat org sevilla» la imprime
`/`, no `/chat/sevilla`, que existe. Es decir: **las salas que la gente busca ya están
escritas, pero Google no las ha rastreado, así que le adjudica la consulta a la única
página que conoce.**

## Qué significa esto para la ampliación de cobertura

El cuello de botella de tuchat.org hoy **no es tener pocas páginas**. Tiene 3.311 y Google
solo mira 5. Añadir 278 municipios españoles más México y Ecuador sube el sitemap sin
tocar el número que importa, y alarga la cola de «descubiertas y sin rastrear».

Esto no es motivo para no hacerlo —el catálogo hay que tenerlo, y cuando el rastreo se
abra tiene que haber algo que rastrear—, pero sí para saber que **el ritmo de publicación
no es la palanca**. La palanca son las cosas que hacen que un dominio joven gane rastreo:
enlaces desde fuera, que las pocas páginas indexadas ganen clics de verdad, y tiempo.

Un aviso concreto sobre el ritmo: pasar el goteo de 12 a 50 al día multiplica por cuatro
la entrada de URLs nuevas en una cola que Google ya no está atendiendo. Es una decisión
legítima —el catálogo se llena antes— pero conviene tomarla sabiendo que no acelera la
indexación, y que el riesgo que tenía el goteo lento (parecer una granja de páginas) sube
con el volumen diario.

## Lo que sí está bien y no hay que tocar

- El 301 de `tuchat.org` a `www.tuchat.org` funciona, también en rutas internas. Las
  impresiones que todavía figuran a nombre del apex son históricas y se consolidarán solas.
- `sitemap.xml` y `sitemap-0.xml` responden 200 con `application/xml`.
- `robots.txt` permite todo salvo `/admin` y `/api`, y da paso explícito a GPTBot,
  OAI-SearchBot y demás.

## Fuentes

Todo sale de la API de Search Console con el cliente de
`/home/javier/chatargentina/includes/gsc.php` (dos service accounts, permiso Completo).
Los scripts de consulta quedaron en el scratchpad de la sesión; se rehacen en dos minutos
contra ese cliente.

## La ampliación de cobertura: qué entró y qué falta

`scripts/localidades/preparar-dataset.mjs` pasa a tener **umbral mixto en España**: sigue
en 8.000 habitantes con carácter general y baja a 4.000 en las nueve comunidades pedidas
(Galicia, Comunidad Valenciana, Asturias, País Vasco, Castilla y León, Extremadura,
Canarias, Islas Baleares y Cataluña). Se lee del censo `es-municipios-3k.json`, que es
padrón del INE y contiene al de 8.000, así que un solo filtro da los dos cortes.

Cola resultante: **3.715 localidades**, frente a las 2.973 de antes.

| Origen | En cola |
|---|---:|
| `am20k` — América ≥20.000 | 1.277 |
| `pais4k` — México y Ecuador ≥4.000 | 1.237 |
| `pais5k` — Colombia, Perú, Uruguay, Argentina ≥5.000 | 853 |
| `es4k` — nueve comunidades, 4.000-8.000 | 293 |
| `es8k` — España ≥8.000 | 55 |

Por país, los tres primeros son México (1.381), Argentina (393) y España (348), con
Ecuador cuarto (292).

**Lo que falta y por qué:** el censo de México y Ecuador se construye con
`scripts/localidades/censo-mx-ec.mjs`, que junta dos fuentes. La de 10.000 para arriba ya
estaba descargada (1.473 mexicanas y 276 ecuatorianas, con enlace a Wikipedia y web
oficial). La franja de **4.000 a 10.000 no se pudo bajar**: el servicio de consultas de
Wikidata estuvo devolviendo 500, 502 y 504 toda la tarde del 18 de agosto, y de ocho
tramos de población solo entró uno con 74 filas. Queda
`scripts/localidades/fetch-censo-wikidata.mjs` en el repo para rehacerlo cuando el
servicio vuelva:

```bash
node scripts/localidades/fetch-censo-wikidata.mjs Q96  mexico  /home/javier/estoeschat/data/mx-4k.json
node scripts/localidades/fetch-censo-wikidata.mjs Q736 ecuador /home/javier/estoeschat/data/ec-4k.json
node scripts/localidades/censo-mx-ec.mjs
npx tsx scripts/localidades/preparar-dataset.mjs
```

La cola bajó de 2.973 a 2.478 antes de sumar lo nuevo, y conviene explicar por qué para
que no parezca una pérdida: de las 788 que salieron, **686 eran divisiones
administrativas** («Distrito de Comas», «Partido de Luján») que el propio cron rechaza y
cuyo asentamiento base ya está publicado, y las otras 102 las había publicado el goteo
desde la última vez que se armó la cola.

## Una cosa que conviene mirar antes de subir a 50 al día

El ensayo en seco del generador sobre la cola nueva devolvió esto para Salas (Asturias):

> «Únete al chat de Salas, la Puerta del Occidente de Asturias, y conoce a personas de esta
> localidad asturiana para compartir recuerdos y novedades.»
> «En la sala de chat de Salas, podrás conocer a personas que viven o visitan esta
> localidad asturiana. Hablarán sobre sus intereses, hobbies y experiencias en Salas…»

Los controles la dejan pasar —no lleva ninguna muletilla de la lista, no abre con un
imperativo de los vetados y cumple las longitudes—, pero «podrás conocer a personas que
viven o visitan esta localidad» es exactamente la costura de relleno que el cliente lleva
tiempo pidiendo evitar. A doce al día se corrige a mano; a cincuenta, no. Si se va a
mantener el ritmo, merece la pena endurecer antes la lista de muletillas con las fórmulas
de este tipo («podrás conocer a personas», «para compartir recuerdos», «sus intereses,
hobbies y experiencias»).
