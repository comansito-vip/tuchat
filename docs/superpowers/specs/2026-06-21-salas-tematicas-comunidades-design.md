# Diseño — Salas temáticas de intereses y comunidades

**Fecha:** 2026-06-21
**Estado:** Aprobado para implementación (pendiente revisión final del spec)

## 1. Objetivo

Ampliar el catálogo de salas (`Place`) a partir de la lista de canales del viejo
tuchat aportada por el usuario, agrupada en 27 categorías temáticas. Para cada
canal propuesto:

- Si ya existe una sala equivalente → **se reutiliza** (no se duplica).
- Si no existe → **se crea** con contenido único de calidad (regla anti-IA).

Resultado: **~173 salas nuevas**, integradas en `/chat`, el catálogo y el
sitemap; **fuera** del carrusel de la home (`getPrimaryTopics()` sigue siendo
solo `TOPICS`).

## 2. Modelo de datos y ficheros

- Nuevo fichero **`src/data/topics-intereses.ts`** que exporta
  `TOPICS_INTERESES: Place[]`, estilo compacto (1 objeto por línea) y secciones
  comentadas por categoría, igual que `topics-legacy.ts`.
- Agregado en **`src/data/index.ts`** → `ALL_TOPICS`.
- Nuevo test **`src/data/topics-intereses.test.ts`** con invariantes (ver §6).
- Tipo sin cambios: se usa `Place` tal cual (`src/data/types.ts`).

No se modifican `topics.ts`, `topics-extra.ts`, `topics-legacy.ts`,
`topics-edad.ts` ni sus tests (sus conteos quedan intactos).

## 3. Mapeo de canales del iframe (`channels`)

`resolveChannels(slug)` devuelve `place.channels`; el webchat los une como
`#a,#b,…`. Los canales destino **no necesitan ser salas** (son nombres IRC).
Mapa por categoría:

| Categoría | `channels` |
|---|---|
| Idiomas | `["internacional","ocio"]` |
| Africanos | `["arabe","marruecos","ocio"]` |
| Religión | `["religion","cristianos","cristiano"]` |
| Hobbies | `["hobbies","ocio"]` |
| Cultura (arte, teatro) | `["cultura","ocio"]` |
| Historia | `["historia","cultura","ocio"]` |
| Empleo | `["empleo","ocio"]` |
| Mascotas | `["mascotas","ocio"]` |
| Salud (general) | `["salud","ocio"]` |
| Salud (ansiedad, saludmental) | `["salud","psicologia","ocio"]` |
| Viajes | `["viajes","ocio"]` |
| Cocina | `["cocina","ocio"]` |
| Tecnología (general) | `["tecnologia","ocio"]` |
| Tecnología (ia, chatgpt) | `["tecnologia","inteligencia_artificial","ocio"]` |
| Deportes | `["<propio>","deportes","ocio"]` |
| Política | `["politica","ocio"]` |
| Música | `["musica","ocio"]` |
| Series/Pelis | `["cine","series","ocio"]` |
| Gaming (general) | `["juegos","ocio"]` |
| Gaming (quiz, preguntados, retos, culturageneral) | `["trivial","trivias"]` |
| Anime (otaku) | `["anime","ocio"]` |
| Fans | `["fans","anime","ocio"]` |
| Amistad | `["amor","amistad"]` |
| Amor (general) | `["amor","amistad"]` |
| Amor (flirt, chatligar) | `["ligar","ligame"]` |
| Citas | `["amor","general"]` |
| Apps de citas (tinder, meetic) | `["amor","general"]` |
| Mayores 40 | `["mas_de_40","mas_de_50"]` |
| Mayores 50 | `["mas_de_50","mas_de_40"]` |
| Contactos gay | `["gay","chueca","de_ambiente"]` |
| Contactos lesbianas | `["lesbianas","lescontactos"]` |
| Contactos adultos | `["parejas","cornudos"]` |
| Contactos genéricos | `["amor","ligar"]` |
| Singles | `["amor","ligar"]` |
| Hispanos | `["usa","latinos"]` |
| Jóvenes | `["adolescentes","ocio"]` |

## 4. Jerarquía (hubs / `parentSlug`)

Cada categoría tiene un **hub** que actúa de padre de sus salas hermanas
(`parentSlug`), para migas de pan y enlazado interno (`getChildren`). El hub es
una sala existente cuando la hay; si no, se crea como raíz (sin `parentSlug`).

| Categoría | Hub (parent) | ¿Hub nuevo? |
|---|---|---|
| Idiomas | `idiomas` | sí |
| Africanos | `africa` | sí |
| Religión | `religion` | sí |
| Hobbies | `hobbies` | sí |
| Cultura | `cultura` | no (existe) |
| Historia | `historia` | no |
| Empleo | `empleo` | sí |
| Mascotas | `animalear` (name "Mascotas") | no |
| Salud | `salud` | no |
| Viajes | `viajes` | no |
| Cocina | `cocina` | no |
| Tecnología | `tecnologia` | no |
| Deportes | `deportes` (selecciones/ligas → `futbol`) | no |
| Política | `politica` | no |
| Música | `musica` | no |
| Series/Pelis | `series` | no |
| Gaming | `juegos` | no |
| Anime | `anime` | no |
| Fans | `fandoms` | sí |
| Amistad | `amistad` | no |
| Amor | `amor` | no |
| Apps de citas | `amor` | no |
| Mayores | `mas-de-40` / `mas-de-50` | no |
| Contactos gay | `gay` | no |
| Contactos lesbianas | `lesbianas` | no |
| Contactos adultos | `adultos` | no |
| Contactos genéricos | `contactos` | sí |
| Singles | `singles` | sí |
| Hispanos | `hispanos` | no |
| Jóvenes | `jovenes` | sí |

## 5. Inventario completo de salas a crear (~173)

> Formato: `slug` (hub nuevo en **negrita**). Canales según §3.

1. **Idiomas (7):** **idiomas**, ingles, frances, italiano, aleman, portugues, intercambioidiomas
2. **Africanos (7):** **africa**, argelia, egipto, tetuan, nador, tanger, casablanca
3. **Religión (10):** **religion**, cristianos, chatcristiano, oracion, biblia, jovenescristianos, fe, espiritualidad, catolicos, debatereligioso
4. **Hobbies (10):** **hobbies**, naturaleza, senderismo, montana, playas, ecologia, manualidades, fotografia, coleccionismo, jardineria
5. **Cultura (2):** arte, teatro
6. **Historia (4):** historiaespana, historiaantigua, segundaguerra, curiosidadeshistoricas
7. **Empleo (10):** **empleo**, trabajo, ofertasempleo, freelance, teletrabajo, oposiciones, estudiantes, universidad, estudiar, practicas
8. **Mascotas (4):** perros, gatos, adopciones, veterinaria
9. **Salud (11):** bienestar, ansiedad, apoyo, vidasana, saludmental, fitness, gym, adelgazar, nutricion, running, entrenamiento
10. **Viajes (5):** mochileros, turismo, viajarbarato, escapadas, viajeros
11. **Cocina (5):** recetas, gastronomia, comidasana, postres, cocinacasera
12. **Tecnología (6):** ia, chatgpt, programacion, moviles, gadgets, ciberseguridad
13. **Deportes (9):** laliga, champions, mundial2026, seleccionargentina, seleccionespanola, nba, tenis, boxeo, ufc
14. **Política (7):** politicaespana, politicalatam, debatepolitico, actualidad, noticias, opinion, tertulia
15. **Música (6):** reggaeton, pop, rock, electronica, flamenco, kpop
16. **Series/Pelis (5):** peliculas, netflix, primevideo, marvel, terror
17. **Gaming (10):** fortnite, minecraft, lol, valorant, roblox, gta, quiz, preguntados, retos, culturageneral
18. **Anime (1):** otaku
19. **Fans (5):** **fandoms**, harrypotter, starwars, kpopfans, animefans
20. **Amistad (4):** haceramigos, amigos, amistadgratis, conocergente
21. **Amor (6):** buscarpareja, encontraramor, corazon, flirt, citas, chatligar
22. **Apps de citas (2):** tinder, meetic
23. **Mayores (8):** mayores40, solteros40, amistad40, ligar40, mayores50, solteros50, amistad50, ligar50
24. **Contactos (16):** chatgay, gaysespana, gayslatinos · chatlesbianas, mujereslesbianas, lesbico, lgtblesbianas · mayores18, chatadultos, adultos30, adultos40 · **contactos**, contactosgratis, conocerpersonas, solteros, solteras
25. **Singles (3):** **singles**, divorciados, separados
26. **Hispanos (6):** hispanosenusa, latinosusa, texas, argentinosenelexterior, venezolanosenusa, colombianosenusa
27. **Jóvenes (4):** **jovenes**, universitarios, amistadjoven, chatjoven

### Solapamientos resueltos (NO se crean; se reutiliza la existente)
- `mascotas`, `animales` → **`animalear`** (sala "Mascotas")
- `libros` → **`literatura`**
- `gaming`, `gamers` → **`videojuegos`**
- `evangelicos` → **`cristiano-evangelico`**
- `running`, `marvel`, `solteros`, `solteras`, `estudiantes` → se crean **una sola vez** y se enlazan (vía `related`) desde ambas categorías que los mencionan.
- `marruecos`, `miami`, `nueva-york` (newyork), `los-angeles` (losangeles), `fc-barcelona` (fcbarcelona), `formula-1` (formula1), `one-piece`, `dragon-ball`, `kimetsu-no-yaiba` → ya existen; solo `related`.
- `badoo` → se deja **intacta**; las apps de citas nuevas son solo `tinder` y `meetic`.

## 6. Contenido y reglas de calidad

Cada `Place` nuevo cumple:

- `intro` ≤ 160 caracteres, `about` ≥ 400 caracteres.
- `intro` y `about` **únicos** en todo el catálogo (`ALL`).
- Voz coherente con las salas existentes: concreta, coloquial, con detalles
  reales y específicos del tema; nada de plantilla genérica ni relleno.
- `votes > users`; `users`/`votes` en rangos plausibles (≈100–360 / 175–620).
- `tag` opcional (`Popular`/`Tendencia`/`Nueva`) y `activity` plausibles.
- `icon` emoji propio y representativo.
- `related`: 4–6 slugs **que existan** en el catálogo (incluye hermanas nuevas
  del mismo fichero + hubs/temáticas existentes + alguna ciudad cuando aporte).
- `channels` según §3; `parentSlug`/`parentName` según §4.

### Apps de citas — disclaimer obligatorio
`tinder` y `meetic` dejan explícito en `intro`/`about` que **no son canales
oficiales** de esas marcas: son espacios para compartir opiniones y experiencias
(matches, fotos, lo bueno y lo malo) sobre la app.

### Test `topics-intereses.test.ts`
- `TOPICS_INTERESES` tiene la longitud esperada (≈173) y todas `kind:"tematica"`.
- Todas resuelven por `getPlace`.
- Slugs únicos globalmente (sin colisión con datos existentes).
- `intro` ≤160 y `about` ≥400 por sala.
- `intro`/`about` únicos en todo `ALL`.
- Todos los slugs de `related` existen.
- `parentSlug` (cuando exista) resuelve a un `Place`.
- `votes > users` en todas.

## 7. Plan por lotes

Las 27 categorías se implementan en **6 lotes**; tras cada lote se corre
`npm test` (o el test concreto) para validar unicidad/SEO/related antes de seguir:

- **L1 — Idiomas, Africanos, Religión** (24)
- **L2 — Hobbies, Cultura, Historia, Mascotas** (20)
- **L3 — Empleo, Salud, Viajes, Cocina, Tecnología** (37)
- **L4 — Deportes, Política, Música, Series, Gaming, Anime, Fans** (43)
- **L5 — Amistad, Amor, Apps de citas, Mayores, Singles** (23)
- **L6 — Contactos, Hispanos, Jóvenes** (26)

El test final y el fichero se integran en `index.ts` desde el primer lote
(añadiendo entradas incrementalmente) para que `related` cruzados resuelvan.

## 8. Fuera de alcance (YAGNI)

- No se crea una taxonomía/navegación de "categorías" como entidad nueva en la
  UI; basta con `parentSlug` (jerarquía existente) + `/chat` + sitemap.
- No se tocan los canales destino del iframe como salas (son nombres IRC).
- No se modifican salas existentes (salvo `related` si hiciera falta enlazar; no
  se reescribe `badoo`).
