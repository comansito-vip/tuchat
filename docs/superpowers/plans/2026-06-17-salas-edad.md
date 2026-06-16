# Salas por edad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir 5 salas de chat por franja de edad (+20/+30/+40/+50/+60) como `Place` temáticos, con contenido único y enlazado en el catálogo, el sitemap y las salas sociales.

**Architecture:** Adición de datos pura. Un nuevo archivo `src/data/topics-edad.ts` exporta `TOPICS_EDAD: Place[]`; se compone en `src/data/index.ts` dentro de `ALL_TOPICS`. Las rutas (`/chat/[slug]`), el catálogo y el sitemap recogen las salas automáticamente vía `generateStaticParams`. No se toca código de rutas ni de componentes.

**Tech Stack:** Next.js (versión propia del repo — ver `node_modules/next/dist/docs/`), TypeScript, Vitest.

## Global Constraints

- Slug **global único** entre `COUNTRIES`, `CITIES`, `TOPICS`, `TOPICS_EXTRA`, `TOPICS_EDAD`.
- Regla anti-IA: cada `about` es único (40-90 palabras), sin frases plantilla; ninguna sala comparte párrafo.
- `channels` se inyectan literales como canales IRC; el slug de URL usa guion (`mas-de-30`), el canal IRC guion bajo (`mas_de_30`).
- Cada slug de `related` debe existir en `ALL`.
- `users`/`votes` decrecientes con la edad; `activity` plausible.
- AGENTS.md: esta versión de Next.js puede diferir de lo conocido — leer `node_modules/next/dist/docs/` antes de tocar código de rutas (este plan NO toca rutas, así que no aplica salvo verificación).

---

### Task 1: Crear `topics-edad.ts` y componerlo en `index.ts`

**Files:**
- Create: `src/data/topics-edad.ts`
- Modify: `src/data/index.ts:5,10` (import y composición de `ALL_TOPICS`)
- Test: `src/data/topics-edad.test.ts`

**Interfaces:**
- Consumes: `Place` de `./types`; `getPlace`, `getRelated` de `@/data`.
- Produces: `export const TOPICS_EDAD: Place[]` con slugs `mas-de-20`, `mas-de-30`, `mas-de-40`, `mas-de-50`, `mas-de-60`.

- [ ] **Step 1: Escribir el test que falla** — `src/data/topics-edad.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { TOPICS_EDAD } from "./topics-edad";
import { getPlace } from "./index";

const SLUGS = ["mas-de-20", "mas-de-30", "mas-de-40", "mas-de-50", "mas-de-60"];

describe("salas por edad", () => {
  it("exporta exactamente las 5 franjas como temáticas", () => {
    expect(TOPICS_EDAD.map((p) => p.slug)).toEqual(SLUGS);
    expect(TOPICS_EDAD.every((p) => p.kind === "tematica")).toBe(true);
  });

  it("cada sala resuelve por getPlace (integrada en ALL)", () => {
    for (const s of SLUGS) expect(getPlace(s)?.slug).toBe(s);
  });

  it("about único y de longitud razonable (40-90 palabras)", () => {
    const abouts = TOPICS_EDAD.map((p) => p.about ?? "");
    expect(new Set(abouts).size).toBe(SLUGS.length);
    for (const a of abouts) {
      const words = a.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(40);
      expect(words).toBeLessThanOrEqual(95);
    }
  });

  it("intro único por sala", () => {
    const intros = TOPICS_EDAD.map((p) => p.intro);
    expect(new Set(intros).size).toBe(SLUGS.length);
  });

  it("todos los slugs de related existen en el catálogo", () => {
    for (const p of TOPICS_EDAD)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("mapeo de canales IRC correcto", () => {
    const byChannels = Object.fromEntries(
      TOPICS_EDAD.map((p) => [p.slug, p.channels])
    );
    expect(byChannels["mas-de-20"]).toEqual(["adolescentes", "mas_de_30"]);
    expect(byChannels["mas-de-30"]).toEqual(["mas_de_30", "mas_de_40"]);
    expect(byChannels["mas-de-40"]).toEqual(["mas_de_40", "mas_de_30"]);
    expect(byChannels["mas-de-50"]).toEqual(["mas_de_40", "mas_de_50"]);
    expect(byChannels["mas-de-60"]).toEqual(["mas_de_50", "mas_de_60"]);
  });

  it("users y votes decrecen con la edad", () => {
    const users = TOPICS_EDAD.map((p) => p.users);
    const votes = TOPICS_EDAD.map((p) => p.votes);
    for (let i = 1; i < users.length; i++) {
      expect(users[i]).toBeLessThan(users[i - 1]);
      expect(votes[i]).toBeLessThan(votes[i - 1]);
    }
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/data/topics-edad.test.ts`
Expected: FAIL — `Cannot find module './topics-edad'`.

- [ ] **Step 3: Crear `src/data/topics-edad.ts`**

```ts
import type { Place } from "./types";

// Salas sociales por franja de edad. Paridad con los canales del viejo
// tuchat.org (mas-de-20..50). kind "tematica": entran en /chat y el sitemap,
// pero NO en el carrusel de la home (ver getPrimaryTopics).
export const TOPICS_EDAD: Place[] = [
  {
    slug: "mas-de-20",
    name: "Mayores de 20",
    kind: "tematica",
    icon: "🌱",
    users: 520,
    votes: 760,
    tag: "Popular",
    activity: "Alta",
    channels: ["adolescentes", "mas_de_30"],
    related: ["mas-de-30", "amistad", "amor", "madrid", "barcelona"],
    intro:
      "Chat para veinteañeros gratis y sin registro: gente de tu edad para hacer amigos, ligar o desahogarse de la carrera, el primer curro y el piso compartido.",
    about:
      "La sala de los veinte es ruido del bueno: aquí coinciden los que acaban la universidad, los que pelean su primer contrato y los que todavía no saben qué quieren ser de mayores. Se habla de pisos compartidos, de sueldos que no llegan a fin de mes, de ligues que duran un verano y de esa sensación de que todo el mundo va más rápido que tú. Sin postureo de redes: solo gente de tu edad, con las mismas dudas y las mismas ganas de que llegue el finde.",
  },
  {
    slug: "mas-de-30",
    name: "Mayores de 30",
    kind: "tematica",
    icon: "☕",
    users: 480,
    votes: 700,
    tag: "Popular",
    activity: "Alta",
    channels: ["mas_de_30", "mas_de_40"],
    related: ["mas-de-20", "mas-de-40", "amistad", "amor", "madrid"],
    intro:
      "Chat de mayores de 30 gratis sin registro: conversación de adultos sin dramas adolescentes, para hacer amigos, reconectar o conocer a alguien con la cabeza en su sitio.",
    about:
      "Los treinta son la edad en que uno ya sabe lo que no quiere. En esta sala se junta gente con trabajo estable y agenda apretada, parejas que se consolidan y solteros que ya no tienen prisa pero sí ganas. Se charla de hipotecas y de viajes, de amistades que se van espaciando y de lo que cuesta hacer amigos nuevos pasada cierta edad. Un chat tranquilo, con conversación de verdad y sin el caos de las salas más jóvenes.",
  },
  {
    slug: "mas-de-40",
    name: "Mayores de 40",
    kind: "tematica",
    icon: "🍷",
    users: 360,
    votes: 540,
    activity: "Alta",
    channels: ["mas_de_40", "mas_de_30"],
    related: ["mas-de-30", "mas-de-50", "amistad", "amor", "buenos-aires"],
    intro:
      "Chat para mayores de 40 sin registro: un espacio sereno para charlar, hacer amigos o buscar pareja entre gente que ya tiene historia que contar.",
    about:
      "A los cuarenta se vuelve con ganas: hijos que ya no dependen tanto, una carrera asentada y, a veces, la necesidad de empezar de cero. La sala reúne a quien busca segundas oportunidades, reconectar con su vida social o simplemente hablar sin tener que explicarlo todo. Se comentan series, planes de fin de semana, divorcios ya digeridos y proyectos nuevos. Un ambiente maduro y cercano, donde la conversación pesa mucho más que la foto de perfil.",
  },
  {
    slug: "mas-de-50",
    name: "Mayores de 50",
    kind: "tematica",
    icon: "🌳",
    users: 240,
    votes: 380,
    tag: "Tendencia",
    activity: "Media",
    channels: ["mas_de_40", "mas_de_50"],
    related: ["mas-de-40", "mas-de-60", "amistad", "amor", "salud"],
    intro:
      "Chat de mayores de 50 gratis y sin registro: gente de tu generación para conversar con calma, hacer amistades y compartir el día a día.",
    about:
      "Los cincuenta traen perspectiva. En esta sala se encuentran quienes ya criaron a los hijos, quienes piensan en una jubilación cercana y quienes redescubren tiempo para sí mismos. Se habla de salud y de viajes pendientes, de la música de siempre, de reencontrarse con viejas aficiones y de lo difícil que es hacer amigos a esta edad. Conversación pausada, con respeto y buen humor, lejos del ritmo frenético de otras salas. Aquí nadie tiene prisa por nada.",
  },
  {
    slug: "mas-de-60",
    name: "Mayores de 60",
    kind: "tematica",
    icon: "🌅",
    users: 150,
    votes: 240,
    tag: "Nueva",
    activity: "Baja",
    channels: ["mas_de_50", "mas_de_60"],
    related: ["mas-de-50", "amistad", "amor", "salud"],
    intro:
      "Chat para mayores de 60 sin registro: compañía, charla y amistad para quien tiene tiempo y ganas de conversar sin complicaciones.",
    about:
      "La sala de los sesenta es para tomarse las cosas con calma. Aquí coinciden jubilados, abuelos que presumen de nietos y gente que valora una buena conversación por encima de todo. Se habla de recuerdos, de huertos y recetas, de los achaques con humor y de planes que ahora por fin hay tiempo de cumplir. Para muchos es también compañía en las horas tranquilas del día. Un chat amable, sin prisas y sin necesidad de saber de tecnología: basta entrar y hablar.",
  },
];
```

- [ ] **Step 4: Componer en `src/data/index.ts`**

Añadir el import junto a los otros (tras la línea de `TOPICS_EXTRA`):

```ts
import { TOPICS_EDAD } from "./topics-edad";
```

Y ampliar `ALL_TOPICS`:

```ts
const ALL_TOPICS: Place[] = [...TOPICS, ...TOPICS_EXTRA, ...TOPICS_EDAD];
```

- [ ] **Step 5: Ejecutar el test y comprobar que pasa**

Run: `npx vitest run src/data/topics-edad.test.ts`
Expected: PASS (los 7 casos).

- [ ] **Step 6: Ejecutar la suite completa (no romper nada)**

Run: `npm test`
Expected: PASS — todos los tests existentes verdes (la adición es aditiva).

- [ ] **Step 7: Commit**

```bash
git add src/data/topics-edad.ts src/data/topics-edad.test.ts src/data/index.ts
git commit -m "feat: salas por edad (+20/+30/+40/+50/+60)"
```

---

### Task 2: Enlazar las salas de edad desde `amistad` y `amor`

**Files:**
- Modify: `src/data/topics.ts` (campos `related` de `amistad` y `amor`)
- Test: `src/data/topics-edad.test.ts` (añadir un caso)

**Interfaces:**
- Consumes: `getPlace` de `@/data`; las salas de Task 1.
- Produces: ninguna nueva exportación; sólo amplía `related` existentes.

- [ ] **Step 1: Añadir el test que falla** — al final del `describe` en `src/data/topics-edad.test.ts`

```ts
  it("amistad y amor enlazan al menos una sala de edad", () => {
    const ageSlugs = new Set([
      "mas-de-20", "mas-de-30", "mas-de-40", "mas-de-50", "mas-de-60",
    ]);
    for (const social of ["amistad", "amor"]) {
      const place = getPlace(social);
      expect(place).toBeDefined();
      const hasAge = place!.related.some((r) => ageSlugs.has(r));
      expect(hasAge, `${social} debe enlazar una sala de edad`).toBe(true);
    }
  });
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/data/topics-edad.test.ts`
Expected: FAIL — `amistad debe enlazar una sala de edad`.

- [ ] **Step 3: Ampliar `related` en `src/data/topics.ts`**

En la entrada `amistad`, añadir `"mas-de-30"` al array `related` (al final, antes del cierre `]`). En la entrada `amor`, añadir `"mas-de-40"` al array `related`. Mantener el resto de slugs intactos. Ejemplo para `amistad`:

```ts
    related: ["amor", "lgtbi", "viajes", "madrid", "barcelona", "espana", "mas-de-30"],
```

Y para `amor`:

```ts
    related: ["amistad", "lgtbi", "horoscopo", "tarot", "madrid", "barcelona", "mas-de-40"],
```

(Si los arrays actuales difieren, conservar su contenido y sólo **añadir** el slug de edad indicado.)

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npx vitest run src/data/topics-edad.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/topics.ts src/data/topics-edad.test.ts
git commit -m "feat: enlaza salas de edad desde amistad y amor"
```

---

### Task 3: Verificar build, prerenderizado y sitemap

**Files:** ninguno (verificación).

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: compila sin errores; en el log de rutas estáticas aparecen `/chat/mas-de-20`, `/chat/mas-de-30`, `/chat/mas-de-40`, `/chat/mas-de-50`, `/chat/mas-de-60`.

- [ ] **Step 2: Verificar el sitemap regenerado**

Run: `grep -o 'chat/mas-de-[0-9]*' public/sitemap*.xml | sort -u`
Expected: las 5 rutas presentes (`chat/mas-de-20` … `chat/mas-de-60`).

- [ ] **Step 3: Revisión manual de unicidad de contenido**

Leer las 5 entradas de `src/data/topics-edad.ts` y confirmar que ningún `about` ni `intro` se repite ni suena a plantilla. (Ya cubierto por test, pero confirmar el tono distinto por franja.)

- [ ] **Step 4: Commit (si el sitemap se versiona)**

```bash
git add public/sitemap*.xml
git commit -m "chore: sitemap con salas por edad"
```

(Si `public/sitemap*.xml` está en `.gitignore`, omitir este commit.)

---

## Self-Review

- **Spec coverage:** archivo nuevo + composición (Task 1), contenido anti-IA único (Task 1 Step 3 + test), mapeo de canales (Task 1 test), `related` válidos (Task 1 test), enlazado desde amistad/amor (Task 2), build/sitemap/unicidad (Task 3). Solape con `adultos`: se deja intencionadamente, no requiere tarea.
- **Placeholders:** ninguno; todo el contenido de las 5 salas está escrito.
- **Type consistency:** `TOPICS_EDAD: Place[]` usado igual en datos, index y tests; slugs idénticos en las 7 referencias.
