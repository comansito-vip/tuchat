# Lo que quedó de la revisión cortada, y la sala que faltaba

**Fecha:** 2026-08-13
**Resumen:** producción estaba sana y desplegada (el susto de las fechas era el
VPS en UTC); se cierra el hueco de «chat merida», se tapa la única ruta del
sitio que devolvía 200 a cualquier slug inventado y se limpia la última
muletilla de IA del catálogo.

---

## Primero: no había nada roto

La sesión anterior se cortó después de dos commits (el recorte de `<title>` de
los artículos y el correo de contacto) y quedaba la duda de si llegaron a
publicarse. A primera vista parecía que no:

```
git log -1   → d30a2c7 (17:26 CEST)
ls .next/BUILD_ID → 12 ago 15:29
```

Un build anterior al commit es exactamente la firma de la caída del 12 de
agosto, así que merecía comprobarse en vez de darlo por bueno. **No lo era: el
VPS escribe en UTC.** 15:29 UTC son las 17:29 CEST, tres minutos después del
commit. El deploy había corrido entero.

Comprobado por el contenido servido, que es lo único que no admite
interpretación:

| Comprobación | Resultado |
|---|---|
| `/contacto` | sirve `info@chatzona.org` |
| `<title>` de un artículo de 96 caracteres | recortado a 65 con elipsis |
| `tituloArticuloSerp` en los chunks compilados | presente |
| 14 rutas clave por HTTP | 200 todas |
| 404 cacheados en disco | uno, `/noticias/articulo/null`, que es un 404 correcto |

**Para la próxima vez, la regla corta:** antes de diagnosticar un build viejo
por la fecha de `BUILD_ID`, restarle dos horas — o mejor, no mirar la fecha y
preguntarle al HTML si lleva el cambio dentro.

## `/chat/merida`: 52.339 impresiones que no tenían página

Era el hueco medido que el informe de ayer dejó «a la espera». La razón para no
dejarlo más tiempo es que Mérida **es la excepción del catálogo**: en el resto
de homónimos el slug limpio se lo queda una ciudad —`cordoba`, `valencia`,
`guadalajara` son las españolas y las americanas llevan sufijo—, pero las tres
Méridas están desambiguadas (`merida-espana`, `merida-mexico`,
`merida-venezuela`) y el nombre a secas se quedó sin nadie.

Aquí tampoco se le adjudica a ninguna, porque la página responde a otra cosa: a
**por qué se llaman igual**, que es la pregunta que trae quien escribe el término
ambiguo. Y la respuesta es real y verificable:

- Roma funda la primera en el 25 a. C. por orden de Augusto, como asentamiento
  de los soldados licenciados —*eméritos*— de las legiones V Alaudae y X Gemina.
  De ahí *Emerita Augusta*, y de ahí el nombre de las tres.
- La de Yucatán la levanta Francisco de Montejo «el Mozo» en 1542 sobre los
  vestigios de T'Hó, y le pone ese nombre porque las ruinas mayas le recordaron
  a las romanas de la extremeña.
- La venezolana la funda Juan Rodríguez Suárez el 9 de octubre de 1558; había
  nacido hacia 1510 en la propia Mérida de Extremadura y le puso a su ciudad el
  nombre de la suya.

### La pasada de verificación cambió cuatro cosas, y una importaba

Un agente independiente con el único encargo de refutar revisó el texto contra
Wikipedia, Wikidata y la tzdata del sistema. Confirmó lo grueso (fechas,
fundadores, legiones, etimología, los tres husos horarios) y corrigió:

| Se escribió | Por qué no se sostenía | Quedó |
|---|---|---|
| «ronda los 330.000» (Mérida VE) | es una **proyección**; el último censo real es de 2011 (217.537) | «supera los 300.000 según las proyecciones oficiales» |
| «nacido en 1510» | fecha convencional, como casi todas las del XVI | «nacido hacia 1510» |
| «Hay tres ciudades que se llaman Mérida» | hay una cuarta en Filipinas | «Tres ciudades comparten el nombre» |
| «cinco cerros» en maya | la traducción varía según la fuente | «que se suele traducir como…» |

El de la población venezolana es el que habría quedado mal: es la clase de cifra
que se copia de la ficha de Wikipedia sin ver que dice «proyección».

### Lo que destapó al construirla: «Mérida, Mérida, Mérida»

La sala nueva sacó a la luz un fallo que llevaba tiempo ahí. Su FAQ salía así:

> Las más cercanas son **Mérida, Mérida, Mérida** y Amistad.

Las tres salas relacionadas son las tres Méridas, y las tres se llaman «Mérida»
a secas. El sitio ya tenía resuelto el problema —`roomName()` cualifica los
homónimos con su provincia o su país, y es lo que usan el `<title>` y el H1—,
pero el copy generado tiraba de `place.name` en las cuatro listas de salas
relacionadas. Ahora dice «Mérida (Yucatán), Mérida (Venezuela), Mérida
(Badajoz)».

Barrer las 2.685 salas con esa comprobación destapó un segundo caso, este de
datos: **Jávea enlazaba dos veces con Benissa**, y el bullet lo cantaba igual
(«Salas cercanas en el portal: Benissa, Benissa, Teulada…»). El hueco se lo lleva
Dénia, el municipio vecino por el norte, que no estaba enlazado. Es el único
related duplicado del catálogo entero.

Dos tests nuevos lo fijan. El segundo —que los related de una sala no colisionen
de nombre una vez cualificados— vigila el dato, que es por donde puede volver a
romperse: basta añadir un homónimo nuevo al catálogo.

**La lección de método:** esto no lo encontró ningún test ni ninguna auditoría,
sino leer el HTML que salió del build. Las comprobaciones automáticas miran lo
que se les dijo que mirasen; el texto generado hay que leerlo.

## La única puerta que quedaba abierta: `/noticias/[categoria]`

Una auditoría de metadatos sobre las 5.180 páginas del sitio salió limpia
—0 títulos largos, 0 descripciones duplicadas, canónicas correctas— con **una**
excepción, y esta sí valía la pena:

```
https://www.tuchat.org/noticias/categoria-inventada-xyz  →  HTTP 200
<title>Noticias de Categoria inventada xyz · TuChat</title>
```

La ruta tenía `generateStaticParams` pero no cerraba lo que queda fuera, así que
cualquier slug devolvía un 200 indexable con canónica autorreferente. Era la
última del sitio en ese estado: `/chat` y el horóscopo hacen `notFound()`, y
`/tiempo` y las loterías cierran con `dynamicParams = false`, que es lo que se
ha puesto aquí.

Hoy no afectaba a ninguna URL conocida. Importa por lo que puede pasar, no por
lo que pasa: un dominio que aún pelea por que Google le rastree lo que ya tiene
escrito no puede permitirse un espacio infinito de páginas que nadie ha escrito,
y basta un enlace basura externo para empezar a llenarlo. Un test lo fija.

### Lo que se vio y NO se ha tocado

Las 1.965 descriptions de `/tiempo` son únicas de verdad porque salen de la
previsión real (Madrid «36 °C y cielo despejado…», Soria «34 °C…»). Pero el
fallback de `weatherMetaDescription` para cuando no hay datos —`src/lib/weather.ts`—
emite la misma frase salvo el nombre. Si Open-Meteo fallara durante un build,
el 38% del sitemap saldría con description de plantilla.

No se cambia: hoy funciona, y no se toca el comportamiento de 1.965 páginas por
un fallo que no se ha visto ocurrir. Queda escrito para que, si algún día la
auditoría empieza a avisar de plantilla en `/tiempo`, se busque aquí y no en el
generador.

## `/chat/illes-balears`

3.761 impresiones en el corpus, posición 6,6, con cinco dominios de la red dentro
y tuchat.org fuera. Entra a **#baleares**, que es el mismo canal: no se inventa
uno nuevo para la misma gente.

La trampa aquí era escribir una segunda página sobre las calas, la rivalidad
entre islas y la ensaimada, que es lo que ya cuenta `baleares`: dos versiones de
lo mismo y Google se queda con una. Así que cuenta lo que el nombre oficial trae
consigo, el **artículo salat**: en las islas el artículo no es «el» y «la» sino
«es» y «sa» —es Mercadal, sa Pobla, Sant Llorenç des Cardassar—, y viene del
demostrativo latino *ipse*, no del *ille* del que salieron el castellano y el
catalán continental.

Se escribió primero en `topics-regiones.ts` y un test la echó de allí: ese fichero
es el de las comunidades que agrupan ciudades, y exige que cada una tenga
localidades con su `regionSlug`. Las baleares cuelgan de `baleares`, así que la
sala rompía el contrato. Vive en `topics-terminos.ts`, con Mérida.

## La última muletilla del catálogo

El auditor de contenido encontró un aviso en 2.684 salas: `la-pintana` cerraba
la intro con «Únete a la conversación local». De paso se cambió el bloque de
about, que era plantilla pura («los usuarios comentan temas cotidianos como
transporte, seguridad, servicios municipales…»), por lo que de verdad distingue
a esa comuna: el fundo de la familia del presidente Aníbal Pinto que le da
nombre, los Huertos Obreros de 1942 de los que salieron Villa La Pintana, Villa
Las Rosas y Mapuhue, y el campus Antumapu de la Universidad de Chile.

Auditoría **a cero avisos** tras el cambio.

## Por qué el build tardaba 20 minutos

Medido sobre el deploy de las 23:15, no estimado:

| Fase | Tiempo |
|---|---|
| Compilar el código | 62 s |
| Generar las 5.178 páginas | **18,6 min** (1 worker) |
| **Total** | **20 min 39 s** |

**El código no era el problema.** El tiempo se iba esperando a Open-Meteo:
`/tiempo` son 1.965 páginas y cada una pedía su previsión por separado con 700 ms
de separación obligatoria, que es lo que impone `MIN_MS_ENTRE_PETICIONES` para no
comerse un 429. Son 23 minutos de reloj con el worker parado.

Y con **un** worker, porque Next los calcula como `max(1, CPUs − 1)` y el VPS
tiene 2 núcleos. Se comprobó en el código de Next, no de oídas
(`node_modules/next/dist/server/config-shared.js`). La RAM no pintaba nada: en
reposo hay 2,5 GB libres.

### Lo que se hizo

Open-Meteo acepta **varias coordenadas en la misma petición** y devuelve un array
en el mismo orden. Medido contra la API real: 100 localidades con los campos que
usa el sitio tardan 0,75 s y ocupan 80 KB. Así que un `prebuild` deja caliente la
caché de `.data/weather` que `fetchWeather()` ya sabía leer, y el build no espera
nada. No se toca ni la página ni el limitador.

**Resultado, medido en el VPS:**

| | Antes | Después |
|---|---|---|
| Compilación | 62 s | 56 s |
| Generación de páginas | 18,6 min | **2,6 min** |
| Deploy completo | 20 min 39 s | **4 min 14 s** |

De paso, el deploy hacía `npm ci` en todos los despliegues aunque no cambiara una
dependencia; era el único de los tres scripts sin la comprobación de huella.

### El incidente que enseñó lo importante

Al lanzar el primer prefetch en el VPS, Open-Meteo respondió **`Daily API request
limit exceeded`**. El plan gratuito son 10.000 llamadas al día y cada build se
lleva 1.965; entre los builds del día y las pruebas, se agotó.

Eso obligó a parar el deploy a medias —con `.next` ya apartado y pm2 sirviendo de
memoria— y a restaurar a mano el build anterior. El sitio no llegó a caerse.

Lo importante es lo que destapó: **el diseño pedía las 1.965 previsiones en cada
build**, y con tres builds diarios eso son 5.900 llamadas de las 10.000. Cuando se
agotan no falla el build, fallan los datos: las páginas salen con «Sin datos
meteorológicos disponibles» bajo un `<h1>` que promete la previsión. Ya había
pasado el 10 de agosto con 1.332 páginas.

Arreglado subiendo el TTL de la caché de 3 a **24 horas**, que es lo que
corresponde al dato: la previsión es a cinco días y no cambia de un build al
siguiente. Ahora solo pide el primer build del día. La temperatura de «ahora», que
sí envejece, la refresca el `revalidate: 3600` en cuanto alguien visita la página.

### Lo que queda sobre la mesa

- **`NEXT_BUILD_CPUS=2`**: forzaría 2 workers en un VPS de 2 núcleos. Bajaría los
  2,6 min de prerender, a cambio de dejar la máquina sin núcleo libre mientras
  construye. No se ha tocado: ahora mismo el prerender ya no es el cuello.
- **Ampliar el VPS a 4 núcleos** daría 3 workers. Con el build en 4 minutos, no
  urge.
- Turbopack emite un aviso —«Encountered unexpected file in NFT list»— por las
  operaciones de fichero de `admin-store.ts`. El patrón ya sigue la recomendación
  oficial (`path.join(process.cwd(), …)`) y la compilación son 56 s de 4 minutos:
  se deja anotado, no tocado.

## Indexación: sigue siendo el problema, y no ha mejorado

Muestra de 25 URLs inspeccionadas por API el 13 de agosto:

| Estado | URLs |
|---|---:|
| Enviada e indexada | 4 |
| Descubierta: actualmente sin indexar | 11 |
| Google no reconoce esta URL | 10 |

**21 de 25 nunca rastreadas.** Cero bloqueadas por robots, cero con canónica
ajena: no hay nada que arreglar en el sitio. `/chat/madrid`, que el 12 de agosto
había pasado a «Descubierta», hoy vuelve a salir como «Google no reconoce esta
URL» —el estado que devuelve la API fluctúa entre inspecciones, lo que ya dice
bastante de lo poco asentado que está el rastreo de este dominio.

La conclusión no cambia y conviene no seguir dándole vueltas: **el cuello de
botella no es cuántas páginas haya ni cómo estén escritas, es que a tuchat.org
Google apenas le dedica rastreo.** Lo que mueve esa aguja vive fuera de este
repositorio.
