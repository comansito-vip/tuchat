# TuChat: cobertura de salas, goteo diario y canales por demanda

Revisión del 6 de agosto de 2026. Tres preguntas: qué localidades faltan, cómo
publicarlas sin que parezca una granja de páginas, y qué canales nuevos justifica
la demanda medida.

---

## 1. El dato que cambia las prioridades

**tuchat.org no existe en Google todavía.** No es una impresión: son los números
de Search Console de los últimos 90 días.

| | |
|---|---|
| Impresiones (90 d) | **764** |
| Clics | **4** |
| Consultas distintas | 377 |
| Páginas con alguna impresión | **6**, de ~4.600 publicadas |
| Posición media de la home | 53 |
| Primer mes con datos | julio de 2026 |

Las seis páginas que imprimen son la home (con y sin www), `/chat`, `/anime`,
`/chat/galicia` y `/chat/argentina`. **De las ~2.000 salas de ciudad, dos han
sido vistas alguna vez.**

Comparado con el resto de la red en el mismo periodo:

| Dominio | Clics | Impresiones |
|---|---:|---:|
| chatzona.org | 466.169 | 19.806.420 |
| canalchat.org | 1.480.153 | 11.607.813 |
| chatzona.com | 24.782 | 3.148.708 |
| sexofacil.org | 76.631 | 1.633.993 |
| chatvenezuela.net | 227.809 | 818.780 |
| chatzona.net | 29.650 | 574.829 |
| portalchat.es | 7.555 | 267.439 |
| trivialchat.org | 877 | 23.047 |
| **tuchat.org** | **4** | **764** |

Esto no cambia la estrategia de red —el dominio no sobra, le falta subir— pero
sí el orden de trabajo. **No hay ninguna consulta de tuchat en posiciones 11-20**:
no hay nada a un empujón del top 10 porque no hay nada cerca. Con 4.600 URLs
publicadas y 6 imprimiendo, el cuello de botella no es tener más páginas, es que
Google rastree e indexe las que ya hay.

De ahí que el plan sea goteo y no volcado: **añadir 1.400 páginas de golpe a un
sitio con 6 páginas vivas es la señal exacta que Google asocia a contenido
generado en masa.** Doce al día es crecimiento de un sitio que se cuida.

---

## 2. Cobertura de localidades

Medido con el mismo comparador que usa el generador (variantes de nombre +
proximidad geográfica), no comparando slugs a pelo: «Vitoria-Gasteiz» contra
`vitoria` y «Eivissa» contra `ibiza` daban huecos falsos.

```
salas de localidad publicadas: 1.996

ESPAÑA >8.000 hab            objetivo   942 · tiene   885 · faltan    57 ·  94%
AMÉRICA hispana >20.000 hab  objetivo 3.278 · tiene 1.312 · faltan 1.966 ·  40%
```

España está prácticamente hecha. América es donde está el trabajo, y se
concentra en pocos países:

| País | Faltan (>20.000) |
|---|---:|
| México | 484 |
| Guatemala | 207 |
| Venezuela | 186 |
| Perú | 161 |
| Argentina | 124 |
| Colombia | 120 |
| Ecuador | 90 |
| Chile | 76 |
| Bolivia / Cuba | 72 cada uno |
| Costa Rica | 64 |
| Resto (9 países) | 310 |

### Los cuatro países con corte propio en 5.000

Censo descargado a propósito con `UMBRAL=5000 fetch-latam-15k.mjs colombia peru
uruguay argentina`: **2.780 localidades**, de las que 1.193 traen web del
ayuntamiento y 2.688 artículo de Wikipedia.

| | Objetivo (>5.000) | Tiene | Faltan | Cubierto |
|---|---:|---:|---:|---:|
| Colombia | 607 | 322 | 285 | 53 % |
| Perú | 1.122 | 175 | **947** | **16 %** |
| Uruguay | 154 | 39 | 115 | 25 % |
| Argentina | 897 | 362 | 535 | 40 % |
| **Total** | **2.780** | **898** | **1.882** | 32 % |

**Aviso sobre ese dato, y hay que repetirlo cada vez:** Wikidata no es un
padrón. En España devolvía 671 municipios de más de 8.000 cuando el INE da 942
—se quedaba corta en un tercio del país— y aquí pasa lo mismo: Colombia tiene
1.103 municipios y este censo solo ve 607 por encima de 5.000. **Las cifras de
arriba son un suelo, no el objetivo real.** Para cobertura de verdad hay que
contrastar con DANE, INEI, INE-UY e INDEC.

**Perú es el hueco más rentable de todos**: 23 % de cobertura y, a la vez, el
país con más demanda medida después de México (`chat peru`, 322.367 impresiones
en la red; `chat trujillo`, 61.107; `chat chiclayo`, `chat arequipa`,
`chat piura`, `chat huancayo`, `chat chimbote`, `chat iquitos`, `chat cusco`…).

---

## 3. El cron de goteo

`scripts/cron/salas-geo.mjs`. Doce salas al día por defecto, `--lote N` para
cambiarlo y `--seco` para ver qué saldría sin escribir nada.

### Cómo se ordena la cola

**Por demanda medida, no por población.** Ordenar por habitantes es ordenar por
el criterio equivocado: `chat trujillo` tiene 61.107 impresiones en la red y
Trujillo no llega al millón de habitantes, mientras que ciudades españolas más
grandes no las busca nadie con «chat» delante. La puntuación sale del corpus de
`/home/javier/red-seo/`, con la población como desempate.

### Qué hace con cada localidad

1. **Reúne fuente propia**: extracto de Wikipedia + portada de la web del
   ayuntamiento (880 de las 1.431 en cola tienen web oficial). Sin fuente, la
   localidad no se escribe: se queda en la cola.
2. **Redacta** contra ese material, con prohibición explícita de usar nada que
   el modelo «recuerde» del sitio.
3. **Verifica con un proveedor distinto del que escribió.** El que escribe
   comparte su punto ciego y aprueba sus propias invenciones.
4. **Corrige** solo quitando o suavizando lo señalado —nunca añadiendo— y
   **vuelve a verificar** con un tercero.
5. **Controles automáticos** antes de publicar (abajo).
6. Escribe en `data/localidades/generadas.json` y regenera
   `src/data/cities-generadas.ts`.

### Los controles que se ejecutan solos

- Muletillas de IA (22 expresiones), aperturas de folleto, markdown suelto.
- `intro` de 110-160 caracteres — es la meta description de la página.
- `about` de 100-320 palabras.
- Intro repetida contra **todo** el catálogo, no solo contra el lote del día.
- Párrafo idéntico entre localidades.
- **Fraseo calcado**: cadenas de 7 palabras compartidas con otra ficha. Este es
  el que de verdad hace falta — el comparador de párrafos exactos no lo veía.
- **Horarios inventados**: prohibido decir cuándo se anima la sala. No tenemos
  ese dato y en la primera tanda salió en las cuatro fichas con otras palabras
  cada vez, que es la costura que delata la generación en serie.
- **Divisiones administrativas**: descarta estados y departamentos colados entre
  las ciudades (Sinaloa entró como si fuera un pueblo).

Cubierto por 14 pruebas en `scripts/cron/salas-geo.test.ts`.

### El fallo que pilló la suite existente

La primera versión ponía el slug de la localidad como primer canal de IRC sin
comprobar que existiera. Las doce salas del primer lote mandaban a `#apodaca`,
`#vitarte`, `#chorrillos`… que **no existen en la red**: se habrían creado
vacíos al vuelo y el usuario habría aterrizado solo. Lo detectó
`src/lib/channels.test.ts`, que vigila exactamente eso sobre todo el catálogo.

La causa de fondo era que la tabla de canales buenos vivía dentro de
`scripts/fix-irc-channels.ts`, un script de mantenimiento, así que el cron no
podía usarla. Se sacó a **`src/data/irc-canal.ts`** y ahora la comparten los
tres sitios. Con la tabla buena, las salas caen además en su canal regional real
(`#nuevo_leon`, `#sinaloa`, `#costa_rica`).

### Prueba real

De un lote de 12 candidatas, con Corrientes como ejemplo de que el anclaje
funciona: la ficha habla de **la costanera cardioprotegida con desfibriladores
del Municipio y el Rotary Club** y del **certamen interbarrios «Jacinto Mamuh»**.
Eso sale de la web del ayuntamiento y no está en la Wikipedia — es exactamente
el contenido que un competidor generando con IA no va a tener.

La tasa de descarte es alta (más de la mitad) y **es intencionada**: el
verificador tumba fichas por afirmaciones que la fuente no respalda. Una
localidad descartada se reintenta hasta tres días distintos antes de abandonarse,
y los fallos de infraestructura (LLM saturado) no gastan intento.

### Puesta en marcha

Falta darlo de alta en el VPS, junto a los crons de noticias:

```cron
20 4 * * *  cd /home/javier/tuchat && npx tsx scripts/cron/salas-geo.mjs --lote 12 >> data/localidades/cron.log 2>&1
```

---

## 4. Canales nuevos, por demanda medida

Cruzando el corpus de la red contra las 2.517 salas de tuchat: **de las 253
entidades con más de 2.500 impresiones, 108 no tienen sala.**

Antes de la lista, dos avisos:

- Los slugs se comprobaron uno a uno. `travestis`, `cornudos`, `sumisas`,
  `nudismo`, `trans`, `lesbianas`, `esoterismo`, `mas-de-50`, `mas-de-60` y
  `a-coruna` **ya existen** y salían como huecos por un fallo de mi
  normalizador (singular/plural, «mas 60» vs «mas-de-60»).
- Cada propuesta va con un canal de IRC **real** de `irc-real-channels.ts`.
  Mandar una sala a un canal inventado crea un canal vacío al vuelo y el usuario
  aterriza solo.

### Prioridad 1 — la marca gitana, que es el mayor hueco de toda la red

| Página | Impresiones | Clics | Canal IRC |
|---|---:|---:|---|
| `chachipen` | 113.898 | **88.914** | `#chachipen` ✓ existe |
| `gitano` | 35.335 | 13.773 | `#chachipen` ✓ |
| `dikelame` | 25.039 | 2.499 | `#chachipen` (verificar) |

**~174.000 impresiones y 105.000 clics** en un cluster sin una sola página, con
el canal ya montado y lleno. Es la acción de mayor retorno de toda esta
revisión. Ojo: `chachipen` y `dikelame` son caló; el contenido tiene que
escribirse con conocimiento real, no con una definición de diccionario.

### Prioridad 2 — estados de México

Ninguno tiene sala y son la puerta natural a las 484 ciudades mexicanas que
faltan. Canal: `#mexico`.

| Página | Impresiones | Clics |
|---|---:|---:|
| `nuevo-leon` | 71.042 | 11.420 |
| `sonora` | 45.832 | 3.584 |
| `jalisco` | 31.977 | 1.717 |
| `yucatan` | 17.954 | 3.882 |
| `coahuila` | 16.947 | 1.860 |
| `sinaloa` | 4.268 | 765 |

**~188.000 impresiones.** Además resuelve el problema estructural que sacó el
cron: hoy las ciudades mexicanas no tienen a qué provincia enlazar, así que sus
enlaces internos mueren en el país.

### Prioridad 3 — «chat gay de {ciudad}»

El patrón ya existe (`gay-madrid`, `gaybarcelona`, `gaybogota`, `gay-sevilla`,
`gay-valencia`, `gay-bilbao`, `gaygranada`). Faltan las ciudades con más
demanda. Canal: `#gay` y `#de_ambiente`.

| Página | Impresiones | Clics |
|---|---:|---:|
| `gay-malaga` | 26.799 | 492 |
| `gay-medellin` | 21.088 | **15.142** |
| `gay-puebla` | 18.391 | 274 |
| `gay-colombia` | 15.772 | 2.070 |
| `gay-vigo` | 8.439 | 1.418 |
| `gay-monterrey` | 7.888 | 6.564 |
| `gay-cali` | 7.800 | 4.865 |
| `gay-baleares` | 6.877 | 511 |
| `gay-lima` | 6.580 | 4.487 |
| `gay-cdmx` | 6.164 | 1.878 |
| `gay-tijuana` | 4.538 | 3.588 |
| `gay-guadalajara` | 4.455 | 3.465 |
| `gay-espana` | 4.222 | 353 |

**~138.000 impresiones.** Y hay un dato que respalda el ángulo: en chatzona.org
`chat gay` está en **posición 8,7 con 342.835 impresiones** — un empujón y entra
en el top 10 con un volumen enorme detrás.

### Prioridad 4 — marcas del nicho y apodos locales

| Página | Impresiones | Clics | Canal |
|---|---:|---:|---|
| `chathispano` | 95.828 | 715 | `#chatzona` |
| `gentechat` | 82.198 | 1.350 | `#gentechat.net` ✓ |
| `caliescali` | 11.789 | 1.913 | `#cali` |
| `mallorca` | 9.016 | 327 | `#baleares` |
| `tucumanos` | 8.318 | 2.767 | `#tucuman` |
| `ozu` | 6.003 | 794 | `#andalucia` |
| `conce` | 4.983 | 417 | `#chile` |
| `vizcaya` | 4.824 | 2.517 | `#euskadi` |
| `guipuzcoa` | 4.708 | 2.213 | `#euskadi` |
| `lescontactos` | 4.518 | 3.571 | `#lescontactos` ✓ |
| `tapatios` | 4.222 | 811 | `#guadalajara` |

`chathispano` y `gentechat` son portales del nicho, igual que la página de
`canalchat` que ya existe. El modelo está probado y funciona.

### Lo que NO se debe hacer, aunque tenga demanda

`adolescentes` (31.015 imp), `13 a 18` (8.768) y `12 a 15` (4.893) suman
**~45.000 impresiones**, y aun así se quedan fuera. `irc-real-channels.ts` deja
`#de_13_a_18` explícitamente excluido, «sala de menores, fuera, sin excepción».
Lo anoto para que no se proponga otra vez dentro de tres meses al ver el número.

---

## 5. Lo que queda pendiente

1. **Dar de alta el cron en el VPS** (línea de arriba).
2. **Terminar el censo >5.000** de los cuatro países y contrastarlo con los
   institutos nacionales; lo de Wikidata es un suelo.
3. **Crear las salas de estado de México antes que sus ciudades**, para que las
   484 ciudades mexicanas tengan padre al que enlazar.
4. **Investigar la indexación**, que es el problema de fondo: 4.600 URLs y 6
   imprimiendo. La API de Search Console no da el informe de Cobertura agregado,
   pero sí `gsc_inspect_url()` (2.000/día por propiedad) para diagnosticar una
   muestra de salas y ver si están descubiertas, rastreadas o excluidas.
5. **Revisar `data/localidades/revisar.json`** (276 localidades con una sala a
   menos de 10 km, apartadas para mirar a mano) y `sin-fuente.json` (314 sin
   fuente utilizable).
