# Regiones americanas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Abrir 10 salas de región americana (8 mexicanas, 2 venezolanas) y hacer que `/chat/mexico` agrupe sus ciudades por estado enlazando a ellas, que es enlazado interno que hoy está pagado y sin cobrar.

**Arquitectura:** Las salas viven en un fichero nuevo, `src/data/topics-regiones-am.ts`, paralelo a `topics-regiones.ts` (comunidades españolas). `getRegions()` pasa a devolver ambas listas, que es de donde `RegionGroupedGrid` saca el enlace del encabezado y `chat/[slug]/page.tsx` decide si una página es de región. El agrupamiento por región deja de estar cableado a España y pasa a activarse cuando las ciudades del país tienen `regionSlug` con sala detrás.

**Tech Stack:** Next.js (App Router), TypeScript, Vitest, Tailwind.

## Global Constraints

- **Español** en todo el copy y en los mensajes de commit.
- `intro` **≤160 caracteres** (límite de meta description). Lo comprueba `src/data/data.test.ts`.
- `about` **≥400 caracteres** cuando está presente. Mismo test.
- Los `channels` de una sala solo pueden ser canales que existan en `src/data/irc-real-channels.ts`. Los 10 de este plan ya están verificados como existentes.
- **Nada de copy plantillado.** Un `about` que seguiría funcionando cambiándole el nombre al estado hay que reescribirlo. Cada afirmación tiene que ser cierta de ese estado en concreto.
- `src/data/city-regions.ts` está **generado**: no se edita a mano, se cambia `scripts/localidades/mapear-regiones.mjs` y se regenera.
- Tras cada tarea: `npm test`, y `npx tsc --noEmit` en las que tocan tipos.

---

### Task 1: Normalizar los `regionSlug` que el censo escribe distinto

El censo llama a las cosas por su nombre largo. `city-regions.ts` tiene las 5 ciudades de Coahuila bajo `coahuila-de-zaragoza` y las de Jalisco partidas entre `jalisco` (37) y `estado-de-jalisco` (3). Si la sala se llama `coahuila`, esas 5 ciudades no la encuentran y la sala nace vacía — que es justo lo que este trabajo quiere evitar.

**Files:**
- Modify: `scripts/localidades/mapear-regiones.mjs:135`
- Modify (regenerado, no a mano): `src/data/city-regions.ts`
- Test: `src/data/data.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `CITY_REGIONS` con `regionSlug` normalizado. Las tareas 2 y 3 dependen de que `coahuila` y `jalisco` sean los slugs finales.

- [ ] **Step 1: Escribir el test que falla**

En `src/data/data.test.ts`, dentro del `describe("data getters", …)`:

```ts
it("los regionSlug del censo usan el slug de la sala, no el nombre largo", () => {
  // El censo escribe "Coahuila de Zaragoza" y "Estado de Jalisco"; la sala se
  // llama "coahuila" y "jalisco". Sin normalizar, esas ciudades no encuentran
  // su región y la sala nace vacía.
  const PROHIBIDOS = ["coahuila-de-zaragoza", "estado-de-jalisco"];
  const usados = new Set(getCities().map((c) => c.regionSlug).filter(Boolean));
  const fuera = PROHIBIDOS.filter((p) => usados.has(p));
  expect(fuera).toEqual([]);
});
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

Run: `npx vitest run src/data/data.test.ts -t "regionSlug del censo"`
Expected: FAIL — `expected [ 'coahuila-de-zaragoza', 'estado-de-jalisco' ] to deeply equal []`

- [ ] **Step 3: Añadir la tabla de alias al generador**

En `scripts/localidades/mapear-regiones.mjs`, justo antes del bucle que rellena `mapa` (alrededor de la línea 135):

```js
// El censo escribe el nombre administrativo completo ("Coahuila de Zaragoza",
// "Estado de Jalisco"); nuestras salas usan el nombre corto, que es como se
// busca. Sin esto, las ciudades quedan colgando de un regionSlug que no
// corresponde a ninguna sala y el listado por estado nace vacío.
const ALIAS_REGION = {
  "coahuila-de-zaragoza": "coahuila",
  "estado-de-jalisco": "jalisco",
};
const slugRegion = (nombre) => {
  const s = norm(nombre);
  return ALIAS_REGION[s] ?? s;
};
```

Y sustituir la línea 135:

```js
    mapa[ciudad.slug] = { provincia: hallada.region, regionSlug: slugRegion(hallada.region) };
```

- [ ] **Step 4: Regenerar `city-regions.ts`**

Run: `node scripts/localidades/mapear-regiones.mjs`
Expected: escribe `src/data/city-regions.ts`. Comprobar el efecto:

```bash
grep -c '"regionSlug":"coahuila"' src/data/city-regions.ts        # espera 5
grep -c '"regionSlug":"coahuila-de-zaragoza"' src/data/city-regions.ts  # espera 0
grep -c '"regionSlug":"jalisco"' src/data/city-regions.ts          # espera 40
```

- [ ] **Step 5: Ejecutar los tests**

Run: `npm test`
Expected: PASS, incluido el test nuevo. El resto de la suite no debería moverse.

- [ ] **Step 6: Commit**

```bash
git add scripts/localidades/mapear-regiones.mjs src/data/city-regions.ts src/data/data.test.ts
git commit -m "fix(regiones): las ciudades de Coahuila y Jalisco encuentran su estado

El censo las escribe como 'Coahuila de Zaragoza' y 'Estado de Jalisco', que
no es el slug de ninguna sala. Las 5 de Coahuila y 3 de Jalisco colgaban de
una región inexistente."
```

---

### Task 2: Las 10 salas de región, con su contenido

**Files:**
- Create: `src/data/topics-regiones-am.ts`
- Test: `src/data/topics-regiones-am.test.ts`

**Interfaces:**
- Consumes: el tipo `Place` de `src/data/types.ts`.
- Produces: `export const TOPICS_REGIONES_AM: Place[]` — 10 elementos. La Tarea 3 lo importa por ese nombre exacto.

Nota sobre los campos: **sin `flagSrc`** (no hay banderas de estado en `public/flags/regiones/` y no se van a inventar; el campo es opcional). `users` y `votes` van escalados a la demanda medida de cada una, no inventados al azar: Nuevo León y Jalisco arriba, Tabasco y Carabobo abajo.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/data/topics-regiones-am.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { TOPICS_REGIONES_AM } from "./topics-regiones-am";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";

describe("salas de región americana", () => {
  it("son las 10 que la demanda medida sostiene", () => {
    expect(TOPICS_REGIONES_AM.map((r) => r.slug).sort()).toEqual([
      "carabobo", "chiapas", "coahuila", "jalisco", "nuevo-leon",
      "sinaloa", "sonora", "tabasco", "yucatan", "zulia",
    ]);
  });

  it("todos sus canales existen de verdad en la red", () => {
    const reales = new Set(REAL_CHANNELS.map(channelKey));
    const fuera = TOPICS_REGIONES_AM.flatMap((r) =>
      r.channels.filter((c) => !reales.has(channelKey(c))).map((c) => `${r.slug}: ${c}`)
    );
    expect(fuera).toEqual([]);
  });

  it("cada sala cuelga de un país real y es temática", () => {
    for (const r of TOPICS_REGIONES_AM) {
      expect(r.kind, r.slug).toBe("tematica");
      expect(["mexico", "venezuela"], r.slug).toContain(r.parentSlug);
    }
  });

  it("el copy cumple los límites de la SERP", () => {
    for (const r of TOPICS_REGIONES_AM) {
      expect(r.intro.length, `intro ${r.slug}`).toBeLessThanOrEqual(160);
      expect(r.about!.length, `about ${r.slug}`).toBeGreaterThanOrEqual(400);
    }
  });

  it("ningún about es plantilla: no comparten frases largas entre sí", () => {
    // Dos salas que comparten una frase de 40+ caracteres es la firma del copy
    // generado con hueco para el nombre.
    const frases = (t: string) =>
      t.split(/[.;]/).map((f) => f.trim()).filter((f) => f.length >= 40);
    const vistas = new Map<string, string>();
    const repes: string[] = [];
    for (const r of TOPICS_REGIONES_AM) {
      for (const f of frases(r.about!)) {
        if (vistas.has(f)) repes.push(`${vistas.get(f)} / ${r.slug}: "${f}"`);
        else vistas.set(f, r.slug);
      }
    }
    expect(repes).toEqual([]);
  });
});
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

Run: `npx vitest run src/data/topics-regiones-am.test.ts`
Expected: FAIL — no existe el módulo `./topics-regiones-am`.

- [ ] **Step 3: Escribir el fichero**

Crear `src/data/topics-regiones-am.ts`:

```ts
import type { Place } from "./types";

// Estados mexicanos y venezolanos con demanda medida en el corpus de la red y
// canal IRC propio (ver docs/superpowers/specs/2026-08-11-regiones-americanas-design.md).
// Van aparte de TOPICS_REGIONES, que está acotado a las comunidades españolas y
// cuyo contrato incluye tener bandera real en /flags/regiones/.
//
// Sin flagSrc a propósito: no hay banderas de estado dibujadas y una inventada
// se nota. El campo es opcional y el componente cae en el icono.
export const TOPICS_REGIONES_AM: Place[] = [
  {
    slug: "nuevo-leon",
    name: "Nuevo León",
    kind: "tematica",
    icon: "🏔️",
    users: 210,
    votes: 305,
    tag: "Popular",
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["nuevo_leon", "mexico", "chatzona"],
    related: ["monterrey", "guadalupe-nuevo-leon", "mexico", "jalisco", "coahuila"],
    intro:
      "Monterrey al pie del Cerro de la Silla, el calor que no perdona y esa fama de directos que los regios llevan a mucha honra.",
    about:
      "Aquí se junta gente de Monterrey, de Guadalupe, de San Nicolás y de los municipios que se comieron la mancha urbana hasta volverla una sola ciudad. Se discute de carne asada con la seriedad con que en otros lados se discute de política: el corte, la leña, quién la pone y a quién no se le vuelve a confiar el asador. Rayados y Tigres parten la conversación por la mitad cada clásico regio, y el resto del año sirven de excusa. El calor de junio se lleva con humor negro y aire acondicionado, y en cuanto afloja alguien propone subir a Chipinque o meterse a la Huasteca. La fama de tacaños que les cuelgan desde el resto del país se responde con un chiste antes de que lo cuente el de fuera. Entra quien trabaja en la industria, estudiantes del Tec y de la UANL, y regios que emigraron y siguen sosteniendo que el cabrito solo sabe bien en casa.",
  },
  {
    slug: "jalisco",
    name: "Jalisco",
    kind: "tematica",
    icon: "🎺",
    users: 195,
    votes: 288,
    tag: "Popular",
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["jalisco", "mexico", "chatzona"],
    related: ["guadalajara", "zapopan", "puerto-vallarta", "tlaquepaque", "mexico"],
    intro:
      "Tequila, mariachi y charrería salieron de aquí antes de volverse postal de México: Jalisco entra al chat con Guadalajara al frente.",
    about:
      "Guadalajara marca el paso, pero en esta sala también entran de Zapopan, Tlaquepaque, Tonalá y de los pueblos de Los Altos, que hablan cantadito y lo saben. Se defiende la torta ahogada con fe de converso, y con la birria de por medio la discusión sube de tono enseguida. Se pelea por si el mejor tequila sale del pueblo de Tequila, de Amatitán o de Arandas, sabiendo de antemano que cada quien jurará por el de su tierra. El mariachi y la charrería nacieron por acá y eso se recuerda seguido, sin demasiada modestia. Chivas y Atlas dividen la sala cada clásico tapatío. Hay quien se escapa a Chapala el fin de semana, quien vive de lo que deja Puerto Vallarta y quien lleva años en Guadalajara sin ser de allí y ya se le pegó el 'pos'. Tapatíos de nacimiento y de adopción, convencidos todos de que su ciudad es la mejor del país.",
  },
  {
    slug: "yucatan",
    name: "Yucatán",
    kind: "tematica",
    icon: "🌾",
    users: 160,
    votes: 240,
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["yucatan", "mexico", "chatzona"],
    related: ["merida-mexico", "mexico", "chiapas", "tabasco"],
    intro:
      "Mérida, los cenotes y una manera de hablar que se reconoce a la primera: Yucatán entra al chat con su maya de diario.",
    about:
      "La península se siente aparte del resto de México y en esta sala se nota: se dice 'lo bueno' a cada rato y se cuelan palabras mayas sin avisar, que quien no es de acá tarda en cazar. Meridanos, gente de Valladolid, de Progreso y de Tizimín discuten de cochinita los domingos y de si los papadzules se hacen bien o no se hacen. El calor de abril se sobrelleva decidiendo a qué cenote irse, que hay para escoger y cada quien defiende el suyo como si fuera secreto de familia. Chichén Itzá y Uxmal salen cuando entra alguien de fuera preguntando qué ver, y siempre hay quien responde que mejor vaya a uno menos concurrido. La trova suena las noches de Santa Lucía. Se presume, con razón, de ser de los lugares más tranquilos del país, y de que aquí la gente todavía saluda al entrar.",
  },
  {
    slug: "sonora",
    name: "Sonora",
    kind: "tematica",
    icon: "🌵",
    users: 145,
    votes: 215,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["sonora", "mexico", "chatzona"],
    related: ["hermosillo", "ciudad-obregon", "mexico", "sinaloa"],
    intro:
      "Desierto, tortillas sobaqueras y una carne asada que no admite discusión: Sonora entra al chat con 45 grados a la sombra.",
    about:
      "El calor aquí no es tema de conversación sino forma de vida: en Hermosillo el día se organiza alrededor de la hora a la que se puede salir, y en junio eso no se discute. Entran de Ciudad Obregón, de Navojoa, de Guaymas y de Nogales, con esa mezcla de norteño y frontera que suena distinta al resto del país. La carne asada no se negocia y la tortilla de harina sobaquera tampoco: quien llegue defendiendo la de maíz que se vaya preparando. Se habla de Naranjeros y Yaquis en cuanto arranca la liga del Pacífico, que por acá se vive con más devoción que el fútbol. Puerto Peñasco sale cada vez que alguien menciona vacaciones, y el mar de Cortés se defiende frente a cualquier playa del Caribe. Hay orgullo yaqui y seri en la sala, y sonorenses en Phoenix o Tucson que se asoman para no perder el hilo de casa.",
  },
  {
    slug: "coahuila",
    name: "Coahuila",
    kind: "tematica",
    icon: "🦖",
    users: 130,
    votes: 195,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["coahuila", "mexico", "chatzona"],
    related: ["saltillo", "torreon", "monterrey", "mexico", "nuevo-leon"],
    intro:
      "Saltillo, Torreón y el desierto en medio: Coahuila entra al chat con su sarape, su vino de Parras y dinosaurios de verdad.",
    about:
      "Coahuila es grande y en la sala se nota: los de Saltillo y los de Torreón no se parecen tanto, y La Laguna hace vida propia a caballo entre dos estados. Se presume del sarape saltillense, del pan de pulque y de que en Parras sigue en pie Casa Madero, fundada en 1597 y la vinícola más antigua de América, cosa que se recuerda cada vez que alguien habla del vino mexicano como si fuera invento reciente. El desierto se defiende de quien lo llama vacío: están las pozas de Cuatro Ciénegas y fósiles suficientes para llenar el Museo del Desierto, que es de los buenos del país. El Santos junta a los de Torreón cada jornada. Aprieta el calor en verano y las noches de invierno bajan de cero, que es de las pocas cosas en que todo el estado coincide. Entra gente de Monclova, de Piedras Negras y de Acuña, con la frontera a la vista.",
  },
  {
    slug: "sinaloa",
    name: "Sinaloa",
    kind: "tematica",
    icon: "🥁",
    users: 120,
    votes: 178,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["sinaloa", "mexico", "chatzona"],
    related: ["culiacan", "mazatlan", "mexico", "sonora"],
    intro:
      "Mazatlán con su malecón y su carnaval, Culiacán con su calor: Sinaloa entra al chat con la tambora sonando de fondo.",
    about:
      "En esta sala se junta la gente de Culiacán con la de Mazatlán, que es como juntar dos formas distintas de ser sinaloense: la capital trabaja y el puerto presume de playa. El carnaval de Mazatlán aparece cada febrero y se defiende como uno de los más antiguos y multitudinarios de México, con la seguridad de quien no piensa entrar a discutirlo. La banda suena acá de otra manera, porque la tambora no se pide, se impone, y hay quien la defiende contra el mundo entero. El aguachile se come picoso y a quien lo pida suave le caen burlas amables. Se habla más de béisbol que de fútbol: Tomateros y Venados parten la sala en temporada. El estado le da de comer a medio país con su tomate y su maíz, y eso se dice con orgullo en cuanto alguien reduce Sinaloa a lo de siempre.",
  },
  {
    slug: "zulia",
    name: "Zulia",
    kind: "tematica",
    icon: "⚡",
    users: 115,
    votes: 170,
    activity: "Media",
    parentName: "Venezuela",
    parentSlug: "venezuela",
    channels: ["zulia", "venezuela", "chatzona"],
    related: ["maracaibo", "cabimas", "venezuela", "carabobo"],
    intro:
      "Maracaibo, el lago, el puente y un calor que los maracuchos llevan con orgullo: Zulia entra al chat hablando de vos.",
    about:
      "Acá se habla distinto y se sabe: el voseo maracucho se oye a leguas y en esta sala nadie lo disimula. Entran de Maracaibo, de Cabimas, de Ciudad Ojeda y de toda la Costa Oriental del Lago, con ese volumen que en el resto de Venezuela les critican y que aquí se defiende como carácter. El calor de Maracaibo es tema recurrente y chiste fijo, y se mide en si se puede o no salir al mediodía. El puente sobre el lago sale en cuanto alguien nombra la ciudad, y el relámpago del Catatumbo, que descarga sobre el sur del lago casi todas las noches del año, se le cuenta a los de fuera como quien enseña algo propio. En diciembre la gaita se apodera de todo y no hay conversación que se salve. El patacón se defiende frente a cualquier arepa. Hay zulianos por medio mundo asomándose a la sala para oír a los suyos.",
  },
  {
    slug: "chiapas",
    name: "Chiapas",
    kind: "tematica",
    icon: "☕",
    users: 105,
    votes: 158,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["chiapas", "mexico", "chatzona"],
    related: ["tuxtla-gutierrez", "tapachula", "mexico", "yucatan", "tabasco"],
    intro:
      "Tuxtla, San Cristóbal y el Cañón del Sumidero: Chiapas entra al chat con su café, sus lenguas propias y la selva a mano.",
    about:
      "Chiapas cabe mal en una sola conversación: Tuxtla Gutiérrez es calor y ciudad, y San Cristóbal de las Casas es frío, niebla y otra manera de andar por la calle. En esta sala coinciden los dos, más los de Tapachula, que están tan cerca de Guatemala que cruzar la frontera no tiene ninguna épica. Se hablan tzotzil y tzeltal en buena parte del estado y aquí se cuela alguna palabra sin traducir. El café chiapaneco se defiende contra el de donde sea, y a quien lo tome con azúcar le cae algún comentario. El Cañón del Sumidero sale cada vez que entra alguien de fuera, y Palenque también, aunque los de acá recomiendan Yaxchilán o Bonampak para librarse de las excursiones. Agua Azul y El Chiflón para el calor. Hay orgullo de tierra y algo de recelo con quien habla del estado sin haber pisado más que el aeropuerto.",
  },
  {
    slug: "carabobo",
    name: "Carabobo",
    kind: "tematica",
    icon: "⚓",
    users: 95,
    votes: 142,
    activity: "Baja",
    parentName: "Venezuela",
    parentSlug: "venezuela",
    channels: ["carabobo", "venezuela", "chatzona"],
    related: ["valencia-venezuela", "puerto-cabello", "venezuela", "zulia"],
    intro:
      "Valencia con su industria y Puerto Cabello con su puerto: Carabobo entra al chat donde se selló la independencia.",
    about:
      "Valencia manda en la sala por tamaño, pero Puerto Cabello se hace notar: el puerto más importante del país tiene su gente y su propio acento. Se habla de la industria que hizo grande a Valencia y de lo que ha quedado de ella, que es conversación seria y con opiniones encontradas. El Campo de Carabobo sale cada 24 de junio y no como dato de libro: allí se libró en 1821 la batalla que aseguró la independencia de Venezuela, y eso pesa en el orgullo local más de lo que un forastero supone. El Carabobo FC junta a los que siguen fútbol y el resto se pasa al béisbol sin remordimiento. Patanemo y Quizandal aparecen cada fin de semana, y el Parque Nacional San Esteban para quien prefiere monte a playa. Hay carabobeños fuera del país preguntando cómo está aquello y quien se quedó y lo cuenta sin adornos.",
  },
  {
    slug: "tabasco",
    name: "Tabasco",
    kind: "tematica",
    icon: "🍫",
    users: 85,
    votes: 128,
    activity: "Baja",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["tabasco", "mexico", "chatzona"],
    related: ["villahermosa", "mexico", "chiapas", "yucatan"],
    intro:
      "Villahermosa, los ríos y un calor húmedo que no da tregua: Tabasco entra al chat donde el cacao lleva milenios.",
    about:
      "En Tabasco llueve de verdad y hace un calor húmedo que los de fuera no aguantan, y eso se cuenta en la sala con cierto gusto. Villahermosa concentra a casi todos, pero también entran de Cárdenas, de Comalcalco y de Tenosique, con el Grijalva y el Usumacinta atravesándolo todo. El cacao es el orgullo mayor: se cultiva por acá desde hace milenios y en Comalcalco quedan haciendas que lo siguen trabajando, así que cuando alguien saca el chocolate suizo la sala responde. El pejelagarto asado se defiende ante quien pone cara al verlo servido. Los olmecas dejaron las cabezas colosales que hoy se ven en el parque La Venta, y salen cada vez que se discute quién llegó primero a Mesoamérica. Se habla de pesca, de inundaciones cuando toca, y de los Olmecas en temporada de béisbol.",
  },
];
```

- [ ] **Step 4: Ejecutar el test**

Run: `npx vitest run src/data/topics-regiones-am.test.ts`
Expected: PASS los 5 casos.

- [ ] **Step 5: Commit**

```bash
git add src/data/topics-regiones-am.ts src/data/topics-regiones-am.test.ts
git commit -m "feat(salas): 10 salas de estado mexicano y venezolano

Las que la demanda medida de la red sostiene y tienen canal IRC propio:
365.278 impresiones entre las diez. Todavía sin registrar en el catálogo."
```

---

### Task 3: Registrar las salas en el catálogo

Hasta aquí el fichero existe pero nadie lo importa. Esta tarea lo mete en `ALL` y en `getRegions()`, que es lo que hace que las páginas `/chat/{estado}` existan y que el encabezado de grupo tenga a dónde enlazar.

**Files:**
- Modify: `src/data/index.ts:12` (import), `:38-49` (`ALL_TOPICS`), `:232-236` (`getRegions`)
- Modify: `src/data/data.test.ts:126` (el test de `getRegions` cambia de premisa)

**Interfaces:**
- Consumes: `TOPICS_REGIONES_AM` de la Tarea 2.
- Produces: `getRegions()` devuelve españolas + americanas (26 elementos). Las Tareas 4 y 5 dependen de eso.

- [ ] **Step 1: Escribir el test que falla**

En `src/data/data.test.ts`, **sustituir** el test existente `"getRegions returns the 16 comunidades autónomas con bandera real"` por estos dos:

```ts
it("getRegions incluye las comunidades españolas, todas con bandera real", () => {
  const esp = getRegions().filter((r) => r.parentSlug === undefined);
  expect(esp.length).toBeGreaterThanOrEqual(16);
  for (const r of esp) expect(r.flagSrc, r.slug).toMatch(/^\/flags\/regiones\//);
});
it("getRegions incluye las 10 regiones americanas, que cuelgan de su país", () => {
  const am = getRegions().filter((r) => r.parentSlug !== undefined);
  expect(am.length).toBe(10);
  for (const r of am) expect(["mexico", "venezuela"], r.slug).toContain(r.parentSlug);
});
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

Run: `npx vitest run src/data/data.test.ts -t "getRegions"`
Expected: FAIL — el segundo da `expected 0 to be 10`.

- [ ] **Step 3: Registrar el fichero**

En `src/data/index.ts`, añadir el import junto al de `TOPICS_REGIONES` (línea 12):

```ts
import { TOPICS_REGIONES_AM } from "./topics-regiones-am";
```

Añadirlo a `ALL_TOPICS`, justo después de `...TOPICS_REGIONES` (línea 44):

```ts
  ...TOPICS_REGIONES_AM,
```

Y cambiar `getRegions()` (línea ~232), comentario incluido:

```ts
// Regiones con sala propia: comunidades autónomas españolas (topics-regiones.ts)
// y estados americanos (topics-regiones-am.ts). Se usa para agrupar el listado de
// ciudades de su país y para las cabeceras de /chat/{region}. Las españolas
// tienen bandera real; las americanas no, y caen en su icono.
export function getRegions(): Place[] {
  return [...TOPICS_REGIONES, ...TOPICS_REGIONES_AM];
}
```

- [ ] **Step 4: Ejecutar la suite entera**

Run: `npm test`
Expected: PASS. Atención a dos tests que ahora abarcan más:
- `"getCitiesByRegion … cada regionSlug resuelve a una sala real"` exige que las 10 nuevas tengan al menos una ciudad. Con la Tarea 1 hecha, las tienen (Yucatán 1, Tabasco 1, el resto más).
- `"no duplicate place slugs"` confirma que ninguno de los 10 slugs chocaba con una sala existente.

Si `getCitiesByRegion` falla para alguna, **el problema es la Tarea 1**, no esta: comprobar el `regionSlug` de esa región en `city-regions.ts`.

- [ ] **Step 5: Comprobar tipos y que el catálogo las ve**

Run: `npx tsc --noEmit`
Expected: sin errores.

Run:
```bash
npx tsx -e 'import {getPlace,getRegions,getCitiesByRegion} from "./src/data/index.ts";
for (const s of ["jalisco","nuevo-leon","yucatan","sonora","coahuila","sinaloa","zulia","chiapas","carabobo","tabasco"])
  console.log(s.padEnd(12), getPlace(s) ? "sala OK" : "NO EXISTE", "· ciudades:", getCitiesByRegion(s).length);
console.log("getRegions:", getRegions().length);'
```
Expected: las 10 con «sala OK», ninguna con 0 ciudades, y `getRegions: 26`.

- [ ] **Step 6: Commit**

```bash
git add src/data/index.ts src/data/data.test.ts
git commit -m "feat(salas): las 10 regiones americanas entran al catálogo

getRegions() pasa a devolver comunidades españolas y estados americanos.
El test de bandera real se acota a las españolas, que son las que la tienen."
```

---

### Task 4: Un solo «Otras ciudades», no veintitrés

`RegionGroupedGrid` crea un grupo por cada `regionSlug` distinto y rotula «Otras ciudades» los que no encuentran sala. En España no se nota porque las 17 comunidades tienen sala. Las 262 ciudades mexicanas reparten **31 `regionSlug`** y solo 8 tendrán sala: saldrían 23 secciones tituladas todas igual.

**Files:**
- Modify: `src/components/ui/RegionGroupedGrid.tsx:13-19`
- Test: `src/components/ui/ui.test.tsx` (el repo agrupa ahí los tests de esta carpeta; no crear fichero nuevo)

**Interfaces:**
- Consumes: `getRegions()` de la Tarea 3.
- Produces: nada nuevo; misma firma del componente.

- [ ] **Step 1: Escribir el test que falla**

Añadir al final de `src/components/ui/ui.test.tsx` (con `RegionGroupedGrid` y `Place` incorporados a los imports que ya haya arriba del fichero — no duplicar los de `vitest` ni `@testing-library/react` si ya están):

```tsx
import { RegionGroupedGrid } from "./RegionGroupedGrid";
import type { Place } from "@/data";

const ciudad = (slug: string, regionSlug?: string): Place => ({
  slug, name: slug, kind: "ciudad", icon: "🏙️", users: 10, votes: 10,
  activity: "Baja", channels: ["chatzona"], related: [], intro: "x",
  ...(regionSlug ? { regionSlug } : {}),
});

describe("RegionGroupedGrid", () => {
  it("funde en un solo grupo las regiones sin sala", () => {
    // jalisco tiene sala; michoacan y nayarit no, y sin agrupar darían dos
    // secciones tituladas ambas "Otras ciudades".
    render(
      <RegionGroupedGrid
        cities={[
          ciudad("guadalajara", "jalisco"),
          ciudad("morelia", "michoacan"),
          ciudad("tepic", "nayarit"),
          ciudad("suelta"),
        ]}
      />
    );
    expect(screen.getAllByText("Otras ciudades")).toHaveLength(1);
  });

  it("deja «Otras ciudades» al final aunque sea el grupo más grande", () => {
    render(
      <RegionGroupedGrid
        cities={[
          ciudad("guadalajara", "jalisco"),
          ciudad("morelia", "michoacan"),
          ciudad("tepic", "nayarit"),
          ciudad("colima-ciudad", "colima"),
        ]}
      />
    );
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos[titulos.length - 1]).toContain("Otras ciudades");
  });
});
```

- [ ] **Step 2: Ejecutarlo y ver que falla**

Run: `npx vitest run src/components/ui/ui.test.tsx -t "Otras ciudades"`
Expected: FAIL — el primero encuentra 3 «Otras ciudades» en vez de 1.

- [ ] **Step 3: Arreglar el agrupado**

En `src/components/ui/RegionGroupedGrid.tsx`, sustituir las líneas 13-19 por:

```tsx
  const groups = new Map<string, Place[]>();
  for (const c of cities) {
    // La clave es el regionSlug SOLO si esa región tiene sala. En España daba
    // igual (las 17 comunidades la tienen), pero México reparte 31 regionSlug
    // con 8 salas: agrupar por el slug a secas daba 23 secciones tituladas
    // todas "Otras ciudades".
    const key = c.regionSlug && regionMap.has(c.regionSlug) ? c.regionSlug : "otras";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  const sorted = [...groups.entries()].sort((a, b) => {
    // El cajón de sobras va al final aunque sea el grupo más numeroso, que en
    // México lo es: 8 estados con sala frente a 23 sin ella.
    if (a[0] === "otras") return 1;
    if (b[0] === "otras") return -1;
    return b[1].length - a[1].length;
  });
```

- [ ] **Step 4: Ejecutar los tests**

Run: `npx vitest run src/components/ui/ui.test.tsx -t "Otras ciudades"`
Expected: PASS los dos.

Run: `npm test`
Expected: PASS. `/chat/espana` no cambia de comportamiento: sus 17 comunidades siguen teniendo sala, así que ninguna cae en «otras».

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/RegionGroupedGrid.tsx src/components/ui/ui.test.tsx
git commit -m "fix(listados): un solo bloque de «Otras ciudades», y al final

El componente creaba una sección por regionSlug y rotulaba igual todas las
que no encontraban sala. En España no se veía porque las 17 comunidades la
tienen; México habría sacado 23 secciones con el mismo título."
```

---

### Task 5: Activar el agrupamiento por región en México

**Files:**
- Modify: `src/app/chat/[slug]/page.tsx:92-102`

**Interfaces:**
- Consumes: `getRegions()` (Tarea 3) y el `RegionGroupedGrid` arreglado (Tarea 4).
- Produces: nada que consuma otra tarea. Es el último eslabón.

- [ ] **Step 1: Cambiar la condición**

En `src/app/chat/[slug]/page.tsx`, sustituir el bloque de las líneas 92-102 (los dos comentarios y las dos constantes) por:

```tsx
  // Un país agrupa sus ciudades por región cuando esas regiones tienen sala a la
  // que enlazar (España y sus comunidades, México y sus estados). Sin salas no
  // hay enlace que ganar y ProvinciaGroupedGrid, que agrupa por el nombre de la
  // provincia, se lee igual de bien: es lo que siguen usando Argentina, Colombia
  // y Perú, cuyas provincias no tienen sala.
  const regionSlugs = new Set(getRegions().map((r) => r.slug));
  const groupByRegion = children.some((c) => c.regionSlug && regionSlugs.has(c.regionSlug));
  // Países grandes sin salas de región: si sus ciudades traen provincia y son
  // demasiadas para una lista plana, se agrupan por provincia.
  const groupByProvincia =
    !groupByRegion &&
    children.length > 30 &&
    children.filter((c) => c.provincia).length >= children.length / 2;
```

- [ ] **Step 2: Comprobar tipos y tests**

Run: `npx tsc --noEmit && npm test`
Expected: sin errores, suite en verde.

- [ ] **Step 3: Construir y verificar el efecto real**

Run: `npm run build`
Expected: el build incluye las 10 rutas nuevas. Comprobarlo:

```bash
grep -cE '/chat/(jalisco|nuevo-leon|yucatan|sonora|coahuila|sinaloa|zulia|chiapas|carabobo|tabasco)</loc>' public/sitemap-*.xml
```
Expected: 10.

- [ ] **Step 4: Comprobar las tres páginas que cambian**

Levantar el sitio (`npm start`) y mirar:

| URL | Qué tiene que verse |
|---|---|
| `/chat/mexico` | ciudades agrupadas por estado, con los 8 encabezados enlazando a su sala, y **un solo** «Otras ciudades» al final |
| `/chat/jalisco` | la sala nueva, con sus 40 ciudades listadas por `getCitiesByRegion` |
| `/chat/espana` | igual que antes: 17 comunidades, ninguna «Otras ciudades» |
| `/chat/argentina` | igual que antes: agrupado por provincia, sin enlaces de encabezado |

- [ ] **Step 5: Pasar los auditores**

Run: `npm run auditar`
Expected: 0 avisos.

Run: `npm run auditar:html`
Expected: ninguna incidencia. Presta atención a las 10 páginas nuevas: título ≤60 caracteres, un solo H1, `about` con su H2.

- [ ] **Step 6: Commit**

```bash
git add src/app/chat/\[slug\]/page.tsx
git commit -m "feat(mexico): las ciudades se agrupan por estado y enlazan a su sala

groupByRegion dejaba fuera a todo el que no fuera España. Ahora se activa
cuando las regiones del país tienen sala, así que México estrena 8 enlaces
de encabezado y Argentina y Colombia se quedan como estaban."
```

---

## Verificación final

Antes de dar el trabajo por cerrado, con evidencia a la vista y no de memoria:

- [ ] `npm test` — la suite entera en verde (eran 433 antes de este plan; deberían ser ~440).
- [ ] `npx tsc --noEmit` y `npx eslint .` — limpios.
- [ ] `npm run auditar` — 0 avisos.
- [ ] Las 10 URLs nuevas responden 200 en local y están en el sitemap.
- [ ] `/chat/mexico` tiene exactamente un «Otras ciudades».
- [ ] `/chat/espana` no ha cambiado.
- [ ] Ninguna de las 10 salas tiene el `about` vacío ni comparte frases con otra.

## Fuera de alcance

Está en la spec y se deja fuera a propósito: salas de provincia argentina o departamento colombiano (ni canal IRC ni demanda), `merida` y `la-rioja` (nombres ambiguos, decisión aparte), y enlazar a tuchat.org desde el resto de la red, que sigue siendo la acción de mayor retorno del dominio y vive fuera de este repositorio.
