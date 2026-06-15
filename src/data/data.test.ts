import { describe, it, expect } from "vitest";
import { getPlace, getRooms, getCities, getTopics, getNews, getCountries } from "@/data";

describe("data getters", () => {
  it("returns the Madrid model room with channels and related", () => {
    const madrid = getPlace("madrid");
    expect(madrid?.name).toBe("Madrid");
    expect(madrid?.kind).toBe("ciudad");
    expect(madrid?.channels).toEqual(["madrid", "espana", "amistad", "chatzona"]);
    expect(madrid?.related).toContain("barcelona");
    expect(madrid?.intro.length).toBeGreaterThan(40);
  });
  it("lists active rooms, cities, topics and news", () => {
    expect(getRooms().length).toBeGreaterThanOrEqual(6);
    expect(getCities().some((c) => c.slug === "barcelona")).toBe(true);
    expect(getTopics().some((t) => t.slug === "amor")).toBe(true);
    expect(getNews().some((n) => n.featured)).toBe(true);
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

  it("all place about texts are ≥300 chars when present", () => {
    const violations = ALL_PLACES.filter(
      (p) => p.about !== undefined && p.about.length < 300
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

  it("all news article bodies have ≥250 words", () => {
    const articles = getNews();
    const violations = articles
      .filter((a) => !a.body || a.body.trim().split(/\s+/).length < 250)
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
