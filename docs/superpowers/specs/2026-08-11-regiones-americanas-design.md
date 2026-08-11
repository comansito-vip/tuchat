# Regiones americanas: agrupar los listados de país y abrir 10 salas de estado

**Fecha:** 2026-08-11
**Origen:** punto 2 del [plan del 7 de agosto](../plans/2026-08-07-continuar-aqui.md), que
proponía «salas de estado de México». La medición contra el corpus de la red cambió el
alcance en las dos direcciones: hay menos salas de las que parecía y más países que agrupar.

---

## Por qué

`src/data/city-regions.ts` asigna provincia/estado/departamento a 963 ciudades americanas.
Su propia cabecera dice para qué se escribió:

> *Sin esto no hay página de estado a la que enlazar y una sala de estado nacería vacía.*

Los listados americanos **ya se agrupan**, pero por el dato equivocado. En
`src/app/chat/[slug]/page.tsx` conviven dos modos:

```tsx
const groupByRegion = place.slug === "espana" && children.some((c) => c.regionSlug);
const groupByProvincia = !groupByRegion && children.length > 30 && …;
```

España usa `RegionGroupedGrid`, que agrupa por `regionSlug` y **enlaza cada encabezado a la
sala de esa comunidad**. El resto de países cae en `ProvinciaGroupedGrid`, que agrupa por el
nombre de la provincia y no enlaza a ninguna parte, porque hasta ahora no había sala de
región americana a la que enlazar.

Resultado: los `regionSlug` de las 963 ciudades americanas no producen ni un solo enlace
interno. Es enlazado ya pagado y sin cobrar, justo en un dominio cuyo problema medido **no
es de contenido sino de rastreo**: 26 de 30 URLs inspeccionadas en Search Console siguen sin
haber sido rastreadas nunca.

---

## Qué dicen los datos, y en qué contradicen al plan de origen

Cruce del catálogo con `/home/javier/red-seo/data/corpus-consultas.tsv` (68.305 consultas,
90 días, 18 propiedades), contando **solo formas exactas** de intención de chat
(`chat X`, `chat de X`, `X chat`, `chat gratis X`…) y descartando los slugs que ya existen
como sala.

Tres correcciones al plan del 7 de agosto:

1. **Los estados cuya capital se llama igual ya están cubiertos.** Puebla, Chihuahua,
   Querétaro, Veracruz, Aguascalientes, Durango, Colima, Oaxaca y Guanajuato ya tienen sala
   de ciudad, y esa sala se lleva la consulta. No hacen falta salas de estado para ellos.
2. **Argentina y Colombia no sostienen salas de provincia.** Ni canal IRC real
   (`chaco`, `corrientes`, `misiones`, `entre-rios`, `cundinamarca`, `valle-del-cauca`:
   ninguno existe) ni demanda medible: Entre Ríos 388 impresiones, Cundinamarca 421,
   Valle del Cauca 123. La demanda argentina vive en las ciudades —`chat cordoba`,
   `chat mendoza`— y esos slugs ya son salas.
3. **Venezuela sí aparece**, y el plan de origen no la miraba: `zulia` y `carabobo` tienen
   canal propio y demanda.

### Las 10 salas que los datos sostienen

Slug libre + demanda medida + canal en `irc-real-channels.ts`:

| Sala | País | Impresiones | Clics | Canal | Ciudades |
|---|---|---:|---:|---|---:|
| `nuevo-leon` | MX | 132.132 | 10.202 | `#nuevo_leon` | 2 |
| `jalisco` | MX | 87.803 | 3.344 | `#jalisco` | 40 |
| `yucatan` | MX | 46.749 | 3.962 | `#yucatan` | 1 |
| `sonora` | MX | 40.125 | 2.000 | `#sonora` | 3 |
| `coahuila` | MX | 29.670 | 1.904 | `#coahuila` | 5 |
| `sinaloa` | MX | 10.650 | 803 | `#sinaloa` | 2 |
| `zulia` | VE | 7.969 | 422 | `#zulia` | 2 |
| `chiapas` | MX | 5.385 | 821 | `#chiapas` | 2 |
| `carabobo` | VE | 2.814 | 425 | `#carabobo` | 2 |
| `tabasco` | MX | 1.981 | 272 | `#tabasco` | 1 |

**365.278 impresiones**, no las ~188.000 que estimaba el plan.

### Dos descartes deliberados

- **`merida`** (58.635 impresiones, `#merida` existe): no es una región sino una ciudad, y
  ambigua entre tres —Mérida de Yucatán, Mérida de Venezuela y Mérida de Extremadura—.
  Merece su propia decisión, no entrar de rebote en un lote de estados.
- **`la-rioja`** (2.276): choca con La Rioja española, que ya existe como región
  (`public/flags/regiones/rioja.png`). Mismo motivo.

---

## Pieza A · Que los listados americanos agrupen por región, no por provincia

**Qué cambia.** Dos líneas de datos, no de maquetación:

1. `groupByRegion` deja de exigir que el país sea España y pasa a mirar el dato: agrupa
   cuando las ciudades hijas traen `regionSlug` **y existe al menos una sala de región** a
   la que enlazar. Sin salas no hay enlace que ganar y `ProvinciaGroupedGrid` se lee igual
   de bien, así que no se toca a los países que no las tienen.
2. `getRegions()` pasa a incluir las regiones americanas, que es de donde
   `RegionGroupedGrid` saca el enlace del encabezado.

**Qué NO hace falta tocar.** `RegionGroupedGrid` ya resuelve el resto: agrupa por
`regionSlug`, ordena los grupos por número de ciudades, pinta los chips de provincia y
enlaza el encabezado a `/chat/{region}` cuando la sala existe. No hay componente nuevo.

**El bug que esto destapa.** `RegionGroupedGrid` crea un grupo por cada `regionSlug`
distinto, y cuando no encuentra sala rotula el grupo «Otras ciudades» —en singular, pensado
para un único cajón de sobras—. En España funciona porque las 17 comunidades tienen sala. Las
262 ciudades mexicanas del catálogo reparten **31 `regionSlug` distintos** y solo 8 tendrán
sala: saldrían **23 bloques distintos titulados todos «Otras ciudades»**, más las 38 ciudades
que no tienen región asignada. Hay que fundir en un único grupo final todas las regiones sin
sala, en vez de crear uno por slug.

**Alcance.** México estrena agrupación con enlaces. Argentina, Colombia, Perú y el resto se
quedan con `ProvinciaGroupedGrid` tal cual está hoy: siguen agrupados y legibles, pero no
ganan enlaces porque no hay sala de provincia que los reciba. Esto acota el «México +
Argentina + Colombia» del encargo a lo que de verdad rinde.

## Pieza B · Las 10 salas de región

**Dónde viven.** Fichero nuevo `src/data/topics-regiones-am.ts`. No se mezclan con
`TOPICS_REGIONES`, que está documentado en su cabecera como «comunidades autónomas
españolas» y cuyo getter `getRegions()` alimenta el agrupamiento de `/chat/espana`. Mezclar
las dos cosas rompería ese contrato.

**Cómo se registran.** En `src/data/index.ts`, junto a `TOPICS_REGIONES` en `ALL`, y
`getRegions()` pasa a devolver ambas listas para que `getCitiesByRegion()` y la cabecera de
`/chat/{region}` funcionen sin tocar la página.

**Forma de cada sala.** La misma `Place` que las regiones españolas: `slug`, `name`,
`kind: "tematica"`, `icon`, `users`, `votes`, `activity`, `channels`, `related`, `intro`,
`about`. Sin `flagSrc`: no hay banderas de estado en `public/flags/regiones/` y no se van a
inventar; el campo es opcional y las salas sin él ya funcionan.

**Alineación de slugs — la trampa conocida.** Los `regionSlug` salen del censo y no coinciden
con los slugs de sala:

| En `city-regions.ts` | Sala | Ciudades afectadas |
|---|---|---:|
| `coahuila-de-zaragoza` | `coahuila` | 5 |
| `jalisco` + `estado-de-jalisco` | `jalisco` | 37 + 3 |
| `estado-de-oaxaca`, `estado-de-veracruz` | (sin sala de región: ya las cubre la sala de la ciudad homónima) | 49 |

`city-regions.ts` está **generado** por `scripts/localidades/mapear-regiones.mjs` y su
cabecera prohíbe editarlo a mano, así que la normalización va en el script, se regenera el
fichero, y un test fija que todo `regionSlug` con sala apunte a un slug que existe. El plan
del 7 de agosto ya avisaba de esto para Coahuila; aquí queda cubierto de forma general.

**Contenido.** Escrito a mano, con datos concretos verificados por estado, siguiendo el tono
de las regiones españolas ya escritas —que hablan de pulpo á feira y de retranca, no de
«rica cultura»—. La regla es la de siempre en esta red: nada de plantilla mecánica, y cada
afirmación tiene que ser cierta de ese estado en concreto y no de cualquier otro. Un `about`
que funcionaría igual cambiándole el nombre al estado es un `about` que hay que reescribir.

---

## Verificación

| Qué | Cómo se comprueba |
|---|---|
| Las 10 salas existen y responden | 10 rutas nuevas en el build, `/chat/jalisco` y compañía en el sitemap |
| Cada sala cuelga de sus ciudades | `getCitiesByRegion(slug)` no vacío para las 10 |
| Ningún `regionSlug` huérfano | test nuevo: todo `regionSlug` con sala apunta a un slug existente |
| Los canales son reales | test ya existente sobre `irc-real-channels.ts` |
| El agrupamiento no rompe España | `/chat/espana` sigue agrupando igual que hoy, con sus 17 comunidades enlazadas |
| Un solo «Otras ciudades» | `/chat/mexico` tiene exactamente un grupo sin sala, no uno por `regionSlug` |
| Contenido no plantillado | `npm run auditar` en 0 avisos; revisión a ojo de los 10 textos |
| Nada roto | `npm test`, `tsc`, `eslint`, `auditar-html.mjs` |

## Fuera de alcance

- Salas de provincia argentina y departamento colombiano (los datos no las sostienen).
- `merida` y `la-rioja` (ambigüedad de nombre, decisión aparte).
- Enlazar a tuchat.org desde el resto de la red: sigue siendo la acción de mayor retorno
  del dominio, sigue pendiente y sigue fuera de este repositorio.
