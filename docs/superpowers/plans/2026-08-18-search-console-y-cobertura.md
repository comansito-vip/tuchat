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

El sitemap tenía 5.261 URLs hasta el 17 de agosto: sacar las 1.966 páginas de `/tiempo`
ya está hecho y contado aquí.

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

## Lo que apareció al revisar de verdad las fichas publicadas: la costura

La nota de arriba sobre Salas (Asturias) se quedó corta. Medido sobre las 107 salas que
llevaba publicadas el cron:

| | |
|---|---:|
| Con la frase «(en) la sala de chat de {X}» | **83 (78 %)** |
| Con «sobre la vida cotidiana» o «temas de interés general» | 48 |
| Que conservan 100 palabras al quitar el párrafo sobre la sala | **16** |

No es una muletilla suelta: es un **párrafo entero, y es la mitad de la ficha**. Siempre el
mismo, siempre al final, siempre con el nombre del pueblo cambiado:

> «En la sala de chat de {LOCALIDAD} los {vecinos/usuarios/residentes}
> {comparten/intercambian} información sobre la vida cotidiana, eventos locales y temas de
> interés general.»

Es el mismo molde que costó la reescritura de `copy.ts` en agosto, esta vez dentro del
texto que escribe el LLM en lugar de en la plantilla.

**La causa no era el modelo, era el encargo.** El prompt pedía literalmente «Después, de
qué se habla en su sala y quién entra», que es un dato que no existe en ninguna parte; y
el verificador tenía instrucción expresa de no marcarlo («Lo que la ficha dice sobre la
propia sala de chat […] nunca va a estar en la fuente»). El generador pedía relleno y el
control lo eximía.

Corregido en tres sitios:

1. **El prompt** (`salas-geo.mjs`): la ficha va entera sobre el lugar y las ocho fórmulas
   quedan prohibidas por su nombre. La `intro` ya no pide «menciona que es la sala de chat
   de X», que era la que producía la fórmula.
2. **El verificador**: describir la sala pasa de estar exento a estar en la lista de
   problemas.
3. **`MULETILLAS_IA`**: las ocho fórmulas entran en la lista que comparten generador,
   auditoría y curador. Contrastadas sobre las 2.727 salas del catálogo antes de añadirlas:
   78 aciertos, 77 del cron y uno la intro de `madrid`, que llevaba la misma fórmula vacía
   y se ha reescrito.

**La reparación no tira ninguna URL abajo.** `salas-geo.mjs --rehacer` lee
`data/localidades/rehacer.json` y reescribe la ficha *en su sitio*, conservando slug,
canales, vecinas y números de sala; solo cambia el texto. Una página que aparece y
desaparece es peor señal que una ficha mejorable. Y el cron gasta el lote diario en
rehacer mientras queden pendientes: **arreglar va antes que añadir**.

Van 94 fichas en cola de rehacer, a 50 por noche: dos pasadas.

### De paso: once salas con nombre de expediente

Wikidata nombra a muchos municipios por su envoltorio legal, y ese nombre llegaba hasta el
título de la sala: `/chat/partido-de-tandil`, `/chat/distrito-de-paita`,
`/chat/area-metropolitana-de-piura`. Nadie busca «chat partido de tandil».

Seis de las once eran además **el mismo pueblo que una sala que ya existía** —Tandil,
Olavarría, San Miguel, San Martín, Piura y José C. Paz—, o sea dos URLs para el mismo
sitio. Esas se borran y redirigen; las otras cinco se renombran, más `ventanilla-`, que
tenía un guion suelto en el slug. Los doce redirects están en el mapa `renamed` de
`next.config.ts`.

Corregido en el origen: `preparar-dataset.mjs` limpia el prefijo antes de encolar. La
preposición es obligatoria en el patrón, o «Gran Canaria» se quedaba en «Canaria» y
«Distrito Federal» en «Federal».

### Wikidata no tiene la franja de 4.000 a 10.000

Segundo intento por la tarde, con el servicio ya respondiendo: de ocho tramos de población,
México devolvió 67 localidades y Ecuador 20. No es solo que el servicio fuera inestable —es
que Wikidata no tiene la población de la mayoría de localidades pequeñas de esos dos
países. Para completar ese corte hace falta el padrón real: **INEGI** para México e **INEC**
para Ecuador. Los scripts quedan en el repo para cuando haya dataset.

## Segunda ampliación: siete países de América con corte en 4.000

Encargo posterior de la misma sesión: México, Ecuador, Guatemala, República Dominicana,
Uruguay, Colombia y Chile. `censo-paises.mjs` (antes `censo-mx-ec.mjs`) arma el censo de
los siete juntando la franja de 10.000 arriba —ya descargada, con enlace a Wikipedia y web
oficial— con la de 4.000 a 10.000, que hay que bajar de Wikidata por tramos.

Cola resultante: **3.337 localidades**, de las cuales 1.623 son de los siete países.

| País | En cola |
|---|---:|
| México | 752 |
| Colombia | 234 |
| Guatemala | 225 |
| Ecuador | 147 |
| Chile | 121 |
| República Dominicana | 94 |
| Uruguay | 50 |

### El fallo que apareció al medirla: 626 localidades repetidas

La cola tenía **626 localidades duplicadas**, y no era culpa de la ampliación: venía de
antes. `ayabaca` (Perú) salía cuatro veces —`ayabaca`, `ayabaca-peru`,
`ayabaca-departamento-de-piura` y la de América—, `puente-piedra` dos, `gonzalez-catan`
dos.

El motivo es estructural: los cuatro bloques de la cola se construyen por separado y cada
uno solo comprueba contra lo **ya publicado**, no contra lo que han encolado los otros. Y
como el desambiguador le pone un sufijo distinto a cada copia, el filtro de slug deja de
verlas iguales. Publicar eso son cuatro páginas del mismo pueblo en el mismo dominio, que
es la definición de contenido duplicado.

Criba nueva, por país y nombre normalizado:

- si todas las del grupo traen coordenadas, se separan en corros de 25 km — dos «San José»
  a 300 km son dos pueblos de verdad y los dos se quedan;
- si a alguna le faltan, el grupo entero cuenta como una. Conservador a propósito: sin
  coordenadas no hay forma de distinguir el homónimo del duplicado, y de los dos errores
  posibles, publicar dos veces el mismo pueblo es el que hace daño.

Gana la que tenga fuente y, a igualdad, la de más población; las desplazadas van a
`revisar.json` con el nombre de quién las desplazó, no se tiran.

Resultado: de 626 repetidas a **2 slugs repetidos**, y los dos son del mismo país a
propósito (`rio-bravo` en México con 28 km entre las dos fichas, `huancabamba` en Perú).
Ahí el cron publica la primera y salta la segunda, que es el comportamiento que se busca.
Los choques entre países sí se desempatan con el sufijo del país: `nava` es un concejo
asturiano y un municipio de Coahuila, y las dos merecen su página.

### Wikidata: el 504 no significa que no haya datos

La primera tanda devolvía 74 filas en el tramo de 4.000-5.000 y cero en el siguiente. Ese
cero se habría leído como que México no tiene pueblos de 5.000 a 6.500 habitantes, y lo
que quiere decir es que la consulta no cabe en el minuto que da el servicio.
`fetch-censo-wikidata.mjs` ahora **parte el tramo en dos** tras tres fallos y pide cada
mitad por separado, hasta un ancho mínimo de 250 habitantes.

Aun así, conviene no confundir esto con cobertura completa: los padrones reales son el del
INEGI, el INEC, el INE guatemalteco, la ONE dominicana, el INE uruguayo, el DANE y el INE
chileno. Lo que sale de Wikidata es un suelo.
