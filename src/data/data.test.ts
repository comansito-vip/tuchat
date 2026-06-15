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
});
