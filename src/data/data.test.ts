import { describe, it, expect } from "vitest";
import { getPlace, getRooms, getCities, getTopics, getNews, getCountries, getPrimaryTopics, getStats, getChildren, getRelated, getRanking, getRegions, getRegionsOfCountry, getCitiesByRegion, roomName, roomTitle, roomMetaTitle, CONTINENTS } from "@/data";

describe("títulos de sala", () => {
  const ALL = [...getCountries(), ...getCities(), ...getTopics()];

  it("cada sala emite un <title> distinto (dos salas homónimas no pueden competir por la misma búsqueda)", () => {
    // Sin desambiguar, el Madrid de España y el de Cundinamarca emitían ambos
    // "Chat Madrid gratis". roomTitle() cualifica al no canónico con su
    // provincia o su país: "Chat Madrid (Cundinamarca) gratis".
    const seen = new Map<string, string>();
    const colisiones: string[] = [];
    for (const p of ALL) {
      const title = roomTitle(p);
      const previo = seen.get(title);
      if (previo) colisiones.push(`"${title}" -> ${previo} + ${p.slug}`);
      else seen.set(title, p.slug);
    }
    expect(colisiones).toEqual([]);
  });

  it("los títulos siguen cabiendo en la SERP (≤60 caracteres)", () => {
    const largos = ALL.map((p) => roomTitle(p)).filter((t) => t.length > 60);
    expect(largos).toEqual([]);
  });

  it("las páginas de /tiempo y /ranking tampoco repiten título ni se pasan de la SERP", () => {
    // Mismas ciudades homónimas, mismo problema: /tiempo/madrid y
    // /tiempo/madrid-cundinamarca emitían "Previsión del tiempo en Madrid" los
    // dos. La plantilla del layout añade " · TuChat" (9 chars) a estas rutas.
    const SUFIJO = " · TuChat".length;
    const tiempo = getCities().map((c) => `Tiempo en ${roomName(c)}`);
    const ranking = getCountries().map((c) => `Ranking: mejores chats de ${c.name}`);
    for (const grupo of [tiempo, ranking]) {
      const dupes = grupo.filter((t, i) => grupo.indexOf(t) !== i);
      expect(dupes).toEqual([]);
      expect(grupo.filter((t) => t.length + SUFIJO > 60)).toEqual([]);
    }
  });

  /**
   * El <title> y el H1 eran idénticos en 2.940 páginas, y el <title> medía 21
   * caracteres de mediana cuando Google muestra unos 60: sobraban cuarenta sin
   * usar. El complemento se AÑADE, nunca sustituye, porque el corpus de la red
   * (26 M de impresiones) dice que de las 173 salas con demanda medible en
   * formas con sufijo, en 167 gana "gratis" — cambiarlo por "sin registro",
   * que es el 0,3% de la demanda, sería un mal negocio.
   */
  it("el <title> añade el complemento y el H1 se queda con la forma corta", () => {
    expect(roomMetaTitle(getPlace("madrid")!)).toBe("Chat Madrid gratis sin registro");
    expect(roomTitle(getPlace("madrid")!)).toBe("Chat Madrid gratis");
  });

  it("usa el complemento que la demanda medida da como ganador en esa sala", () => {
    // En estas tres el corpus da "online" por encima de "gratis" (Portugal:
    // 2.424 impresiones frente a 490). "gratis" se conserva igualmente.
    expect(roomMetaTitle(getPlace("portugal")!)).toBe("Chat Portugal gratis online");
    expect(roomMetaTitle(getPlace("nudismo")!)).toContain("online");
  });

  it("no repite un complemento que el título ya lleva", () => {
    // Los títulos propios de los hubs ya dicen "sin registro" a mano.
    const t = roomMetaTitle(getPlace("ligar")!);
    expect(t.match(/sin registro/g)?.length ?? 0).toBeLessThanOrEqual(1);
  });

  it("los <title> con complemento siguen cabiendo en la SERP y sin repetirse", () => {
    const titles = ALL.map((p) => roomMetaTitle(p));
    expect(titles.filter((t) => t.length > 60)).toEqual([]);
    const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(dupes).toEqual([]);
  });

  it("la sala canónica conserva el título limpio y la homónima se cualifica", () => {
    expect(roomTitle(getPlace("madrid")!)).toBe("Chat Madrid gratis");
    expect(roomTitle(getPlace("madrid-cundinamarca")!)).toBe("Chat Madrid (Cundinamarca) gratis");
    // Las salas heredadas ya empiezan por "Chat": no se duplica el prefijo.
    expect(roomTitle(getPlace("terra")!)).toBe("Chat Terra gratis");
  });
});

describe("data getters", () => {
  it("returns the Madrid model room with channels and related", () => {
    const madrid = getPlace("madrid");
    expect(madrid?.name).toBe("Madrid");
    expect(madrid?.kind).toBe("ciudad");
    expect(madrid?.channels).toEqual(["madrid", "españa", "chatzona"]);
    expect(madrid?.related).toContain("getafe");
    expect(madrid?.intro.length).toBeGreaterThan(40);
  });
  it("lists active rooms, cities, topics and news", () => {
    expect(getRooms().length).toBeGreaterThanOrEqual(6);
    expect(getCities().some((c) => c.slug === "barcelona")).toBe(true);
    expect(getTopics().some((t) => t.slug === "amor")).toBe(true);
    expect(getNews().some((n) => n.featured)).toBe(true);
  });
  it("getRooms returns at most 12 rooms sorted by users descending", () => {
    const rooms = getRooms();
    expect(rooms.length).toBeLessThanOrEqual(12);
    for (let i = 1; i < rooms.length; i++) {
      expect(rooms[i].users).toBeLessThanOrEqual(rooms[i - 1].users);
    }
  });
  it("getPrimaryTopics returns a subset of getTopics", () => {
    const primary = getPrimaryTopics();
    const all = getTopics();
    expect(primary.length).toBeGreaterThan(0);
    expect(primary.length).toBeLessThanOrEqual(all.length);
    expect(primary.every((t) => all.some((a) => a.slug === t.slug))).toBe(true);
  });
  it("getStats returns correct counts", () => {
    const stats = getStats();
    expect(stats.countries).toBe(getCountries().length);
    expect(stats.cities).toBe(getCities().length);
    expect(stats.topics).toBe(getTopics().length);
    expect(stats.news).toBe(getNews().length);
    expect(stats.rooms).toBe(getCountries().length + getCities().length + getTopics().length);
    expect(stats.totalVotes).toBeGreaterThan(0);
    expect(stats.totalUsers).toBeGreaterThan(0);
  });
  it("getChildren returns cities of España", () => {
    const children = getChildren("espana");
    expect(children.length).toBeGreaterThan(0);
    expect(children.every((c) => c.parentSlug === "espana")).toBe(true);
  });
  it("getRegions incluye las comunidades españolas, todas con bandera real", () => {
    // Las españolas no cuelgan de ningún país (las ciudades cuelgan de "espana",
    // ellas no); las americanas sí, y es lo que las distingue.
    const esp = getRegions().filter((r) => r.parentSlug === undefined);
    expect(esp.length).toBeGreaterThanOrEqual(16);
    for (const r of esp) expect(r.flagSrc, r.slug).toMatch(/^\/flags\/regiones\//);
  });
  it("getRegions incluye las 11 regiones americanas, que cuelgan de su país", () => {
    const am = getRegions().filter((r) => r.parentSlug !== undefined);
    expect(am.length).toBe(11);
    for (const r of am) expect(["mexico", "venezuela"], r.slug).toContain(r.parentSlug);
  });
  it("cada país recibe sus propias regiones y no las de otro", () => {
    // getRegions() devuelve las 26 juntas: si la tarjeta de España las pidiera
    // todas, enseñaría estados mexicanos, y México no enseñaría ninguno.
    const esp = getRegionsOfCountry("espana");
    const mex = getRegionsOfCountry("mexico");
    expect(esp.length).toBeGreaterThanOrEqual(16);
    expect(mex.map((r) => r.slug).sort()).toEqual([
      "chiapas", "coahuila", "jalisco", "morelos", "nuevo-leon", "sinaloa", "sonora", "tabasco",
      "yucatan",
    ]);
    expect(esp.some((r) => r.slug === "jalisco")).toBe(false);
    expect(getRegionsOfCountry("argentina")).toEqual([]);
  });
  it("una sala de región no se cuela como ciudad en el listado de su país", () => {
    // Cuelgan del país por parentSlug, así que getChildren las devuelve. La
    // página las saca del listado porque ya encabezan su propio grupo: sin eso,
    // Jalisco salía dos veces en /chat/mexico.
    const regiones = new Set(getRegions().map((r) => r.slug));
    const colados = getChildren("mexico").filter((c) => regiones.has(c.slug)).map((c) => c.slug);
    expect(colados.length).toBe(9);
    const listado = getChildren("mexico").filter((c) => !regiones.has(c.slug));
    expect(listado.some((c) => c.slug === "jalisco")).toBe(false);
  });
  it("toda ciudad española tiene provincia y comunidad (regionSlug) asignadas, salvo Ceuta/Melilla", () => {
    const esp = getCities().filter((c) => c.parentSlug === "espana");
    const sinProvincia = esp.filter((c) => !c.provincia).map((c) => c.slug);
    const sinRegion = esp
      .filter((c) => !c.regionSlug && c.slug !== "ceuta" && c.slug !== "melilla")
      .map((c) => c.slug);
    expect(sinProvincia).toEqual([]);
    expect(sinRegion).toEqual([]);
  });
  it("las provincias españolas usan solo nombres canónicos (sin variantes que partan el grupo en dos)", () => {
    // Las páginas /chat/{comunidad} agrupan por el string exacto de `provincia`:
    // "Alicante" y "Alicante/Alacant" crearían DOS grupos con anclas distintas.
    const CANONICAS = new Set([
      "Álava", "Albacete", "Alicante/Alacant", "Almería", "Asturias", "Ávila",
      "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria",
      "Castellón/Castelló", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca",
      "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca",
      "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Murcia",
      "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra",
      "La Rioja", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla",
      "Soria", "Tarragona", "Teruel", "Toledo", "Valencia/València",
      "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Illes Balears",
      "Ceuta", "Melilla",
    ]);
    const fuera = getCities()
      .filter((c) => c.parentSlug === "espana" && c.provincia && !CANONICAS.has(c.provincia))
      .map((c) => `${c.slug}: ${c.provincia}`);
    expect(fuera).toEqual([]);
  });
  it("los regionSlug del censo usan el slug de la sala, no el nombre largo", () => {
    // El censo escribe "Coahuila de Zaragoza" y "Estado de Jalisco"; la sala se
    // llama "coahuila" y "jalisco". Sin normalizar, esas ciudades no encuentran
    // su región y la sala nace vacía.
    const PROHIBIDOS = ["coahuila-de-zaragoza", "estado-de-jalisco"];
    const usados = new Set(getCities().map((c) => c.regionSlug).filter(Boolean));
    const fuera = PROHIBIDOS.filter((p) => usados.has(p));
    expect(fuera).toEqual([]);
  });
  it("getCitiesByRegion devuelve solo ciudades de esa comunidad, y cada regionSlug resuelve a una sala real", () => {
    const regions = getRegions();
    for (const r of regions) {
      const cities = getCitiesByRegion(r.slug);
      expect(cities.length, r.slug).toBeGreaterThan(0);
      expect(cities.every((c) => c.regionSlug === r.slug), r.slug).toBe(true);
    }
  });
  it("getRelated maps slugs to Place objects", () => {
    const related = getRelated(["madrid", "barcelona", "nonexistent"]);
    expect(related).toHaveLength(2); // nonexistent filtered out
    expect(related[0].slug).toBe("madrid");
    expect(related[1].slug).toBe("barcelona");
  });
  it("getRanking returns at most 10 places sorted by votes descending", () => {
    const ranking = getRanking();
    expect(ranking.length).toBeLessThanOrEqual(10);
    expect(ranking.length).toBeGreaterThan(0);
    for (let i = 1; i < ranking.length; i++) {
      expect(ranking[i].votes).toBeLessThanOrEqual(ranking[i - 1].votes);
    }
  });
});

describe("CONTINENTS integrity", () => {
  it("all CONTINENTS slugs reference valid country places", () => {
    const countrySlugs = new Set(getCountries().map((c) => c.slug));
    const violations = CONTINENTS.flatMap((cont) =>
      cont.places
        .filter((p) => !countrySlugs.has(p.slug))
        .map((p) => `${cont.title}: "${p.slug}" (${p.name})`)
    );
    expect(violations).toEqual([]);
  });

  it("no duplicate slugs across CONTINENTS", () => {
    const allSlugs = CONTINENTS.flatMap((c) => c.places.map((p) => p.slug));
    const counts = allSlugs.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    const dupes = Object.entries(counts).filter(([, n]) => n > 1).map(([s]) => s);
    expect(dupes).toEqual([]);
  });

  it("each continent has at least 1 place", () => {
    const empty = CONTINENTS.filter((c) => c.places.length === 0).map((c) => c.title);
    expect(empty).toEqual([]);
  });

  it("every country appears in exactly one continent", () => {
    const countrySlugs = new Set(getCountries().map((c) => c.slug));
    const continentSlugs = CONTINENTS.flatMap((c) => c.places.map((p) => p.slug));
    const missingFromContinents = [...countrySlugs].filter((s) => !continentSlugs.includes(s));
    expect(missingFromContinents).toEqual([]);
    // Count occurrences
    const counts = continentSlugs.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    const multipleContinent = Object.entries(counts).filter(([, n]) => n > 1).map(([s]) => s);
    expect(multipleContinent).toEqual([]);
  });
});

describe("SEO constraints", () => {
  const ALL_PLACES = [...getCountries(), ...getCities(), ...getTopics()];

  it("all place intro texts are ≤160 chars (meta description limit)", () => {
    const violations = ALL_PLACES.filter((p) => p.intro.length > 160).map(
      (p) => `${p.slug}: ${p.intro.length} chars`
    );
    expect(violations).toEqual([]);
  });

  it("all place about texts are ≥400 chars when present", () => {
    const violations = ALL_PLACES.filter(
      (p) => p.about !== undefined && p.about.length < 400
    ).map((p) => `${p.slug}: ${p.about!.length} chars`);
    expect(violations).toEqual([]);
  });

  it("no duplicate place slugs", () => {
    const slugs = ALL_PLACES.map((p) => p.slug);
    const counts = slugs.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    const dupes = Object.entries(counts)
      .filter(([, n]) => n > 1)
      .map(([s]) => s);
    expect(dupes).toEqual([]);
  });

  it("ninguna ciudad enlaza a la homónima extranjera teniendo una en su país", () => {
    // Bug real al añadir los municipios españoles: los pueblos de Granada
    // enlazaban a la Santa Fe de Argentina y los de Cáceres al Trujillo de
    // Perú, porque el nombre coincide y el slug "limpio" ya estaba ocupado.
    // Enlazar a una ciudad extranjera NO es un fallo por sí mismo (Buenos Aires
    // enlaza a Montevideo a propósito); lo es solo cuando existe otra ciudad
    // con ESE MISMO NOMBRE en el país de la sala: entonces se quiso la de casa.
    const cities = ALL_PLACES.filter((p) => p.kind === "ciudad");
    const violations = cities.flatMap((c) =>
      c.related
        .map((r) => cities.find((p) => p.slug === r))
        .filter(
          (p) =>
            p &&
            p.parentSlug !== c.parentSlug &&
            cities.some((local) => local.parentSlug === c.parentSlug && local.name === p.name),
        )
        .map((p) => `${c.slug} (${c.parentSlug}) → ${p!.slug} (${p!.parentSlug})`),
    );
    expect(violations).toEqual([]);
  });

  it("all news articles have body, excerpt, and valid date format", () => {
    const articles = getNews();
    const violations = articles
      .filter((a) => !a.body || !a.excerpt || !/^\d{4}-\d{2}-\d{2}$/.test(a.date))
      .map((a) => a.slug);
    expect(violations).toEqual([]);
  });

  it("all news article excerpts are ≤160 chars (used as meta description)", () => {
    const articles = getNews();
    const violations = articles
      .filter((a) => a.excerpt.length > 160)
      .map((a) => `${a.slug}: ${a.excerpt.length} chars`);
    expect(violations).toEqual([]);
  });

  it("all news article titles are ≤110 chars (schema.org NewsArticle headline limit)", () => {
    const articles = getNews();
    const violations = articles
      .filter((a) => a.title.length > 110)
      .map((a) => `${a.slug}: ${a.title.length} chars`);
    expect(violations).toEqual([]);
  });

  it("all news article bodies have ≥400 words", () => {
    const articles = getNews();
    const violations = articles
      .filter((a) => !a.body || a.body.trim().split(/\s+/).length < 400)
      .map((a) => `${a.slug}: ${a.body ? a.body.trim().split(/\s+/).length : 0} words`);
    expect(violations).toEqual([]);
  });

  it("exactly one news article is featured", () => {
    const articles = getNews();
    const featured = articles.filter((a) => a.featured);
    expect(featured).toHaveLength(1);
  });

  it("all article dates are valid ISO dates and not in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    const violations = getNews()
      .filter((a) => !/^\d{4}-\d{2}-\d{2}$/.test(a.date) || a.date > today)
      .map((a) => `${a.slug}: ${a.date}`);
    expect(violations).toEqual([]);
  });

  it("no duplicate article slugs", () => {
    const slugs = getNews().map((a) => a.slug);
    const counts = slugs.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    const dupes = Object.entries(counts).filter(([, n]) => n > 1).map(([s]) => s);
    expect(dupes).toEqual([]);
  });

  it("no duplicate article titles", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const a of getNews()) {
      if (seen.has(a.title)) dupes.push(`${a.slug} duplicates ${seen.get(a.title)}`);
      else seen.set(a.title, a.slug);
    }
    expect(dupes).toEqual([]);
  });

  it("no duplicate article excerpts", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const a of getNews()) {
      if (seen.has(a.excerpt)) dupes.push(`${a.slug} duplicates ${seen.get(a.excerpt)}`);
      else seen.set(a.excerpt, a.slug);
    }
    expect(dupes).toEqual([]);
  });

  it("no duplicate article body openings (first 100 chars)", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const a of getNews()) {
      if (!a.body) continue;
      const opening = a.body.trim().slice(0, 100);
      if (seen.has(opening)) dupes.push(`${a.slug} duplicates ${seen.get(opening)}`);
      else seen.set(opening, a.slug);
    }
    expect(dupes).toEqual([]);
  });

  it("all article categories are from the allowed set", () => {
    const VALID = new Set(["Actualidad", "Deportes", "Tecnología", "IA", "Cultura", "Viajes", "Salud", "Economía", "Entretenimiento"]);
    const violations = getNews()
      .filter((a) => !VALID.has(a.category))
      .map((a) => `${a.slug}: "${a.category}"`);
    expect(violations).toEqual([]);
  });

  it("each category has at least 2 articles", () => {
    const counts: Record<string, number> = {};
    for (const a of getNews()) counts[a.category] = (counts[a.category] ?? 0) + 1;
    const thin = Object.entries(counts).filter(([, n]) => n < 2).map(([c]) => c);
    expect(thin).toEqual([]);
  });

  it("all city parentSlug values reference a valid country slug", () => {
    const countrySlugs = new Set(getCountries().map((c) => c.slug));
    const violations = getCities()
      .filter((c) => c.parentSlug !== undefined && !countrySlugs.has(c.parentSlug))
      .map((c) => `${c.slug} -> ${c.parentSlug}`);
    expect(violations).toEqual([]);
  });

  it("all related slugs reference a valid place", () => {
    const allSlugs = new Set(ALL_PLACES.map((p) => p.slug));
    const violations = ALL_PLACES.flatMap((p) =>
      p.related
        .filter((r) => !allSlugs.has(r))
        .map((r) => `${p.slug}.related -> ${r}`)
    );
    expect(violations).toEqual([]);
  });

  /**
   * Jávea enlazaba dos veces con Benissa, y el copy generado lo cantaba: «Salas
   * cercanas en el portal: Benissa, Benissa, Teulada…». Un enlace repetido no
   * añade nada y en la página se lee como un error.
   */
  it("ninguna sala repite un related ni se enlaza a sí misma", () => {
    const violations = ALL_PLACES.flatMap((p) => {
      const problemas: string[] = [];
      if (new Set(p.related).size !== p.related.length) problemas.push(`${p.slug}: related duplicado`);
      if (p.related.includes(p.slug)) problemas.push(`${p.slug}: se enlaza a sí misma`);
      return problemas;
    });
    expect(violations).toEqual([]);
  });

  /**
   * Las tres Méridas se llaman «Mérida» a secas, así que la FAQ de la sala del
   * término salía diciendo «Las más cercanas son Mérida, Mérida, Mérida». El
   * copy debe usar `roomName()`, que cualifica los homónimos con su provincia o
   * su país; este test vigila el dato, que es lo que puede volver a romperlo.
   */
  it("los related de una sala no colisionan de nombre una vez cualificados", () => {
    const violations = ALL_PLACES.flatMap((p) => {
      const nombres = getRelated(p.related).map(roomName);
      return new Set(nombres).size === nombres.length
        ? []
        : [`${p.slug} → ${nombres.join(", ")}`];
    });
    expect(violations).toEqual([]);
  });

  it("all topic parentSlug values reference a valid place", () => {
    const allSlugs = new Set(ALL_PLACES.map((p) => p.slug));
    const violations = getTopics()
      .filter((t) => t.parentSlug !== undefined && !allSlugs.has(t.parentSlug))
      .map((t) => `${t.slug} -> ${t.parentSlug}`);
    expect(violations).toEqual([]);
  });

  it("all city parentName values match their parent country's name", () => {
    const countryNames = Object.fromEntries(getCountries().map((c) => [c.slug, c.name]));
    const violations = getCities()
      .filter((c) => c.parentSlug && countryNames[c.parentSlug] && c.parentName !== countryNames[c.parentSlug])
      .map((c) => `${c.slug}: parentName="${c.parentName}", expected="${countryNames[c.parentSlug!]}"`);
    expect(violations).toEqual([]);
  });

  it("all places have at least one channel defined", () => {
    const violations = ALL_PLACES.filter((p) => !p.channels || p.channels.length === 0)
      .map((p) => p.slug);
    expect(violations).toEqual([]);
  });

  it("all channel names are lowercase and non-empty", () => {
    const violations = ALL_PLACES.flatMap((p) =>
      p.channels
        .filter((c) => !c || c !== c.toLowerCase() || /\s/.test(c))
        .map((c) => `${p.slug}: "${c}"`)
    );
    expect(violations).toEqual([]);
  });

  it("all places have at least one related slug", () => {
    const violations = ALL_PLACES.filter((p) => !p.related || p.related.length === 0)
      .map((p) => p.slug);
    expect(violations).toEqual([]);
  });

  it("all places have a non-empty icon", () => {
    const violations = ALL_PLACES.filter((p) => !p.icon || p.icon.trim().length === 0)
      .map((p) => p.slug);
    expect(violations).toEqual([]);
  });

  it("countries have kind=pais, cities have kind=ciudad, topics have kind=tematica", () => {
    const countryViolations = getCountries().filter((p) => p.kind !== "pais").map((p) => p.slug);
    const cityViolations = getCities().filter((p) => p.kind !== "ciudad").map((p) => p.slug);
    const topicViolations = getTopics().filter((p) => p.kind !== "tematica").map((p) => p.slug);
    expect([...countryViolations, ...cityViolations, ...topicViolations]).toEqual([]);
  });

  it("all places have non-empty intro text", () => {
    const violations = ALL_PLACES.filter((p) => !p.intro || p.intro.trim().length === 0)
      .map((p) => p.slug);
    expect(violations).toEqual([]);
  });

  it("all places have users > 0 and votes > 0", () => {
    const violations = ALL_PLACES.filter((p) => p.users <= 0 || p.votes <= 0)
      .map((p) => `${p.slug}: users=${p.users}, votes=${p.votes}`);
    expect(violations).toEqual([]);
  });

  it("all places have a valid activity level", () => {
    const VALID = new Set(["Alta", "Media", "Baja"]);
    const violations = ALL_PLACES.filter((p) => !VALID.has(p.activity))
      .map((p) => `${p.slug}: "${p.activity}"`);
    expect(violations).toEqual([]);
  });

  it("all place intro texts are unique (no duplicated content)", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const p of ALL_PLACES) {
      if (seen.has(p.intro)) dupes.push(`${p.slug} duplicates ${seen.get(p.intro)}`);
      else seen.set(p.intro, p.slug);
    }
    expect(dupes).toEqual([]);
  });

  it("all place about texts are unique when present", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const p of ALL_PLACES) {
      if (!p.about) continue;
      if (seen.has(p.about)) dupes.push(`${p.slug} duplicates ${seen.get(p.about)}`);
      else seen.set(p.about, p.slug);
    }
    expect(dupes).toEqual([]);
  });
});
