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

## La última muletilla del catálogo

El auditor de contenido encontró un aviso en 2.684 salas: `la-pintana` cerraba
la intro con «Únete a la conversación local». De paso se cambió el bloque de
about, que era plantilla pura («los usuarios comentan temas cotidianos como
transporte, seguridad, servicios municipales…»), por lo que de verdad distingue
a esa comuna: el fundo de la familia del presidente Aníbal Pinto que le da
nombre, los Huertos Obreros de 1942 de los que salieron Villa La Pintana, Villa
Las Rosas y Mapuhue, y el campus Antumapu de la Universidad de Chile.

Auditoría **a cero avisos** tras el cambio.

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
