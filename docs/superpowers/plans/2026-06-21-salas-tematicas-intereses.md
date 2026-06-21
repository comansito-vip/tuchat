# Salas temáticas de intereses y comunidades — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir ~173 salas temáticas nuevas (`Place`) al catálogo, con contenido único de calidad, integradas en `/chat`, catálogo y sitemap, validadas por un test de invariantes.

**Architecture:** Un fichero de datos nuevo `src/data/topics-intereses.ts` (exporta `TOPICS_INTERESES: Place[]`), agregado a `ALL_TOPICS` en `src/data/index.ts`, con un test `src/data/topics-intereses.test.ts`. El contenido se añade en 6 lotes; tras cada lote se corre el test de invariantes.

**Tech Stack:** TypeScript, Vitest, Next.js (repo `tuchat`).

## Global Constraints

- Cada sala: `kind: "tematica"`, `intro` ≤ 160 caracteres, `about` ≥ 400 caracteres.
- `intro` y `about` **únicos** en todo el catálogo `ALL` (countries + cities + topics).
- `votes > users`; rangos plausibles (`users` ≈ 100–360, `votes` ≈ 175–620).
- Todos los slugs de `related` deben existir en el catálogo.
- `channels` y `parentSlug`/`parentName` según el spec `docs/superpowers/specs/2026-06-21-salas-tematicas-comunidades-design.md` (§3 y §4).
- Voz coherente con las salas existentes: concreta, coloquial, detalles reales; nada de plantilla ni relleno. Sin reutilizar frases entre salas.
- NO modificar `topics.ts`, `topics-extra.ts`, `topics-legacy.ts`, `topics-edad.ts` ni `badoo`.
- `tinder`/`meetic`: disclaimer explícito de "no oficial, solo opiniones/experiencias".

---

### Task 1: Scaffold del fichero, integración y test de invariantes

**Files:**
- Create: `src/data/topics-intereses.ts`
- Modify: `src/data/index.ts`
- Test: `src/data/topics-intereses.test.ts`

**Interfaces:**
- Produces: `export const TOPICS_INTERESES: Place[]` (vacío al principio); se añade a `ALL_TOPICS` en `index.ts`.

- [ ] **Step 1: Crear el fichero de datos vacío**

```ts
// src/data/topics-intereses.ts
import type { Place } from "./types";

// Salas temáticas de intereses y comunidades. Contenido único anti-IA por sala.
// Entran en /chat, el catálogo y el sitemap; fuera del carrusel de la home.
// Canales y jerarquía según docs/superpowers/specs/2026-06-21-...-design.md.
export const TOPICS_INTERESES: Place[] = [];
```

- [ ] **Step 2: Integrar en `index.ts`**

Modify `src/data/index.ts`: importar y añadir a `ALL_TOPICS`.

```ts
import { TOPICS_INTERESES } from "./topics-intereses";
// ...
const ALL_TOPICS: Place[] = [...TOPICS, ...TOPICS_EXTRA, ...TOPICS_EDAD, ...TOPICS_LEGACY, ...TOPICS_INTERESES];
```

- [ ] **Step 3: Escribir el test de invariantes**

```ts
// src/data/topics-intereses.test.ts
import { describe, it, expect } from "vitest";
import { TOPICS_INTERESES } from "./topics-intereses";
import { getPlace, getCountries, getCities, getTopics } from "./index";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas temáticas de intereses", () => {
  it("todas kind tematica y resuelven por getPlace", () => {
    for (const p of TOPICS_INTERESES) {
      expect(p.kind).toBe("tematica");
      expect(getPlace(p.slug)?.slug).toBe(p.slug);
    }
  });

  it("slugs únicos globalmente", () => {
    const slugs = ALL.map((p) => p.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it("intro ≤160 y about ≥400", () => {
    for (const p of TOPICS_INTERESES) {
      expect(p.intro.length, `${p.slug} intro=${p.intro.length}`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
  });

  it("intro y about únicos en todo el catálogo", () => {
    const intros = ALL.map((p) => p.intro);
    const abouts = ALL.map((p) => p.about).filter(Boolean);
    expect(intros.length - new Set(intros).size, "intros duplicados").toBe(0);
    expect(abouts.length - new Set(abouts).size, "abouts duplicados").toBe(0);
  });

  it("related existen en el catálogo", () => {
    for (const p of TOPICS_INTERESES)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("parentSlug, si existe, resuelve a un Place", () => {
    for (const p of TOPICS_INTERESES)
      if (p.parentSlug)
        expect(getPlace(p.parentSlug), `parent roto: ${p.parentSlug} en ${p.slug}`).toBeDefined();
  });

  it("votes > users", () => {
    for (const p of TOPICS_INTERESES)
      expect(p.votes, `${p.slug}`).toBeGreaterThan(p.users);
  });
});
```

- [ ] **Step 4: Correr el test (pasa en vacío)**

Run: `npx vitest run src/data/topics-intereses.test.ts`
Expected: PASS (todas las aserciones se cumplen vacuamente con array vacío).

- [ ] **Step 5: Commit**

```bash
git add src/data/topics-intereses.ts src/data/topics-intereses.test.ts src/data/index.ts
git commit -m "feat(data): scaffold topics-intereses + test de invariantes"
```

---

### Tasks 2–7: Lotes de contenido

Cada lote sigue el **mismo patrón de 3 pasos**. Para cada slug del lote, añadir
un objeto `Place` a `TOPICS_INTERESES` con: `slug`, `name`, `kind:"tematica"`,
`icon`, `users`, `votes` (>users), `tag?`, `activity`, `parentSlug`/`parentName`
(si aplica, ver spec §4), `channels` (ver spec §3), `related` (4–6 slugs
existentes) e `intro`/`about` únicos siguiendo el ejemplo y las Global Constraints.

**Patrón por lote:**
- [ ] Step A: Añadir todos los objetos del lote a `TOPICS_INTERESES`.
- [ ] Step B: `npx vitest run src/data/topics-intereses.test.ts` → PASS (corregir colisiones de intro/about/related si falla).
- [ ] Step C: Commit `feat(data): salas lote LN — <categorías>`.

**Ejemplo canónico de objeto (anclar voz y formato):**

```ts
{
  slug: "ingles", name: "Inglés", kind: "tematica", icon: "🇬🇧",
  users: 240, votes: 470, tag: "Tendencia", activity: "Alta",
  parentSlug: "idiomas", parentName: "Idiomas",
  channels: ["internacional", "ocio"],
  related: ["idiomas", "intercambioidiomas", "spanish", "viajes", "tecnologia"],
  intro: "Practica inglés charlando con nativos y estudiantes: dudas de gramática, phrasal verbs y ese acento que se te resiste. Sin registro.",
  about: "La sala para soltarse con el inglés de verdad: hablando. Aquí conviven nativos que echan una mano, profesores que explican por qué 'make' y 'do' no son lo mismo, y estudiantes que pierden el miedo a equivocarse. Se resuelven dudas de gramática, se practican los dichosos phrasal verbs, se comparten series, pódcasts y canciones para afinar el oído, y se debate si el británico o el americano suena mejor. También funciona como intercambio: tú ayudas con tu español y alguien te corrige el inglés. Trae preguntas, paciencia y ganas de meter la pata: es la única forma de aprender." // ≥400
},
```

- **Task 2 — Lote L1 (24):** Idiomas (idiomas, ingles, frances, italiano, aleman, portugues, intercambioidiomas) · Africanos (africa, argelia, egipto, tetuan, nador, tanger, casablanca) · Religión (religion, cristianos, chatcristiano, oracion, biblia, jovenescristianos, fe, espiritualidad, catolicos, debatereligioso). Hubs nuevos: `idiomas`, `africa`, `religion` (sin parent). Canales: idiomas→`["internacional","ocio"]`; africanos→`["arabe","marruecos","ocio"]`; religión→`["religion","cristianos","cristiano"]`.

- **Task 3 — Lote L2 (20):** Hobbies (hobbies, naturaleza, senderismo, montana, playas, ecologia, manualidades, fotografia, coleccionismo, jardineria) · Cultura (arte, teatro; parent `cultura`) · Historia (historiaespana, historiaantigua, segundaguerra, curiosidadeshistoricas; parent `historia`) · Mascotas (perros, gatos, adopciones, veterinaria; parent `animalear`). Hub nuevo: `hobbies`. Canales: hobbies→`["hobbies","ocio"]`; cultura→`["cultura","ocio"]`; historia→`["historia","cultura","ocio"]`; mascotas→`["mascotas","ocio"]`.

- **Task 4 — Lote L3 (37):** Empleo (empleo, trabajo, ofertasempleo, freelance, teletrabajo, oposiciones, estudiantes, universidad, estudiar, practicas) · Salud (bienestar, ansiedad, apoyo, vidasana, saludmental, fitness, gym, adelgazar, nutricion, running, entrenamiento; parent `salud`) · Viajes (mochileros, turismo, viajarbarato, escapadas, viajeros; parent `viajes`) · Cocina (recetas, gastronomia, comidasana, postres, cocinacasera; parent `cocina`) · Tecnología (ia, chatgpt, programacion, moviles, gadgets, ciberseguridad; parent `tecnologia`). Hub nuevo: `empleo`. Canales: empleo→`["empleo","ocio"]`; salud→`["salud","ocio"]` (ansiedad/saludmental→`["salud","psicologia","ocio"]`); viajes→`["viajes","ocio"]`; cocina→`["cocina","ocio"]`; tecnología→`["tecnologia","ocio"]` (ia/chatgpt→`["tecnologia","inteligencia_artificial","ocio"]`).

- **Task 5 — Lote L4 (43):** Deportes (laliga, champions, mundial2026, seleccionargentina, seleccionespanola, nba, tenis, boxeo, ufc; parent `deportes`, selecciones/ligas→`futbol`) · Política (politicaespana, politicalatam, debatepolitico, actualidad, noticias, opinion, tertulia; parent `politica`) · Música (reggaeton, pop, rock, electronica, flamenco, kpop; parent `musica`) · Series (peliculas, netflix, primevideo, marvel, terror; parent `series`) · Gaming (fortnite, minecraft, lol, valorant, roblox, gta, quiz, preguntados, retos, culturageneral; parent `juegos`) · Anime (otaku; parent `anime`) · Fans (fandoms, harrypotter, starwars, kpopfans, animefans; hub nuevo `fandoms`). Canales: deportes→`["<propio>","deportes","ocio"]`; política→`["politica","ocio"]`; música→`["musica","ocio"]`; series→`["cine","series","ocio"]`; gaming→`["juegos","ocio"]` (quiz/preguntados/retos/culturageneral→`["trivial","trivias"]`); anime→`["anime","ocio"]`; fans→`["fans","anime","ocio"]`.

- **Task 6 — Lote L5 (23):** Amistad (haceramigos, amigos, amistadgratis, conocergente; parent `amistad`) · Amor (buscarpareja, encontraramor, corazon, flirt, citas, chatligar; parent `amor`) · Apps de citas (tinder, meetic; parent `amor`) · Mayores (mayores40, solteros40, amistad40, ligar40 → parent `mas-de-40`; mayores50, solteros50, amistad50, ligar50 → parent `mas-de-50`) · Singles (singles, divorciados, separados; hub nuevo `singles`). Canales: amistad→`["amor","amistad"]`; amor→`["amor","amistad"]` (flirt/chatligar→`["ligar","ligame"]`; citas→`["amor","general"]`); tinder/meetic→`["amor","general"]`; mayores40→`["mas_de_40","mas_de_50"]`, mayores50→`["mas_de_50","mas_de_40"]`; singles→`["amor","ligar"]`.

- **Task 7 — Lote L6 (26):** Contactos gay (chatgay, gaysespana, gayslatinos; parent `gay`; `["gay","chueca","de_ambiente"]`) · Contactos lesbianas (chatlesbianas, mujereslesbianas, lesbico, lgtblesbianas; parent `lesbianas`; `["lesbianas","lescontactos"]`) · Contactos adultos (mayores18, chatadultos, adultos30, adultos40; parent `adultos`; `["parejas","cornudos"]`) · Contactos genéricos (contactos[hub nuevo], contactosgratis, conocerpersonas, solteros, solteras; `["amor","ligar"]`) · Hispanos (hispanosenusa, latinosusa, texas, argentinosenelexterior, venezolanosenusa, colombianosenusa; parent `hispanos`; `["usa","latinos"]`) · Jóvenes (jovenes[hub nuevo], universitarios, amistadjoven, chatjoven; `["adolescentes","ocio"]`).

---

### Task 8: Finalización — lock de conteo, suite completa y build

**Files:**
- Modify: `src/data/topics-intereses.test.ts`

- [ ] **Step 1: Añadir aserción de conteo exacto**

```ts
it("añade 173 salas de intereses", () => {
  expect(TOPICS_INTERESES).toHaveLength(173);
});
```

- [ ] **Step 2: Correr la suite completa**

Run: `npm test`
Expected: PASS (incluye `merged.test.ts`, `data.test.ts`, `seo.test.ts`).

- [ ] **Step 3: Build de producción**

Run: `npm run build`
Expected: build OK; el sitemap incluye las nuevas rutas.

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat(data): lock conteo 173 salas de intereses + verificación"
```
```
```

## Notas de ejecución
- El test de unicidad de `intro`/`about` es la red de seguridad principal: si dos
  salas comparten frase, el test falla con el slug culpable → reescribir.
- `related` puede apuntar a hermanas del mismo lote (ya están en el array) y a
  temáticas/ciudades existentes.
- Verificar variedad real de contenido: cada `about` debe tener detalles propios
  del tema (nombres, ejemplos, jerga), no parafrasear al vecino.
